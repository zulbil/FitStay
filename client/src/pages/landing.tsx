import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [searchLocation, setSearchLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation) {
      params.set("location", searchLocation);
    }
    setLocation(`/search?${params.toString()}`);
  };

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-neutral-800 mb-6">
            Find Your Perfect
            <span className="text-primary block">Fitness Coach</span>
          </h1>
          <p className="text-lg lg:text-xl text-neutral-600 mb-12 max-w-2xl mx-auto">
            Discover certified fitness professionals in your area or online. From HIIT to yoga, 
            strength training to nutrition coaching - find the expertise you need to reach your goals.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-lg mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Enter city or zip code"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10 py-3 text-base"
                />
              </div>
              <Button type="submit" size="lg" className="px-8">
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">Why Choose CoachBnB?</h2>
            <p className="text-lg text-neutral-600">The trusted platform for connecting with fitness professionals</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">Easy Search</h3>
              <p className="text-neutral-600">Find coaches by location, specialty, price, and session type</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">Verified Coaches</h3>
              <p className="text-neutral-600">All coaches are certified professionals with verified credentials</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">Flexible Options</h3>
              <p className="text-neutral-600">Choose from in-person or virtual sessions that fit your schedule</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}