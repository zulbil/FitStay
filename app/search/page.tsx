import { Metadata } from "next";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { coaches, specialties } from "@/lib/schema";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SearchResults } from "./search-results";

export const metadata: Metadata = {
  title: "Find a Fitness Coach Near You",
  description: "Search our directory of certified fitness coaches. Filter by location, specialty, price, and more. Find your perfect personal trainer today.",
  keywords: [
    "find fitness coach",
    "personal trainer near me",
    "online fitness coach",
    "weight loss coach",
    "strength training coach",
    "yoga instructor",
  ],
};

async function getInitialData() {
  const [allCoaches, allSpecialties] = await Promise.all([
    db.select().from(coaches).limit(20),
    db.select().from(specialties),
  ]);
  
  return { coaches: allCoaches, specialties: allSpecialties };
}

export default async function SearchPage() {
  const { coaches: initialCoaches, specialties: allSpecialties } = await getInitialData();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container-max py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Fitness Coach
          </h1>
          <p className="text-gray-600">
            Browse our directory of certified fitness professionals
          </p>
        </div>
        
        <Suspense fallback={<div className="text-center py-12">Loading coaches...</div>}>
          <SearchResults 
            initialCoaches={initialCoaches}
            specialties={allSpecialties}
          />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
}
