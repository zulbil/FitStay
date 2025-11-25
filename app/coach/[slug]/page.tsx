import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, MapPin, Clock, Video, Users, Award, CheckCircle, MessageCircle } from "lucide-react";
import { db } from "@/lib/db";
import { coaches, reviews } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

interface CoachPageProps {
  params: Promise<{ slug: string }>;
}

async function getCoach(slug: string) {
  const [coach] = await db
    .select()
    .from(coaches)
    .where(eq(coaches.slug, slug));
  
  return coach || null;
}

async function getCoachReviews(coachId: string) {
  const coachReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.coachId, coachId));
  
  return coachReviews;
}

export async function generateMetadata({ params }: CoachPageProps): Promise<Metadata> {
  const { slug } = await params;
  const coach = await getCoach(slug);
  
  if (!coach) {
    return {
      title: "Coach Not Found",
    };
  }
  
  const specialtiesText = coach.specialties.slice(0, 3).join(", ");
  
  return {
    title: `${coach.headline} - Personal Trainer in ${coach.city}`,
    description: `${coach.bio.slice(0, 155)}...`,
    keywords: [
      ...coach.specialties,
      "personal trainer",
      "fitness coach",
      coach.city,
      coach.state,
    ],
    openGraph: {
      title: `${coach.headline} | CoachBnB`,
      description: `Professional fitness coach specializing in ${specialtiesText}. Located in ${coach.city}, ${coach.state}.`,
      type: "profile",
      images: [
        {
          url: coach.photos[0] || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
          width: 800,
          height: 600,
          alt: coach.headline,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${coach.headline} | CoachBnB`,
      description: `Professional fitness coach in ${coach.city}. ${specialtiesText}.`,
      images: [coach.photos[0] || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"],
    },
  };
}

export default async function CoachProfilePage({ params }: CoachPageProps) {
  const { slug } = await params;
  const coach = await getCoach(slug);
  
  if (!coach) {
    notFound();
  }
  
  const coachReviews = await getCoachReviews(coach.id);
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: coach.headline.split("•")[0].trim(),
    description: coach.bio,
    image: coach.photos[0],
    jobTitle: "Personal Fitness Coach",
    address: {
      "@type": "PostalAddress",
      addressLocality: coach.city,
      addressRegion: coach.state,
      addressCountry: "US",
    },
    aggregateRating: coach.ratingAvg ? {
      "@type": "AggregateRating",
      ratingValue: coach.ratingAvg,
      reviewCount: coach.ratingCount,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    priceRange: `$${coach.pricePerHour}/hour`,
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-white">
        <Navbar />
        
        {/* Hero Section with Photo Gallery */}
        <section className="bg-gray-50 py-8">
          <div className="container-max">
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Main Photo */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src={coach.photos[0] || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"}
                  alt={coach.headline}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Secondary Photos */}
              <div className="grid grid-cols-2 gap-4">
                {coach.photos.slice(1, 5).map((photo, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                    <Image
                      src={photo}
                      alt={`${coach.headline} - Photo ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Coach Details */}
        <section className="py-12">
          <div className="container-max">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Header */}
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    {coach.headline}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-5 h-5" />
                      <span>{coach.city}, {coach.state}</span>
                    </div>
                    
                    {coach.ratingAvg && coach.ratingAvg > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{coach.ratingAvg.toFixed(1)}</span>
                        <span>({coach.ratingCount} reviews)</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      {coach.virtualOnly ? (
                        <>
                          <Video className="w-5 h-5" />
                          <span>Virtual Only</span>
                        </>
                      ) : (
                        <>
                          <Users className="w-5 h-5" />
                          <span>In-Person & Virtual</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Specialties */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Specialties</h2>
                  <div className="flex flex-wrap gap-2">
                    {coach.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* About */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {coach.bio}
                  </p>
                </div>
                
                {/* Reviews */}
                {coachReviews.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      Reviews ({coachReviews.length})
                    </h2>
                    <div className="space-y-6">
                      {coachReviews.slice(0, 5).map((review) => (
                        <div key={review.id} className="bg-gray-50 p-6 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary font-semibold">
                                {review.author?.charAt(0) || "U"}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {review.author || "Anonymous"}
                              </p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sidebar - Booking Card */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gray-900">
                      ${coach.pricePerHour}
                      <span className="text-lg font-normal text-gray-500">/hour</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Verified Credentials</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-5 h-5 text-primary" />
                      <span>Quick Response Time</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Award className="w-5 h-5 text-amber-500" />
                      <span>Top Rated Coach</span>
                    </div>
                  </div>
                  
                  <Link href={`/contact/${coach.slug}`}>
                    <Button className="w-full gradient-primary text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Contact Coach
                    </Button>
                  </Link>
                  
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Free consultation • No commitment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
}
