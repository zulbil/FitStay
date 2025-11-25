"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Dumbbell, Search, Menu, User, LogOut, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-neutral-200 shadow-sm">
      <div className="container-max">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer group">
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
                <div className="flex items-center gap-2 text-neutral-700 hover:text-primary px-4 py-2 rounded-lg hover:bg-neutral-50 text-sm font-semibold transition-all cursor-pointer">
                  <Search className="h-4 w-4" />
                  Find Coaches
                </div>
              </Link>
              <Link href="/for-coaches">
                <div className="text-neutral-600 hover:text-primary px-4 py-2 rounded-lg hover:bg-neutral-50 text-sm font-medium transition-all cursor-pointer">
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
            <Link href="/become-a-coach">
              <Button 
                variant="ghost" 
                className="hidden lg:flex text-neutral-700 hover:text-primary hover:bg-neutral-50 font-semibold"
              >
                Become a Coach
              </Button>
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-sm font-medium text-neutral-700">
                  Hello, {session?.user?.name || "User"}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 border-2 border-neutral-200 rounded-full pl-3 pr-2 py-1.5 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group">
                      <Menu className="h-4 w-4 text-neutral-600 group-hover:text-primary" />
                      {session?.user?.image ? (
                        <img 
                          src={session.user.image} 
                          alt="Profile" 
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-white"
                        />
                      ) : (
                        <div className="w-9 h-9 gradient-primary rounded-full flex items-center justify-center shadow-md">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session?.user?.name || "User"}
                        </p>
                        <p className="text-xs leading-none text-neutral-500">
                          {session?.user?.email || ""}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link href="/login">
                <Button className="gradient-primary text-white font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all">
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
