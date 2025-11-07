import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Video, Users } from "lucide-react";
import type { Coach } from "@shared/schema";

interface CoachCardProps {
  coach: Coach & { distance?: number };
}

export default function CoachCard({ coach }: CoachCardProps) {
  return (
    <Link href={`/coach/${coach.slug}`}>
      <div data-testid={`card-coach-${coach.id}`}>
        <Card className="bg-white rounded-2xl shadow-lg overflow-hidden hover-lift border-0 cursor-pointer group">
          {/* Image Container with Overlay */}
          <div className="relative overflow-hidden aspect-4-3">
            <img 
              src={coach.photos[0] || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"} 
              alt={`${coach.headline}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              data-testid={`img-coach-${coach.id}`}
            />
            
            {/* Rating Badge */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-neutral-900" data-testid={`rating-coach-${coach.id}`}>
                {(coach.ratingAvg || 0).toFixed(1)}
              </span>
            </div>
            
            {/* Session Type Badge */}
            {coach.virtualOnly ? (
              <div className="absolute top-4 left-4 bg-primary/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg text-xs font-semibold">
                <Video className="h-3 w-3" />
                Virtual
              </div>
            ) : (
              <div className="absolute top-4 left-4 bg-secondary/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg text-xs font-semibold">
                <Users className="h-3 w-3" />
                Hybrid
              </div>
            )}
          </div>
          
          <CardContent className="p-5">
            {/* Headline */}
            <h3 className="font-bold text-xl text-neutral-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors" data-testid={`heading-coach-${coach.id}`}>
              {coach.headline}
            </h3>
            
            {/* Location */}
            <div className="flex items-center text-neutral-600 text-sm mb-4">
              <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
              <span className="line-clamp-1" data-testid={`location-coach-${coach.id}`}>
                {coach.city}, {coach.state || coach.country}
              </span>
              {coach.distance && (
                <span className="ml-2 px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold whitespace-nowrap">
                  {coach.distance} mi
                </span>
              )}
            </div>
            
            {/* Specialties */}
            <div className="flex flex-wrap gap-2 mb-4">
              {coach.specialties.slice(0, 3).map((specialty) => (
                <Badge 
                  key={specialty}
                  className="bg-gradient-to-r from-secondary/10 to-primary/10 text-neutral-700 hover:from-secondary/20 hover:to-primary/20 border-0 px-3 py-1 rounded-full text-xs font-medium transition-all"
                  data-testid={`badge-specialty-${specialty}`}
                >
                  {specialty}
                </Badge>
              ))}
              {coach.specialties.length > 3 && (
                <Badge 
                  className="bg-neutral-100 text-neutral-600 border-0 px-3 py-1 rounded-full text-xs font-medium"
                >
                  +{coach.specialties.length - 3}
                </Badge>
              )}
            </div>
            
            {/* Price and CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <div>
                <span className="text-2xl font-bold text-neutral-900" data-testid={`price-coach-${coach.id}`}>
                  ${coach.pricePerHour}
                </span>
                <span className="text-neutral-500 text-sm">/hour</span>
              </div>
              <div className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-semibold text-sm group-hover:bg-primary group-hover:text-white transition-all">
                View Profile
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}
