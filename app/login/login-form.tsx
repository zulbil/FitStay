"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SiGoogle, SiFacebook, SiApple } from "react-icons/si";
import { User, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [error, setError] = useState("");
  
  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Signup form state
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  
  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const result = await signIn("credentials", {
        username: loginUsername,
        password: loginPassword,
        redirect: false,
      });
      
      if (result?.error) {
        setError("Invalid username or password");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupUsername,
          email: signupEmail,
          password: signupPassword,
          firstName: signupFirstName,
          lastName: signupLastName,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to create account");
        return;
      }
      
      // Auto sign in after signup
      await signIn("credentials", {
        username: signupUsername,
        password: signupPassword,
        callbackUrl: "/",
      });
    } catch (error) {
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <Tabs defaultValue="oauth">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="oauth">Quick Sign In</TabsTrigger>
          <TabsTrigger value="credentials">Email & Password</TabsTrigger>
        </TabsList>
        
        <TabsContent value="oauth">
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full py-6 flex items-center justify-center gap-3"
              onClick={() => handleOAuthSignIn("google")}
              disabled={isLoading}
            >
              <SiGoogle className="w-5 h-5" />
              <span>Continue with Google</span>
            </Button>
            
            <Button
              variant="outline"
              className="w-full py-6 flex items-center justify-center gap-3"
              onClick={() => handleOAuthSignIn("facebook")}
              disabled={isLoading}
            >
              <SiFacebook className="w-5 h-5 text-blue-600" />
              <span>Continue with Facebook</span>
            </Button>
            
            <Button
              variant="outline"
              className="w-full py-6 flex items-center justify-center gap-3"
              onClick={() => handleOAuthSignIn("apple")}
              disabled={isLoading}
            >
              <SiApple className="w-5 h-5" />
              <span>Continue with Apple</span>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="credentials">
          <div className="flex gap-2 mb-6">
            <Button
              type="button"
              onClick={() => setShowSignup(false)}
              className={`flex-1 py-2 ${!showSignup ? "gradient-primary text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
            >
              Login
            </Button>
            <Button
              type="button"
              onClick={() => setShowSignup(true)}
              className={`flex-1 py-2 ${showSignup ? "gradient-primary text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
            >
              Sign Up
            </Button>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          
          {!showSignup ? (
            <form onSubmit={handleCredentialsSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full gradient-primary text-white font-semibold py-3"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Log In"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <Input
                    type="text"
                    placeholder="John"
                    value={signupFirstName}
                    onChange={(e) => setSignupFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Doe"
                    value={signupLastName}
                    onChange={(e) => setSignupLastName(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Choose a username"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Create a password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full gradient-primary text-white font-semibold py-3"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 pt-6 border-t text-center">
        <p className="text-sm text-gray-500">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
      
      <div className="mt-4 text-center">
        <Link href="/" className="text-primary hover:underline text-sm">
          Browse coaches without signing in
        </Link>
      </div>
    </div>
  );
}
