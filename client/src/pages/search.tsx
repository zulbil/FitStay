import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import FilterPanel from "@/components/filter-panel";
import CoachCard from "@/components/coach-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Coach } from "@shared/schema";

export default function Search() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    specialty: searchParams.get("specialty") || "",
    minPrice: searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!) : undefined,
    maxPrice: searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : undefined,
    virtualOnly: searchParams.get("virtualOnly") === "true" ? true : undefined,
    limit: 12,
    offset: 0,
  });

  const [sortBy, setSortBy] = useState("recommended");

  const { data: coachesData, isLoading, error } = useQuery<{ coaches: Coach[]; total: number }>({
    queryKey: ["/api/coaches", filters, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          if (key === "specialty") {
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
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      offset: 0, // Reset pagination when filters change
    }));
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
          <div className="lg:w-1/4">
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
                {filters.location && ` in ${filters.location}`}
              </h2>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Sort by: Recommended</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating: Highest</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
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
                  onClick={() => setFilters({
                    location: "",
                    specialty: "",
                    minPrice: undefined,
                    maxPrice: undefined,
                    virtualOnly: undefined,
                    limit: 12, 
                    offset: 0
                  })}
                  variant="outline"
                >
                  Clear all filters
                </Button>
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
          </div>
        </div>
      </div>
    </section>
  );
}
