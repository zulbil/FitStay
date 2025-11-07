import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { SocialAuth } from "@/components/SocialAuth";
import { Search, UserPlus } from "lucide-react";

interface ZipCodeData {
  zipCode: string;
  city: string;
  state: string;
  stateCode: string;
  lat: number;
  lng: number;
  fullAddress?: string;
}

export default function Landing() {
  const [, setLocation] = useLocation();
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedLocationData, setSelectedLocationData] = useState<ZipCodeData | null>(null);

  const handleAddressSelected = (addressData: ZipCodeData) => {
    setSelectedLocationData(addressData);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (selectedLocationData) {
      // Use the selected address data for more precise search
      params.set("lat", selectedLocationData.lat.toString());
      params.set("lng", selectedLocationData.lng.toString());
      params.set("zipCode", selectedLocationData.zipCode);
      params.set("locationText", selectedLocationData.fullAddress || `${selectedLocationData.city}, ${selectedLocationData.stateCode} ${selectedLocationData.zipCode}`);
      params.set("radius", "25"); // Default 25 mile radius
      
    } else if (searchLocation) {
      // Fallback to basic location search
      params.set("location", searchLocation);
    }
    setLocation(`/search?${params.toString()}`);
  };

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden" data-testid="hero-section">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10" />
        
        <div className="container-max text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-8 text-sm font-semibold text-primary" data-testid="badge-certified">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            40+ Certified Fitness Professionals
          </div>
          
          <h1 className="font-bold text-neutral-900 mb-6 leading-tight" data-testid="heading-hero">
            Transform Your Fitness Journey with
            <span className="text-gradient block mt-2">Expert Coaching</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-neutral-600 mb-12 max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-subtitle">
            Connect with certified fitness coaches in your area or online. From HIIT to yoga, 
            strength training to martial arts - find the perfect match for your goals.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8" data-testid="form-hero-search">
            <div className="flex flex-col sm:flex-row gap-3 p-3 bg-white rounded-2xl shadow-xl border border-neutral-200">
              <div className="flex-1">
                <AddressAutocomplete
                  value={searchLocation}
                  onChange={(value, addressData) => {
                    setSearchLocation(value);
                    if (addressData) {
                      setSelectedLocationData(addressData);
                    }
                  }}
                  onAddressSelected={handleAddressSelected}
                  placeholder="Enter your location (city, state, or zip)"
                  className="w-full border-0 focus:ring-0 text-lg"
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                data-testid="button-search"
              >
                <Search className="w-5 h-5 mr-2" />
                Find Coaches
              </Button>
            </div>
          </form>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-neutral-600" data-testid="trust-indicators">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Verified Credentials</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Authentic Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Secure Platform</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white" data-testid="section-features">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="font-bold text-neutral-900 mb-4">Why Choose CoachBnB?</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">The most trusted platform for connecting with certified fitness professionals</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group" data-testid="feature-search">
              <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                <Search className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">Smart Search</h3>
              <p className="text-neutral-600 text-lg leading-relaxed">
                Advanced filtering by location, specialty, price range, and session type - find exactly what you need
              </p>
            </div>

            <div className="text-center group" data-testid="feature-verified">
              <div className="w-20 h-20 gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">Verified Experts</h3>
              <p className="text-neutral-600 text-lg leading-relaxed">
                Every coach is a certified professional with verified credentials and authentic client reviews
              </p>
            </div>

            <div className="text-center group" data-testid="feature-flexible">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">Total Flexibility</h3>
              <p className="text-neutral-600 text-lg leading-relaxed">
                Train in-person at your location or go virtual - sessions that adapt to your lifestyle
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-neutral-200" data-testid="stats-section">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">40+</div>
              <div className="text-neutral-600 font-medium">Expert Coaches</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-neutral-600 font-medium">Specialties</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-neutral-600 font-medium">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-neutral-600 font-medium">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-white relative overflow-hidden" data-testid="section-auth">
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
              <h2 className="text-4xl font-bold text-neutral-900 mb-4">Start Your Journey Today</h2>
              <p className="text-xl text-neutral-600">
                Join thousands of people who have transformed their fitness with the perfect coach
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-neutral-200">
              <SocialAuth />
              
              <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
                <p className="text-sm text-neutral-500">
                  By signing up, you agree to our{" "}
                  <a href="/terms" className="text-primary hover:underline font-medium">Terms of Service</a>
                  {" "}and{" "}
                  <a href="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}