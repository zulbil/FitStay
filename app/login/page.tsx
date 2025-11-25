import { Metadata } from "next";
import { LoginForm } from "./login-form";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Log In",
  description: "Sign in to your CoachBnB account to message coaches, apply as a coach, and manage your fitness journey.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container-max py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to CoachBnB
            </h1>
            <p className="text-gray-600">
              Sign in to message coaches, apply as a coach, and manage your fitness journey
            </p>
          </div>
          
          <LoginForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
