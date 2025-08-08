import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

interface FilterPanelProps {
  onFiltersChange: (filters: {
    location?: string;
    specialties?: string[];
    minPrice?: number;
    maxPrice?: number;
    virtualOnly?: boolean;
  }) => void;
  initialFilters?: any;
}

export default function FilterPanel({ onFiltersChange, initialFilters = {} }: FilterPanelProps) {
  const [location, setLocation] = useState(initialFilters.location || "");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(initialFilters.specialties || []);
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || "");
  const [sessionType, setSessionType] = useState("both");

  const specialties = [
    "Weight Loss",
    "Strength Training",
    "Yoga",
    "Nutrition",
    "HIIT",
    "Powerlifting",
    "Pilates",
    "Sports Performance"
  ];

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    const newSpecialties = checked
      ? [...selectedSpecialties, specialty]
      : selectedSpecialties.filter(s => s !== specialty);
    setSelectedSpecialties(newSpecialties);
  };

  const applyFilters = () => {
    const filters: any = {};
    
    if (location.trim()) filters.location = location;
    // Always include specialties in the filter object, even if empty
    filters.specialties = selectedSpecialties;
    if (minPrice && parseInt(minPrice) > 0) filters.minPrice = parseInt(minPrice);
    if (maxPrice && parseInt(maxPrice) > 0) filters.maxPrice = parseInt(maxPrice);
    
    // Always include virtualOnly filter to be explicit about session type
    if (sessionType === "virtual") {
      filters.virtualOnly = true;
    } else if (sessionType === "in-person") {
      filters.virtualOnly = false;
    }
    // When sessionType is "both", explicitly set to undefined to clear filter

    onFiltersChange(filters);
  };

  useEffect(() => {
    applyFilters();
  }, [location, selectedSpecialties, minPrice, maxPrice, sessionType]);

  return (
    <Card className="bg-white border border-neutral-200 rounded-2xl sticky top-24">
      <CardHeader>
        <CardTitle className="font-semibold text-lg text-neutral-800">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Filter */}
        <div>
          <Label className="font-medium text-neutral-700 mb-3">Location</Label>
          <Input
            type="text"
            placeholder="City or zip code"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Specialties Filter */}
        <div>
          <Label className="font-medium text-neutral-700 mb-3">Specialties</Label>
          <div className="space-y-2">
            {specialties.map((specialty) => (
              <div key={specialty} className="flex items-center space-x-2">
                <Checkbox
                  id={specialty}
                  checked={selectedSpecialties.includes(specialty)}
                  onCheckedChange={(checked) => handleSpecialtyChange(specialty, checked as boolean)}
                  className="text-primary"
                />
                <Label htmlFor={specialty} className="text-sm text-neutral-700">
                  {specialty}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <Label className="font-medium text-neutral-700 mb-3">Price Range</Label>
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <span className="text-neutral-500">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Session Type */}
        <div>
          <Label className="font-medium text-neutral-700 mb-3">Session Type</Label>
          <RadioGroup value={sessionType} onValueChange={setSessionType}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="both" />
              <Label htmlFor="both" className="text-sm text-neutral-700">Both</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in-person" id="in-person" />
              <Label htmlFor="in-person" className="text-sm text-neutral-700">In-person only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="virtual" id="virtual" />
              <Label htmlFor="virtual" className="text-sm text-neutral-700">Virtual only</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
