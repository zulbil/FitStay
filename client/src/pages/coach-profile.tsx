import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Star, MapPin, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ContactModal from "@/components/contact-modal";
import type { Coach, Review } from "@shared/schema";

export default function CoachProfile() {
  const [match, params] = useRoute("/coach/:slug");
  const slug = params?.slug;

  const { data: coach, isLoading: coachLoading, error: coachError } = useQuery<Coach>({
    queryKey: ["/api/coaches", slug],
    queryFn: async () => {
      const response = await fetch(`/api/coaches/${slug}`);
      if (!response.ok) {
        throw new Error("Coach not found");
      }
      return response.json();
    },
    enabled: !!slug,
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/coaches", slug, "reviews"],
    queryFn: async () => {
      const response = await fetch(`/api/coaches/${slug}/reviews`);
      return response.json();
    },
    enabled: !!slug,
  });

  if (coachLoading) {
    return (
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="w-full h-96 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (coachError || !coach) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Coach not found</h2>
          <p className="text-neutral-600">The coach you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Photos and Details */}
          <div className="lg:col-span-2">
            {/* Coach Hero Image */}
            <img 
              src={coach.photos[0] || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop"} 
              alt={coach.headline}
              className="w-full h-96 object-cover rounded-2xl shadow-lg mb-8" 
            />
            
            {/* Coach Info */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl font-bold text-neutral-800">{coach.headline}</h1>
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(coach.ratingAvg) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <span className="ml-2 text-neutral-600">{coach.ratingAvg.toFixed(1)} ({coach.ratingCount} reviews)</span>
                </div>
              </div>
              
              <div className="flex items-center text-neutral-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{coach.city}, {coach.country}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {coach.specialties.map((specialty) => (
                  <Badge key={specialty} className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                    {specialty}
                  </Badge>
                ))}
              </div>
              
              <p className="text-neutral-700 leading-relaxed text-lg">
                {coach.bio}
              </p>
            </div>

            {/* Photo Gallery */}
            {coach.photos.length > 1 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-neutral-800 mb-4">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {coach.photos.slice(1).map((photo, index) => (
                    <img 
                      key={index}
                      src={photo} 
                      alt={`${coach.headline} gallery ${index + 1}`}
                      className="rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer w-full h-48 object-cover" 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-6">Reviews</h3>
              {reviewsLoading ? (
                <div className="space-y-6">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="border-b border-neutral-200 pb-6 animate-pulse">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-neutral-200 pb-6 last:border-b-0">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-neutral-300 rounded-full flex items-center justify-center mr-4">
                          <span className="text-neutral-600 font-semibold">
                            {review.author.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-neutral-800">{review.author}</h4>
                          <div className="flex items-center">
                            <div className="flex text-yellow-400 text-sm">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} />
                              ))}
                            </div>
                            <span className="ml-2 text-neutral-500 text-sm">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-neutral-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-600">No reviews yet.</p>
              )}
            </div>
          </div>

          {/* Right Column - Booking and Pricing */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Pricing Card */}
              <Card className="border border-neutral-200 rounded-2xl shadow-lg mb-6">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-neutral-800 mb-2">
                      <span>${coach.pricePerHour}</span><span className="text-lg text-neutral-600">/hour</span>
                    </div>
                    <p className="text-neutral-600">
                      {coach.virtualOnly ? "Virtual sessions only" : "Virtual & In-person sessions"}
                    </p>
                  </div>
                  
                  <ContactModal coach={coach}>
                    <Button className="w-full bg-primary hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
                      Send Message
                    </Button>
                  </ContactModal>
                  
                  <p className="text-xs text-neutral-500 text-center mt-4">
                    You won't be charged yet. {coach.headline.split(' ')[0]} will respond within 24 hours.
                  </p>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="bg-gray-50 rounded-2xl">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-neutral-800 mb-4">What's included:</h4>
                  <ul className="space-y-3 text-sm text-neutral-700">
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-secondary mr-3" />
                      Personalized workout plan
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-secondary mr-3" />
                      Nutrition guidance
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-secondary mr-3" />
                      Progress tracking
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-secondary mr-3" />
                      24/7 text support
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
