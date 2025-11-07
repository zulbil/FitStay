import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { SocialAuth } from "@/components/SocialAuth";
import { UserPlus, Lock, User, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Login() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<{ username?: string; password?: string }>({});
  
  // Signup form state
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupErrors, setSignupErrors] = useState<{ 
    username?: string; 
    email?: string; 
    password?: string; 
    confirmPassword?: string;
  }>({});

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: z.infer<typeof loginSchema>) => {
      return await apiRequest("POST", "/api/auth/login", data);
    },
    onSuccess: async () => {
      // Invalidate and refetch user data to update auth state
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Let useAuth redirect naturally via the useEffect
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async (data: Omit<z.infer<typeof signupSchema>, "confirmPassword">) => {
      return await apiRequest("POST", "/api/auth/signup", data);
    },
    onSuccess: async () => {
      // Invalidate and refetch user data to update auth state
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      toast({
        title: "Account created successfully",
        description: "Welcome to CoachBnB!",
      });
      
      // Let useAuth redirect naturally via the useEffect
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({});
    
    // Validate form
    const result = loginSchema.safeParse({
      username: loginUsername,
      password: loginPassword,
    });
    
    if (!result.success) {
      const errors: any = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0]] = err.message;
        }
      });
      setLoginErrors(errors);
      return;
    }
    
    loginMutation.mutate(result.data);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupErrors({});
    
    // Validate form
    const result = signupSchema.safeParse({
      username: signupUsername,
      email: signupEmail,
      password: signupPassword,
      confirmPassword: signupConfirmPassword,
      firstName: signupFirstName || undefined,
      lastName: signupLastName || undefined,
    });
    
    if (!result.success) {
      const errors: any = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0]] = err.message;
        }
      });
      setSignupErrors(errors);
      return;
    }
    
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...signupData } = result.data;
    signupMutation.mutate(signupData);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-br from-neutral-50 to-white relative overflow-hidden py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-secondary rounded-full blur-3xl" />
      </div>
      
      <div className="container-max relative z-10">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <UserPlus className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4" data-testid="heading-login">
              Welcome to <span className="text-gradient">CoachBnB</span>
            </h1>
            <p className="text-xl text-neutral-600">
              Sign in to message coaches, apply as a coach, and manage your fitness journey
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-neutral-200" data-testid="card-auth">
            <Tabs defaultValue="oauth" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="oauth" data-testid="tab-oauth">Quick Sign In</TabsTrigger>
                <TabsTrigger value="traditional" data-testid="tab-traditional">Email & Password</TabsTrigger>
              </TabsList>
              
              <TabsContent value="oauth">
                <SocialAuth />
              </TabsContent>
              
              <TabsContent value="traditional">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
                    <TabsTrigger value="signup" data-testid="tab-signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label htmlFor="login-username" className="block text-sm font-medium text-neutral-700 mb-2">
                          Username
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                          <Input
                            id="login-username"
                            type="text"
                            placeholder="Enter your username"
                            value={loginUsername}
                            onChange={(e) => setLoginUsername(e.target.value)}
                            className={`pl-10 ${loginErrors.username ? "border-red-500" : ""}`}
                            data-testid="input-login-username"
                          />
                        </div>
                        {loginErrors.username && (
                          <p className="text-sm text-red-500 mt-1">{loginErrors.username}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="login-password" className="block text-sm font-medium text-neutral-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                          <Input
                            id="login-password"
                            type="password"
                            placeholder="Enter your password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className={`pl-10 ${loginErrors.password ? "border-red-500" : ""}`}
                            data-testid="input-login-password"
                          />
                        </div>
                        {loginErrors.password && (
                          <p className="text-sm text-red-500 mt-1">{loginErrors.password}</p>
                        )}
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full gradient-primary text-white font-semibold py-3 hover:opacity-90 transition-opacity"
                        disabled={loginMutation.isPending}
                        data-testid="button-login-submit"
                      >
                        {loginMutation.isPending ? "Logging in..." : "Log In"}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="signup-firstname" className="block text-sm font-medium text-neutral-700 mb-2">
                            First Name
                          </label>
                          <Input
                            id="signup-firstname"
                            type="text"
                            placeholder="John"
                            value={signupFirstName}
                            onChange={(e) => setSignupFirstName(e.target.value)}
                            data-testid="input-signup-firstname"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="signup-lastname" className="block text-sm font-medium text-neutral-700 mb-2">
                            Last Name
                          </label>
                          <Input
                            id="signup-lastname"
                            type="text"
                            placeholder="Doe"
                            value={signupLastName}
                            onChange={(e) => setSignupLastName(e.target.value)}
                            data-testid="input-signup-lastname"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="signup-username" className="block text-sm font-medium text-neutral-700 mb-2">
                          Username *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                          <Input
                            id="signup-username"
                            type="text"
                            placeholder="Choose a username"
                            value={signupUsername}
                            onChange={(e) => setSignupUsername(e.target.value)}
                            className={`pl-10 ${signupErrors.username ? "border-red-500" : ""}`}
                            data-testid="input-signup-username"
                          />
                        </div>
                        {signupErrors.username && (
                          <p className="text-sm text-red-500 mt-1">{signupErrors.username}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="signup-email" className="block text-sm font-medium text-neutral-700 mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="your@email.com"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            className={`pl-10 ${signupErrors.email ? "border-red-500" : ""}`}
                            data-testid="input-signup-email"
                          />
                        </div>
                        {signupErrors.email && (
                          <p className="text-sm text-red-500 mt-1">{signupErrors.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="signup-password" className="block text-sm font-medium text-neutral-700 mb-2">
                          Password *
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="Create a password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            className={`pl-10 ${signupErrors.password ? "border-red-500" : ""}`}
                            data-testid="input-signup-password"
                          />
                        </div>
                        {signupErrors.password && (
                          <p className="text-sm text-red-500 mt-1">{signupErrors.password}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-neutral-700 mb-2">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                          <Input
                            id="signup-confirm-password"
                            type="password"
                            placeholder="Confirm your password"
                            value={signupConfirmPassword}
                            onChange={(e) => setSignupConfirmPassword(e.target.value)}
                            className={`pl-10 ${signupErrors.confirmPassword ? "border-red-500" : ""}`}
                            data-testid="input-signup-confirm-password"
                          />
                        </div>
                        {signupErrors.confirmPassword && (
                          <p className="text-sm text-red-500 mt-1">{signupErrors.confirmPassword}</p>
                        )}
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full gradient-primary text-white font-semibold py-3 hover:opacity-90 transition-opacity"
                        disabled={signupMutation.isPending}
                        data-testid="button-signup-submit"
                      >
                        {signupMutation.isPending ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
              <p className="text-sm text-neutral-500">
                By signing in, you agree to our{" "}
                <a href="/terms" className="text-primary hover:underline font-medium" data-testid="link-terms">
                  Terms of Service
                </a>
                {" "}and{" "}
                <a href="/privacy" className="text-primary hover:underline font-medium" data-testid="link-privacy">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-neutral-600">
              Don't need an account?{" "}
              <a 
                href="/" 
                className="text-primary hover:underline font-semibold"
                data-testid="link-browse"
              >
                Browse coaches without signing in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
