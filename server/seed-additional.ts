import { db } from "./db";
import { coaches, reviews } from "@shared/schema";

// Additional 27 coaches to reach our goal of 40 total
const additionalCoaches = [
  {
    name: "Alex Turner",
    slug: "alex-turner",
    bio: "Swimming coach and triathlon specialist with Olympic coaching experience. Alex helps athletes and fitness enthusiasts improve their swimming technique and overall endurance for triathlons and open water swimming.",
    specialties: ["Cardio", "Sports Performance", "Functional Training"],
    hourlyRate: 95,
    virtualSessions: true,
    inPersonSessions: true,
    city: "San Diego",
    state: "California",
    address: "Mission Bay Aquatic Center",
    latitude: 32.7657,
    longitude: -117.2277,
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop"
    ],
    testimonials: [
      {
        clientName: "Emma S.",
        text: "Alex helped me complete my first triathlon. His swimming technique coaching was transformational!",
        rating: 5
      }
    ]
  },
  {
    name: "Vanessa Clarke",
    slug: "vanessa-clarke",
    bio: "Women's fitness specialist and prenatal exercise expert with 8 years of experience. Vanessa focuses on empowering women through all stages of life with safe, effective fitness programs tailored to their unique needs.",
    specialties: ["Weight Loss", "Functional Training", "Cardio"],
    hourlyRate: 80,
    virtualSessions: true,
    inPersonSessions: true,
    city: "Atlanta",
    state: "Georgia",
    address: "Buckhead Women's Fitness Center",
    latitude: 33.7490,
    longitude: -84.3880,
    photos: [
      "https://images.unsplash.com/photo-1494790108755-2616c64aecf7?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&h=300&fit=crop"
    ],
    testimonials: [
      {
        clientName: "Sophie M.",
        text: "Vanessa guided me through a safe fitness routine during pregnancy and helped me bounce back after delivery.",
        rating: 5
      }
    ]
  },
  {
    name: "Brandon Cooper",
    slug: "brandon-cooper",
    bio: "Certified kettlebell instructor and functional movement specialist. Brandon combines traditional strength training with kettlebell techniques to build real-world strength and conditioning for everyday activities.",
    specialties: ["Functional Training", "Strength Training", "HIIT"],
    hourlyRate: 85,
    virtualSessions: true,
    inPersonSessions: true,
    city: "Austin",
    state: "Texas",
    address: "South Austin Kettlebell Gym",
    latitude: 30.2500,
    longitude: -97.7500,
    photos: [
      "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=300&fit=crop"
    ],
    testimonials: [
      {
        clientName: "Jake L.",
        text: "Brandon's kettlebell training completely changed my approach to fitness. I'm stronger and more mobile than ever.",
        rating: 5
      }
    ]
  },
  {
    name: "Diana Reyes",
    slug: "diana-reyes",
    bio: "Bilingual fitness coach specializing in Latin dance fitness and cultural wellness approaches. Diana brings energy and joy to fitness through dance-based workouts that celebrate movement and community.",
    specialties: ["Dance Fitness", "Cardio", "Weight Loss"],
    hourlyRate: 70,
    virtualSessions: true,
    inPersonSessions: true,
    city: "Los Angeles",
    state: "California",
    address: "East LA Community Center",
    latitude: 34.0522,
    longitude: -118.2437,
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&h=300&fit=crop"
    ],
    testimonials: [
      {
        clientName: "Isabella R.",
        text: "Diana's Zumba classes are the highlight of my week! I've lost 20 pounds while having so much fun.",
        rating: 5
      }
    ]
  },
  {
    name: "Kevin Walsh",
    slug: "kevin-walsh",
    bio: "Former Marine Corps fitness instructor with 10 years of military fitness experience. Kevin specializes in bootcamp-style workouts and mental toughness training for civilians seeking discipline and results.",
    specialties: ["HIIT", "Functional Training", "Weight Loss"],
    hourlyRate: 90,
    virtualSessions: true,
    inPersonSessions: true,
    city: "Virginia Beach",
    state: "Virginia",
    address: "Oceanfront Military Fitness Center",
    latitude: 36.8508,
    longitude: -75.9776,
    photos: [
      "https://images.unsplash.com/photo-1583468982228-19f19164aee2?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop"
    ],
    testimonials: [
      {
        clientName: "Nicole P.",
        text: "Kevin's bootcamp sessions pushed me to limits I didn't know I had. I'm in the best shape of my life!",
        rating: 5
      }
    ]
  },
  {
    name: "Maya Patel",
    slug: "maya-patel",
    bio: "Ayurvedic wellness practitioner and yoga therapist with 12 years of experience. Maya combines ancient wisdom with modern fitness science to create holistic health programs for mind, body, and spirit.",
    specialties: ["Yoga", "Nutrition Coaching", "Functional Training"],
    hourlyRate: 75,
    virtualSessions: true,
    inPersonSessions: true,
    city: "Boulder",
    state: "Colorado",
    address: "Pearl Street Wellness Center",
    latitude: 40.0150,
    longitude: -105.2705,
    photos: [
      "https://images.unsplash.com/photo-1506629905607-c3b0f6464097?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
    ],
    testimonials: [
      {
        clientName: "David K.",
        text: "Maya's holistic approach transformed not just my body, but my relationship with health and wellness entirely.",
        rating: 5
      }
    ]
  }
];

// Function to seed additional coaches
export async function seedAdditionalCoaches() {
  try {
    console.log("Adding additional coaches...");
    
    for (const coach of additionalCoaches) {
      const insertedCoach = await db.insert(coaches).values({
        slug: coach.slug,
        headline: `${coach.specialties.join(" • ")} Specialist`,
        bio: coach.bio,
        city: coach.city,
        country: "USA",
        address: coach.address,
        lat: coach.latitude,
        lng: coach.longitude,
        specialties: coach.specialties,
        pricePerHour: coach.hourlyRate,
        virtualOnly: !coach.inPersonSessions,
        photos: coach.photos,
      }).returning();
      
      // Insert testimonials as reviews
      for (const testimonial of coach.testimonials) {
        await db.insert(reviews).values({
          coachId: insertedCoach[0].id,
          author: testimonial.clientName,
          rating: testimonial.rating,
          comment: testimonial.text,
        });
      }
      
      console.log(`Inserted coach: ${coach.name}`);
    }
    
    console.log(`Successfully added ${additionalCoaches.length} additional coaches`);
    
  } catch (error) {
    console.error("Error seeding additional coaches:", error);
    throw error;
  }
}

// Run seed immediately
seedAdditionalCoaches()
  .then(() => {
    console.log("Additional coach seeding completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Additional coach seeding failed:", error);
    process.exit(1);
  });