import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Landing from "@/pages/landing";
import Search from "@/pages/search";
import CoachProfile from "@/pages/coach-profile";
import ForCoaches from "@/pages/for-coaches";
import CoachOnboarding from "@/pages/coach-onboarding";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useAuth } from "@/hooks/useAuth";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Show navbar on all pages */}
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={isAuthenticated ? Home : Landing} />
          <Route path="/search" component={Search} />
          <Route path="/coach/:slug" component={CoachProfile} />
          <Route path="/for-coaches" component={ForCoaches} />
          <Route path="/become-a-coach" component={CoachOnboarding} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
