import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Menu, User, Search, Dumbbell } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  
  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-neutral-200 shadow-sm" data-testid="navbar">
      <div className="container-max">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer group" data-testid="link-home">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <Dumbbell className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  CoachBnB
                </h1>
              </div>
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              <Link href="/search">
                <div className="flex items-center gap-2 text-neutral-700 hover:text-primary px-4 py-2 rounded-lg hover:bg-neutral-50 text-sm font-semibold transition-all cursor-pointer" data-testid="link-search">
                  <Search className="h-4 w-4" />
                  Find Coaches
                </div>
              </Link>
              <Link href="/for-coaches">
                <div className="text-neutral-600 hover:text-primary px-4 py-2 rounded-lg hover:bg-neutral-50 text-sm font-medium transition-all cursor-pointer" data-testid="link-for-coaches">
                  For Coaches
                </div>
              </Link>
              <span className="text-neutral-600 hover:text-primary px-4 py-2 rounded-lg hover:bg-neutral-50 text-sm font-medium cursor-pointer transition-all">
                Help
              </span>
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="hidden lg:flex text-neutral-700 hover:text-primary hover:bg-neutral-50 font-semibold"
              onClick={() => window.location.href = "/become-a-coach"}
              data-testid="button-become-coach"
            >
              Become a Coach
            </Button>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-sm font-medium text-neutral-700" data-testid="text-user-greeting">
                  Hello, {(user as any)?.name || (user as any)?.firstName || "User"}
                </span>
                <div 
                  className="flex items-center gap-2 border-2 border-neutral-200 rounded-full pl-3 pr-2 py-1.5 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group" 
                  onClick={handleLogout}
                  data-testid="button-user-menu"
                >
                  <Menu className="h-4 w-4 text-neutral-600 group-hover:text-primary" />
                  {(user as any)?.profileImageUrl ? (
                    <img 
                      src={(user as any).profileImageUrl} 
                      alt="Profile" 
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-white"
                      data-testid="img-user-avatar"
                    />
                  ) : (
                    <div className="w-9 h-9 gradient-primary rounded-full flex items-center justify-center shadow-md">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link href="/login">
                <Button 
                  className="gradient-primary text-white font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
                  data-testid="button-login"
                >
                  Log In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
