import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import SearchBar from "@/components/search-bar";
import CoachCard from "@/components/coach-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Coach } from "@shared/schema";

export default function Home() {
  const { data: coachesData, isLoading } = useQuery<{ coaches: Coach[]; total: number }>({
    queryKey: ["/api/coaches"],
    queryFn: async () => {
      const response = await fetch("/api/coaches?limit=4");
      return response.json();
    },
  });

  const popularSpecialties = [
    "Weight Loss",
    "Strength Training", 
    "Yoga",
    "Nutrition",
    "HIIT",
    "Powerlifting",
    "Pilates",
    "Sports Performance"
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-neutral-800 mb-6">
              Find your perfect
              <span className="text-primary"> fitness coach</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-12 max-w-2xl mx-auto">
              Connect with certified fitness professionals in your area. In-person or virtual training available.
            </p>
            
            <SearchBar className="max-w-4xl mx-auto" />
          </div>
        </div>
      </section>

      {/* Popular Specialties */}
      <section className="py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-800 mb-8">Popular Specialties</h2>
          <div className="flex flex-wrap gap-3">
            {popularSpecialties.map((specialty, index) => (
              <Link key={specialty} href={`/search?specialty=${encodeURIComponent(specialty)}`}>
                <Badge 
                  className={`px-6 py-3 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                    index === 0 
                      ? "bg-primary text-white hover:bg-red-600" 
                      : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                  }`}
                >
                  {specialty}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Coaches */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800">Featured Coaches</h2>
            <Link href="/search">
              <a className="text-primary font-semibold hover:underline">View all</a>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coachesData?.coaches.map((coach) => (
                <CoachCard key={coach.id} coach={coach} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* For Coaches CTA */}
      <section className="py-16 bg-neutral-800 text-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Become a CoachNearby Coach</h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              Join thousands of fitness professionals who are growing their business through our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Find New Clients</h3>
              <p className="text-neutral-300">Connect with motivated clients in your area looking for fitness guidance</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-dollar-sign text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Increase Your Income</h3>
              <p className="text-neutral-300">Set your own rates and schedule. Our coaches earn 20% more on average</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Grow Your Business</h3>
              <p className="text-neutral-300">Access marketing tools, client management, and business insights</p>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/for-coaches">
              <Button className="bg-white text-neutral-800 font-semibold px-8 py-4 rounded-xl hover:bg-neutral-100 transition-colors">
                Start Your Coach Profile
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
