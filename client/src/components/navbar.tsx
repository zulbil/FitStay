import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Menu, User } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  
  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-primary cursor-pointer">CoachBnB</h1>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/search" className="text-neutral-800 hover:text-primary px-3 py-2 text-sm font-medium">
                Find Coaches
              </Link>
              <Link href="/for-coaches" className="text-neutral-600 hover:text-primary px-3 py-2 text-sm font-medium">
                For Coaches
              </Link>
              <span className="text-neutral-600 hover:text-primary px-3 py-2 text-sm font-medium cursor-pointer">Help</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-neutral-600 hover:text-primary">
              Become a Coach
            </Button>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-neutral-600">Hello, {(user as any)?.name || (user as any)?.firstName || "User"}</span>
                <div className="flex items-center space-x-2 border border-neutral-200 rounded-full px-4 py-2 hover:shadow-md transition-shadow cursor-pointer" onClick={handleLogout}>
                  <Menu className="h-4 w-4 text-neutral-600" />
                  {(user as any)?.profileImageUrl ? (
                    <img 
                      src={(user as any).profileImageUrl} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Button onClick={() => window.location.href = "/api/login"} className="bg-primary hover:bg-primary/90">
                Log In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
