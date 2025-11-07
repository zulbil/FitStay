import { Button } from "@/components/ui/button";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";

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

  const handleAppleLogin = () => {
    window.location.href = "/api/auth/apple";
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
        data-testid="button-facebook-login"
      >
        <FaFacebook className="text-blue-600 text-lg" />
        <span className="text-gray-700 font-medium">Continue with Facebook</span>
      </Button>

      <Button
        onClick={handleAppleLogin}
        variant="outline"
        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        data-testid="button-apple-login"
      >
        <FaApple className="text-black text-lg" />
        <span className="text-gray-700 font-medium">Continue with Apple</span>
      </Button>
    </div>
  );
}