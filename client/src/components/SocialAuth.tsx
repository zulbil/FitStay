import { Button } from "@/components/ui/button";
import { FaGoogle, FaFacebook } from "react-icons/fa";

interface SocialAuthProps {
  className?: string;
}

export function SocialAuth({ className = "" }: SocialAuthProps) {
  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = "/api/auth/facebook";
  };

  const handleReplitLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Button
        onClick={handleGoogleLogin}
        variant="outline"
        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <FaGoogle className="text-red-500 text-lg" />
        <span className="text-gray-700 font-medium">Continue with Google</span>
      </Button>

      <Button
        onClick={handleFacebookLogin}
        variant="outline"
        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <FaFacebook className="text-blue-600 text-lg" />
        <span className="text-gray-700 font-medium">Continue with Facebook</span>
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or</span>
        </div>
      </div>

      <Button
        onClick={handleReplitLogin}
        className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        Continue with Replit
      </Button>
    </div>
  );
}