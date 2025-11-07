import { useEffect } from "react";
import { useLocation } from "wouter";
import { SocialAuth } from "@/components/SocialAuth";
import { UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

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
            <SocialAuth />
            
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
