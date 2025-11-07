import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { SocialAuth } from "@/components/SocialAuth";
import { Search, UserPlus, Star, CheckCircle, Shield, Award, Users, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import type { Coach } from "@shared/schema";

interface ZipCodeData {
  zipCode: string;
  city: string;
  state: string;
  stateCode: string;
  lat: number;
  lng: number;
  fullAddress?: string;
}

// Helper function to convert slug to display name
const slugToName = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function Landing() {
  const [, setLocation] = useLocation();
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedLocationData, setSelectedLocationData] = useState<ZipCodeData | null>(null);

  // Fetch featured coaches
  const { data: coachesData, isLoading: coachesLoading } = useQuery<{ coaches: Coach[] }>({
    queryKey: ['/api/coaches'],
  });

  // Show first 3 coaches for mosaic design (or filter by ratingAvg >= 4.8 if coaches have reviews)
  const featuredCoaches = coachesData?.coaches
    ?.filter(c => !c.ratingAvg || c.ratingAvg >= 4.8)
    .slice(0, 3) || [];
  
  // Hero slider with coach background images
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 30 },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const [selectedHeroIndex, setSelectedHeroIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', () => {
      setSelectedHeroIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

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

  // Hero background images - fixed fitness photos
  const heroImages = [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1549476464-37392f717541?w=1920&h=1080&fit=crop"
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Austin, TX",
      text: "I found my perfect trainer in just minutes! Lost 30 pounds in 3 months and feel amazing.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
    },
    {
      name: "Michael Chen",
      location: "San Francisco, CA",
      text: "The virtual sessions are incredibly convenient. My coach is professional and motivating!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
    },
    {
      name: "Emily Rodriguez",
      location: "Chicago, IL",
      text: "Best investment in myself. The quality of coaches on this platform is outstanding.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">

      {/* Hero Section with Background Slider */}
      <section className="relative h-[700px] lg:h-[800px] overflow-hidden" data-testid="hero-section">
        {/* Background Image Carousel */}
        <div className="absolute inset-0" ref={emblaRef}>
          <div className="flex h-full">
            {heroImages.map((image, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 relative">
                <img 
                  src={image} 
                  alt={`Hero ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
              </div>
            ))}
          </div>
        </div>

        {/* Content Overlay */}
        <div className="relative h-full flex items-center justify-center">
          <div className="container-max text-center px-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/95 backdrop-blur-sm rounded-full mb-8 text-sm font-bold text-primary shadow-xl" data-testid="badge-certified">
              <Award className="w-5 h-5" />
              40+ Certified Fitness Professionals
            </div>
            
            <h1 className="font-extrabold text-white mb-6 leading-tight text-5xl lg:text-7xl drop-shadow-2xl" data-testid="heading-hero">
              Find Your Perfect
              <span className="block mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Fitness Coach</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-medium" data-testid="text-hero-subtitle">
              Connect with certified trainers in your area or online. Personalized coaching for your unique fitness goals.
            </p>

            {/* Enhanced ZIP Code Search */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8" data-testid="form-hero-search">
              <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white rounded-2xl shadow-2xl border-2 border-white/50 backdrop-blur-md">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0" />
                  <AddressAutocomplete
                    value={searchLocation}
                    onChange={(value, addressData) => {
                      setSearchLocation(value);
                      if (addressData) {
                        setSelectedLocationData(addressData);
                      }
                    }}
                    onAddressSelected={handleAddressSelected}
                    placeholder="Enter your ZIP code, city, or address..."
                    className="w-full border-0 focus:ring-0 text-lg font-medium"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="gradient-primary text-white font-bold px-10 py-7 rounded-xl shadow-lg hover:shadow-2xl transition-all text-lg"
                  data-testid="button-search"
                >
                  <Search className="w-6 h-6 mr-2" />
                  Find My Coach
                </Button>
              </div>
            </form>
            
            {/* Trust Indicators - Enhanced */}
            <div className="flex flex-wrap justify-center gap-8 text-white/90" data-testid="trust-indicators">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="font-semibold text-sm">Verified Credentials</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Star className="w-5 h-5 text-accent" />
                <span className="font-semibold text-sm">Authentic Reviews</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Shield className="w-5 h-5 text-secondary" />
                <span className="font-semibold text-sm">Secure Platform</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === selectedHeroIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              data-testid={`hero-carousel-indicator-${index}`}
            />
          ))}
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

      {/* Featured Coaches Carousel */}
      {!coachesLoading && featuredCoaches.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-neutral-50 to-white" data-testid="section-featured-coaches">
          <div className="container-max">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                Meet Our <span className="text-gradient">Top-Rated Coaches</span>
              </h2>
              <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                Discover certified professionals who have transformed thousands of lives
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {featuredCoaches.map((coach) => (
                <Link key={coach.id} href={`/coach/${coach.slug}`} className="h-full">
                  <div 
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover-lift cursor-pointer group h-full flex flex-col"
                    data-testid={`featured-coach-${coach.id}`}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={coach.photos[0]} 
                        alt={slugToName(coach.slug)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-lg">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="font-bold text-sm">{(coach.ratingAvg && coach.ratingAvg > 0) ? coach.ratingAvg.toFixed(1) : 'New'}</span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold text-neutral-900 mb-2">{slugToName(coach.slug)}</h3>
                      <p className="text-neutral-600 mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {coach.city}, {coach.state}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4 flex-grow">
                        {coach.specialties.slice(0, 3).map((specialty) => (
                          <span 
                            key={specialty}
                            className="bg-gradient-to-r from-secondary/10 to-primary/10 text-neutral-700 px-3 py-1 rounded-full text-sm font-medium h-fit"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-200 mt-auto">
                        <div>
                          <span className="text-2xl font-bold text-primary">${coach.pricePerHour}</span>
                          <span className="text-neutral-500 text-sm">/hour</span>
                        </div>
                        <div className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-semibold text-sm group-hover:bg-primary group-hover:text-white transition-all">
                          View Profile
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-20 bg-white" data-testid="section-testimonials">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
              Success <span className="text-gradient">Stories</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Real results from real people who found their perfect fitness match
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-neutral-50 to-white p-8 rounded-2xl shadow-lg border border-neutral-200 hover:shadow-xl transition-shadow"
                data-testid={`testimonial-${index}`}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-neutral-700 text-lg mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div>
                    <div className="font-bold text-neutral-900">{testimonial.name}</div>
                    <div className="text-neutral-600 text-sm">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Stats with Social Proof */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 py-12 px-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl">
            <div className="text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-3" />
              <div className="text-5xl font-bold text-neutral-900 mb-2">10,000+</div>
              <div className="text-neutral-600 font-medium">Sessions Completed</div>
            </div>
            <div className="text-center">
              <Award className="w-12 h-12 text-secondary mx-auto mb-3" />
              <div className="text-5xl font-bold text-neutral-900 mb-2">40+</div>
              <div className="text-neutral-600 font-medium">Certified Coaches</div>
            </div>
            <div className="text-center">
              <Star className="w-12 h-12 text-accent mx-auto mb-3" />
              <div className="text-5xl font-bold text-neutral-900 mb-2">4.9</div>
              <div className="text-neutral-600 font-medium">Average Rating</div>
            </div>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
              <div className="text-5xl font-bold text-neutral-900 mb-2">100%</div>
              <div className="text-neutral-600 font-medium">Verified Credentials</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}