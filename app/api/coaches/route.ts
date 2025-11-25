import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { coaches } from "@/lib/schema";
import { desc, asc, gte, lte, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const sortBy = searchParams.get("sortBy") || "recommended";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const specialtiesParam = searchParams.getAll("specialties");
    
    let allCoaches = await db.select().from(coaches);
    
    // Filter by specialties (AND logic)
    if (specialtiesParam.length > 0) {
      allCoaches = allCoaches.filter((coach) =>
        specialtiesParam.every((specialty) =>
          coach.specialties.includes(specialty)
        )
      );
    }
    
    // Filter by price range
    if (minPrice) {
      allCoaches = allCoaches.filter(
        (coach) => coach.pricePerHour >= parseInt(minPrice)
      );
    }
    if (maxPrice) {
      allCoaches = allCoaches.filter(
        (coach) => coach.pricePerHour <= parseInt(maxPrice)
      );
    }
    
    // Sort
    switch (sortBy) {
      case "price-low":
        allCoaches.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case "price-high":
        allCoaches.sort((a, b) => b.pricePerHour - a.pricePerHour);
        break;
      case "rating":
        allCoaches.sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0));
        break;
      case "newest":
        allCoaches.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      default:
        // Recommended: sort by rating
        allCoaches.sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0));
    }
    
    const total = allCoaches.length;
    const paginatedCoaches = allCoaches.slice(offset, offset + limit);
    
    return NextResponse.json({
      coaches: paginatedCoaches,
      total,
    });
  } catch (error) {
    console.error("Error fetching coaches:", error);
    return NextResponse.json(
      { message: "Failed to fetch coaches" },
      { status: 500 }
    );
  }
}
