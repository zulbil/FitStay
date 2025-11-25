import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Shield, CheckCircle, Search } from "lucide-react";
import { db } from "@/lib/db";
import { coaches } from "@/lib/schema";
import { desc, gte } from "drizzle-orm";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

async function getFeaturedCoaches() {
  const featuredCoaches = await db
    .select()
    .from(coaches)
    .where(gte(coaches.ratingAvg, 4.8))
    .orderBy(desc(coaches.ratingAvg), desc(coaches.ratingCount))
    .limit(3);
  
  return featuredCoaches;
}

export default async function HomePage() {
  const featuredCoaches = await getFeaturedCoaches();
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop"
            alt="Fitness Training"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>
        
        <div className="relative container-max h-full flex items-center">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
              <Shield className="w-4 h-4 text-accent" />
              <span>40+ Certified Fitness Professionals</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Find Your Perfect{" "}
              <span className="text-gradient">Fitness Coach</span>
            </h1>
            
            <p className="text-xl text-gray-200 mb-8">
              Connect with certified fitness professionals in your area. 
              In-person or virtual training available.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 gradient-primary text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Search className="w-5 h-5" />
                Find a Coach
              </Link>
              <Link
                href="/become-a-coach"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-all"
              >
                Become a Coach
              </Link>
            </div>
            
            <div className="flex items-center gap-8 mt-10">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span className="text-sm">Verified Credentials</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span className="text-sm">Authentic Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span className="text-sm">Secure Platform</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Coaches Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Top-Rated Coaches
            </h2>
            <p className="text-xl text-gray-600">
              Meet some of our highest-rated fitness professionals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredCoaches.map((coach) => (
              <Link
                key={coach.id}
                href={`/coach/${coach.slug}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover-lift"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={coach.photos[0] || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"}
                    alt={coach.headline}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-sm">
                      {coach.ratingAvg ? coach.ratingAvg.toFixed(1) : "New"}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                    {coach.headline}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{coach.city}, {coach.state}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {coach.specialties.slice(0, 3).map((specialty) => (
                      <span
                        key={specialty}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      ${coach.pricePerHour}
                      <span className="text-sm font-normal text-gray-500">/hour</span>
                    </span>
                    <span className="text-primary font-semibold group-hover:underline">
                      View Profile
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 gradient-primary text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Browse All Coaches
            </Link>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 gradient-primary">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-white/80">Sessions Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">40+</div>
              <div className="text-white/80">Certified Coaches</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9</div>
              <div className="text-white/80">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-white/80">Verified Credentials</div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
