import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import type { Coach } from "@shared/schema";

interface CoachCardProps {
  coach: Coach;
}

export default function CoachCard({ coach }: CoachCardProps) {
  return (
    <Link href={`/coach/${coach.slug}`}>
      <Card className="bg-white rounded-2xl shadow-md overflow-hidden hover-scale hover:shadow-lg transition-all duration-200 cursor-pointer">
        <img 
          src={coach.photos[0] || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"} 
          alt={`${coach.headline}`}
          className="w-full h-48 object-cover" 
        />
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg text-neutral-800">{coach.headline}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-neutral-600 ml-1">{(coach.ratingAvg || 0).toFixed(1)}</span>
            </div>
          </div>
          <p className="text-neutral-600 text-sm mb-3">{coach.city}, {coach.country}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {coach.specialties.slice(0, 2).map((specialty) => (
              <Badge 
                key={specialty}
                className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs"
              >
                {specialty}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-neutral-800">${coach.pricePerHour}/hour</span>
            <span className="text-xs text-neutral-500">
              {coach.virtualOnly ? "Virtual only" : "Virtual & In-person"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
