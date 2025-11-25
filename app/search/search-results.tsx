"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Coach {
  id: string;
  slug: string;
  headline: string;
  bio: string;
  city: string;
  state: string;
  specialties: string[];
  pricePerHour: number;
  virtualOnly: boolean | null;
  ratingAvg: number | null;
  ratingCount: number | null;
  photos: string[];
}

interface Specialty {
  id: string;
  name: string;
  slug: string;
}

interface SearchResultsProps {
  initialCoaches: Coach[];
  specialties: Specialty[];
}

export function SearchResults({ initialCoaches, specialties }: SearchResultsProps) {
  const [filteredCoaches, setFilteredCoaches] = useState(initialCoaches);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [location, setLocation] = useState("");
  
  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };
  
  const clearFilters = () => {
    setSelectedSpecialties([]);
    setLocation("");
    setSortBy("recommended");
  };
  
  const displayedCoaches = filteredCoaches
    .filter((coach) => {
      if (selectedSpecialties.length === 0) return true;
      return selectedSpecialties.every((specialty) =>
        coach.specialties.includes(specialty)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.pricePerHour - b.pricePerHour;
        case "price-high":
          return b.pricePerHour - a.pricePerHour;
        case "rating":
          return (b.ratingAvg || 0) - (a.ratingAvg || 0);
        default:
          return (b.ratingAvg || 0) - (a.ratingAvg || 0);
      }
    });

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Filters Sidebar */}
      <aside className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
        <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg">Filters</h2>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
          
          {/* Location */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <Input
              placeholder="Enter ZIP code or city"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          {/* Specialties */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Specialties
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {specialties.map((specialty) => (
                <label
                  key={specialty.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedSpecialties.includes(specialty.name)}
                    onCheckedChange={() => handleSpecialtyToggle(specialty.name)}
                  />
                  <span className="text-sm text-gray-600">{specialty.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>
      
      {/* Results */}
      <div className="lg:col-span-3">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{displayedCoaches.length}</span> coaches found
          </p>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating: Highest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Selected Filters */}
        {selectedSpecialties.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedSpecialties.map((specialty) => (
              <span
                key={specialty}
                className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
              >
                {specialty}
                <button
                  onClick={() => handleSpecialtyToggle(specialty)}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        
        {/* Coach Cards Grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedCoaches.map((coach) => (
            <Link
              key={coach.id}
              href={`/coach/${coach.slug}`}
              className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={coach.photos[0] || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"}
                  alt={coach.headline}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold">
                    {coach.ratingAvg ? coach.ratingAvg.toFixed(1) : "New"}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {coach.headline}
                </h3>
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{coach.city}, {coach.state}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {coach.specialties.slice(0, 2).map((specialty) => (
                    <span
                      key={specialty}
                      className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs"
                    >
                      {specialty}
                    </span>
                  ))}
                  {coach.specialties.length > 2 && (
                    <span className="text-gray-400 text-xs">
                      +{coach.specialties.length - 2} more
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">
                    ${coach.pricePerHour}
                    <span className="text-sm font-normal text-gray-500">/hr</span>
                  </span>
                  <span className="text-primary text-sm font-medium group-hover:underline">
                    View Profile
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {displayedCoaches.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No coaches found matching your criteria.
            </p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
