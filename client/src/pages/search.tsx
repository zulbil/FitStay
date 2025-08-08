import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import FilterPanel from "@/components/filter-panel";
import CoachCard from "@/components/coach-card";
import { GoogleMap } from "@/components/google-map";
import { LocationSearch } from "@/components/LocationSearch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Map, List, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Coach } from "@shared/schema";

export default function Search() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    zipCode: searchParams.get("zipCode") || "",
    lat: searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : undefined,
    lng: searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : undefined,
    radius: searchParams.get("radius") ? parseInt(searchParams.get("radius")!) : 100,
    specialty: searchParams.get("specialty") || "",
    minPrice: searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!) : undefined,
    maxPrice: searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : undefined,
    virtualOnly: searchParams.get("virtualOnly") === "true" ? true : undefined,
    limit: 12,
    offset: 0,
  });

  const [locationText, setLocationText] = useState(searchParams.get("locationText") || "");

  const [sortBy, setSortBy] = useState("recommended");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const handleLocationSearch = (searchData: {
    zipCode?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    locationText?: string;
  }) => {
    setFilters(prev => ({
      ...prev,
      zipCode: searchData.zipCode || "",
      lat: searchData.lat,
      lng: searchData.lng,
      radius: searchData.radius || 100,
    }));
    setLocationText(searchData.locationText || "");
  };

  const { data: coachesData, isLoading, error } = useQuery<{ coaches: (Coach & { distance?: number })[]; total: number }>({
    queryKey: ["/api/coaches", filters, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          if (key === "specialties" && Array.isArray(value)) {
            // Handle array of specialties
            value.forEach(specialty => params.append("specialties", specialty));
          } else if (key === "specialty") {
            // Handle legacy single specialty
            params.append("specialties", value as string);
          } else {
            params.append(key, value.toString());
          }
        }
      });
      
      if (sortBy && sortBy !== "recommended") {
        params.append("sortBy", sortBy);
      }
      
      const response = await fetch(`/api/coaches?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch coaches");
      }
      return response.json();
    },
  });

  const handleFiltersChange = (newFilters: any) => {
    setFilters(prev => {
      // Start with current filters and reset pagination
      const updatedFilters: any = { ...prev, offset: 0 };
      
      // Apply new filters, but handle removal of undefined/empty values
      Object.keys(newFilters).forEach((key: string) => {
        if (newFilters[key] === undefined || newFilters[key] === null || 
            (Array.isArray(newFilters[key]) && newFilters[key].length === 0)) {
          // Remove the filter key entirely when it's empty/undefined
          delete updatedFilters[key];
        } else {
          updatedFilters[key] = newFilters[key];
        }
      });
      
      // Also remove any keys that weren't included in newFilters but might need to be cleared
      // This handles the case where a filter is removed completely
      const filterKeys = ['location', 'specialties', 'minPrice', 'maxPrice', 'virtualOnly'];
      filterKeys.forEach((key: string) => {
        if (!(key in newFilters) && key !== 'offset' && key !== 'limit') {
          delete updatedFilters[key];
        }
      });
      
      return updatedFilters;
    });
  };

  const handleLoadMore = () => {
    setFilters(prev => ({
      ...prev,
      offset: prev.offset + prev.limit,
    }));
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Error loading coaches</h2>
          <p className="text-neutral-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            {/* Location Search */}
            <div className="bg-white p-4 rounded-lg border border-neutral-200">
              <LocationSearch 
                onLocationSearch={handleLocationSearch}
                className="w-full"
              />
              {locationText && (
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {locationText}
                  </Badge>
                </div>
              )}
            </div>
            
            <FilterPanel 
              onFiltersChange={handleFiltersChange}
              initialFilters={filters}
            />
          </div>
          
          {/* Results */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-800">
                {isLoading ? "Loading..." : `${coachesData?.total || 0} coaches found`}
                {locationText && ` near ${locationText}`}
                {filters.location && !locationText && ` in ${filters.location}`}
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-neutral-200 rounded-lg p-1">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "map" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("map")}
                    className="h-8 w-8 p-0"
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Sort by: Recommended</SelectItem>
                    {locationText && <SelectItem value="distance">Distance: Nearest First</SelectItem>}
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Rating: Highest</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Results Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-200"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : coachesData?.coaches.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-neutral-800 mb-4">No coaches found</h3>
                <p className="text-neutral-600 mb-6">Try adjusting your filters or search criteria.</p>
                <Button 
                  onClick={() => {
                    setFilters({
                      location: "",
                      zipCode: "",
                      lat: undefined,
                      lng: undefined,
                      radius: 100,
                      specialty: "",
                      minPrice: undefined,
                      maxPrice: undefined,
                      virtualOnly: undefined,
                      limit: 12, 
                      offset: 0
                    });
                    setLocationText("");
                  }}
                  variant="outline"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <>
                {viewMode === "map" ? (
                  <div className="space-y-6">
                    <GoogleMap 
                      coaches={coachesData?.coaches || []}
                      className="h-96 w-full rounded-lg border border-neutral-200"
                    />
                    <div className="text-sm text-neutral-600">
                      Showing {coachesData?.coaches.filter(c => c.lat && c.lng).length || 0} coaches with locations on map
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {coachesData?.coaches.map((coach) => (
                        <CoachCard key={coach.id} coach={coach} />
                      ))}
                    </div>
                    
                    {/* Load More */}
                    {coachesData && coachesData.coaches.length < coachesData.total && (
                      <div className="flex justify-center mt-12">
                        <Button 
                          onClick={handleLoadMore}
                          variant="outline"
                          className="px-8 py-3"
                        >
                          Load More Coaches
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
