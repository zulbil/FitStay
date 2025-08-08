import { db } from "./db";
import { coaches } from "@shared/schema";
import { eq } from "drizzle-orm";

// Real US coach addresses with proper ZIP codes for geo-search functionality
const realUSAddresses = [
  {
    city: "Beverly Hills",
    state: "California", 
    stateCode: "CA",
    zipCode: "90210",
    address: "9876 Rodeo Drive",
    lat: 34.0736,
    lng: -118.4004
  },
  {
    city: "Manhattan",
    state: "New York",
    stateCode: "NY", 
    zipCode: "10001",
    address: "350 Fifth Avenue",
    lat: 40.7488,
    lng: -73.9857
  },
  {
    city: "Miami Beach",
    state: "Florida",
    stateCode: "FL",
    zipCode: "33139",
    address: "1500 Ocean Drive",
    lat: 25.7907,
    lng: -80.1300
  },
  {
    city: "Venice",
    state: "California",
    stateCode: "CA",
    zipCode: "90291",
    address: "1800 Ocean Front Walk",
    lat: 34.0195,
    lng: -118.4912
  },
  {
    city: "Austin",
    state: "Texas",
    stateCode: "TX",
    zipCode: "78701",
    address: "100 Congress Avenue",
    lat: 30.2672,
    lng: -97.7431
  },
  {
    city: "Denver",
    state: "Colorado",
    stateCode: "CO",
    zipCode: "80202",
    address: "1400 Lawrence Street",
    lat: 39.7392,
    lng: -104.9903
  },
  {
    city: "Seattle",
    state: "Washington",
    stateCode: "WA",
    zipCode: "98101",
    address: "400 Pine Street",
    lat: 47.6062,
    lng: -122.3321
  },
  {
    city: "Boston",
    state: "Massachusetts",
    stateCode: "MA",
    zipCode: "02101",
    address: "1 Boston Place",
    lat: 42.3601,
    lng: -71.0589
  },
  {
    city: "Chicago",
    state: "Illinois",
    stateCode: "IL",
    zipCode: "60601",
    address: "500 N Michigan Avenue",
    lat: 41.8781,
    lng: -87.6298
  },
  {
    city: "San Francisco",
    state: "California",
    stateCode: "CA",
    zipCode: "94102",
    address: "100 Van Ness Avenue",
    lat: 37.7749,
    lng: -122.4194
  },
  {
    city: "Las Vegas",
    state: "Nevada",
    stateCode: "NV",
    zipCode: "89101",
    address: "150 Las Vegas Boulevard",
    lat: 36.1699,
    lng: -115.1398
  },
  {
    city: "Phoenix",
    state: "Arizona",
    stateCode: "AZ",
    zipCode: "85001",
    address: "200 W Washington Street",
    lat: 33.4484,
    lng: -112.0740
  },
  {
    city: "Atlanta",
    state: "Georgia",
    stateCode: "GA",
    zipCode: "30301",
    address: "50 Hurt Plaza",
    lat: 33.7490,
    lng: -84.3880
  },
  {
    city: "Nashville",
    state: "Tennessee",
    stateCode: "TN",
    zipCode: "37201",
    address: "150 3rd Avenue South",
    lat: 36.1627,
    lng: -86.7816
  },
  {
    city: "Portland",
    state: "Oregon",
    stateCode: "OR",
    zipCode: "97201",
    address: "1220 SW Morrison Street",
    lat: 45.5152,
    lng: -122.6784
  },
  {
    city: "San Diego",
    state: "California",
    stateCode: "CA",
    zipCode: "92101",
    address: "600 B Street",
    lat: 32.7157,
    lng: -117.1611
  },
  {
    city: "Washington",
    state: "District of Columbia",
    stateCode: "DC",
    zipCode: "20001",
    address: "1100 Pennsylvania Avenue",
    lat: 38.9072,
    lng: -77.0369
  },
  {
    city: "Philadelphia",
    state: "Pennsylvania",
    stateCode: "PA",
    zipCode: "19101",
    address: "1500 Market Street",
    lat: 39.9526,
    lng: -75.1652
  },
  {
    city: "Minneapolis",
    state: "Minnesota",
    stateCode: "MN",
    zipCode: "55401",
    address: "800 Nicollet Mall",
    lat: 44.9778,
    lng: -93.2650
  }
];

export async function seedRealUSAddresses() {
  console.log("Updating coaches with real US addresses...");
  
  try {
    // Get all existing coaches
    const existingCoaches = await db.select().from(coaches);
    
    for (let i = 0; i < existingCoaches.length; i++) {
      const coach = existingCoaches[i];
      const addressData = realUSAddresses[i % realUSAddresses.length];
      
      const fullAddress = `${addressData.address}, ${addressData.city}, ${addressData.stateCode} ${addressData.zipCode}`;
      
      await db
        .update(coaches)
        .set({
          city: addressData.city,
          state: addressData.state,
          zipCode: addressData.zipCode,
          address: addressData.address,
          fullAddress: fullAddress,
          lat: addressData.lat,
          lng: addressData.lng,
          country: "US"
        })
        .where(eq(coaches.id, coach.id));
      
      console.log(`Updated ${coach.headline} -> ${addressData.city}, ${addressData.stateCode} ${addressData.zipCode}`);
    }
    
    console.log("Successfully updated all coaches with real US addresses!");
  } catch (error) {
    console.error("Error updating coaches with US addresses:", error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedRealUSAddresses().then(() => process.exit(0));
}