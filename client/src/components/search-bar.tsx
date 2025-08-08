import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";

interface SearchBarProps {
  onSearch?: (filters: {
    location: string;
    specialty: string;
    priceRange: string;
  }) => void;
  className?: string;
}

export default function SearchBar({ onSearch, className = "" }: SearchBarProps) {
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [, setLocation_] = useLocation();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (specialty && specialty !== "any") params.set("specialty", specialty);
    if (priceRange && priceRange !== "any") {
      const [min, max] = priceRange.split("-");
      if (min) params.set("minPrice", min);
      if (max) params.set("maxPrice", max);
    }

    if (onSearch) {
      onSearch({ location, specialty, priceRange });
    } else {
      setLocation_(`/search?${params.toString()}`);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-neutral-800 mb-2">Location</label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Where are you?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <MapPin className="absolute right-3 top-3 h-5 w-5 text-neutral-400" />
          </div>
        </div>
        
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-neutral-800 mb-2">Specialty</label>
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent">
              <SelectValue placeholder="Any specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any specialty</SelectItem>
              <SelectItem value="Weight Loss">Weight Loss</SelectItem>
              <SelectItem value="Strength Training">Strength Training</SelectItem>
              <SelectItem value="Yoga">Yoga</SelectItem>
              <SelectItem value="Nutrition">Nutrition</SelectItem>
              <SelectItem value="HIIT">HIIT</SelectItem>
              <SelectItem value="Powerlifting">Powerlifting</SelectItem>
              <SelectItem value="Pilates">Pilates</SelectItem>
              <SelectItem value="Sports Performance">Sports Performance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-neutral-800 mb-2">Price Range</label>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent">
              <SelectValue placeholder="Any price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any price</SelectItem>
              <SelectItem value="20-40">$20-40/hour</SelectItem>
              <SelectItem value="40-60">$40-60/hour</SelectItem>
              <SelectItem value="60-80">$60-80/hour</SelectItem>
              <SelectItem value="80-">$80+/hour</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-1 flex items-end">
          <Button 
            onClick={handleSearch}
            className="w-full bg-primary hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
