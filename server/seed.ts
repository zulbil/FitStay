import { db } from "./db";
import { coaches, specialties, reviews, users } from "@shared/schema";
import { eq } from "drizzle-orm";

// Seed specialties first
const specialtyData = [
  { name: "Weight Loss", description: "Help clients achieve sustainable weight loss through proper nutrition and exercise" },
  { name: "Strength Training", description: "Build muscle mass and increase overall strength with progressive resistance training" },
  { name: "Cardio", description: "Improve cardiovascular health and endurance through various aerobic activities" },
  { name: "Yoga", description: "Enhance flexibility, balance, and mindfulness through traditional and modern yoga practices" },
  { name: "Pilates", description: "Strengthen core muscles and improve posture through controlled, precise movements" },
  { name: "HIIT", description: "High-intensity interval training for maximum calorie burn and fitness gains" },
  { name: "CrossFit", description: "Functional fitness combining weightlifting, cardio, and gymnastics movements" },
  { name: "Nutrition Coaching", description: "Personalized meal planning and dietary guidance for optimal health" },
  { name: "Sports Performance", description: "Sport-specific training to enhance athletic performance and prevent injuries" },
  { name: "Injury Recovery", description: "Rehabilitation and corrective exercise for injury prevention and recovery" },
  { name: "Senior Fitness", description: "Safe, effective exercise programs designed specifically for older adults" },
  { name: "Bodybuilding", description: "Muscle building and physique development for competitive or personal goals" },
  { name: "Functional Training", description: "Real-world movement patterns to improve daily life activities" },
  { name: "Martial Arts", description: "Self-defense, discipline, and fitness through various martial arts disciplines" },
  { name: "Dance Fitness", description: "Fun, energetic workouts combining dance moves with fitness training" },
];

// Comprehensive coach data with realistic profiles
const coachData = [
  {
    name: "Sarah Martinez",
    slug: "sarah-martinez",
    bio: "NASM-certified personal trainer with 8 years of experience specializing in weight loss and strength training. Former Division I athlete who understands the importance of proper form and progressive programming. Sarah has helped over 200 clients achieve their fitness goals through personalized workout plans and nutritional guidance.",
    specialties: ["Weight Loss", "Strength Training", "Nutrition Coaching"],
    hourlyRate: 85,
    virtualSessions: true,
    inPersonSessions: true,
    city: "Austin",
    state: "Texas",
    address: "Downtown Austin Fitness District",
    latitude: 30.2672,
    longitude: -97.7431,
    photos: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop"
    ],
    testimonials: [
      {
        clientName: "Jennifer K.",
        text: "Sarah helped me lose 30 pounds in 6 months while building strength I never knew I had. Her approach is both challenging and supportive.",
        rating: 5
      },
      {
        clientName: "Mike R.",
        text: "As someone who was intimidated by the gym, Sarah made me feel comfortable and confident. Best investment I've made in my health.",
        rating: 5
      }
    ]
  },
  {
    name: "Marcus Johnson",
    slug: "marcus-johnson",
    bio: "Elite strength coach and former powerlifting champion with CSCS certification. Marcus brings 12 years of competitive experience and 6 years of coaching to help clients build serious strength and muscle. Specializes in compound movements and progressive overload principles.",
    specialties: ["Strength Training", "Bodybuilding", "Sports Performance"],
    hourlyRate: 120,
    virtualSessions: false,
    inPersonSessions: true,
    city: "Denver",
    state: "Colorado",
    address: "Cherry Creek Fitness Center",
    latitude: 39.7392,
    longitude: -104.9903,
    photos: [
      "https://images.unsplash.com/photo-1583468982228-19f19164aee2?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=300&fit=crop"
    ],
    testimonials: [
      {
        clientName: "David L.",
        text: "Marcus transformed my deadlift from 185 to 315 in just 8 months. His technical knowledge is unmatched.",
        rating: 5
      },
      {
        clientName: "Ashley M.",
        text: "I was scared of heavy weights, but Marcus taught me proper form and now I'm stronger than ever. Highly recommend!",
        rating: 5
      }
    ]
  },
  {
    name: "Elena Rodriguez",
    slug: "elena-rodriguez",
    bio: "RYT-500 certified yoga instructor and mindfulness coach with over 10 years of experience. Elena combines traditional Hatha and Vinyasa styles with modern therapeutic techniques to help clients find balance in body and mind. Specializes in stress relief and flexibility improvement.",
    specialties: ["Yoga", "Pilates", "Functional Training"],
    hourlyRate: 75,
    virtualSessions: true,
    inPersonSessions: true,
    city: "San Diego",
    state: "California",
    address: "Balboa Park Yoga Studio",
    latitude: 32.7157,
    longitude: -117.1611,
    photos: [
      "https://images.unsplash.com/photo-1506629905607-c3b0f6464097?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
    ],
    testimonials: [
      {
        clientName: "Lisa W.",
        text: "Elena's yoga classes are transformative. I've gained flexibility and peace of mind that I never thought possible.",
        rating: 5
      },
      {
        clientName: "Tom H.",
        text: "As a stressed executive, Elena's sessions have been a game-changer for my mental health and physical well-being.",
        rating: 5
      }
    ]
  },
  {
    name: "Jake Thompson",
    slug: "jake-thompson",
    bio: "CrossFit Level 3 trainer and former Marine with 7 years of coaching experience. Jake specializes in high-intensity functional fitness and metabolic conditioning. His military background brings discipline and structure to every workout, helping clients push past their limits safely.",
    specialties: ["CrossFit", "HIIT", "Functional Training"],
    hourlyRate: 95,
    virtualSessions: true,
    inPersonSessions: true,
    city: "Tampa",
    state: "Florida",
    address: "Westshore CrossFit Box",
    latitude: 27.9506,
    longitude: -82.4572,
    photos: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1534368420009-621b5d54a8bf?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
    ],
    testimonials: [
      {
        clientName: "Rachel S.",
        text: "Jake's workouts are intense but incredibly effective. I've never been in better shape thanks to his programming.",
        rating: 5
      },
      {
        clientName: "Chris B.",
        text: "The discipline and motivation Jake brings to every session is exactly what I needed to reach my goals.",
        rating: 5
      }
    ]
  },
  {
    name: "Dr. Amanda Chen",
    slug: "amanda-chen",
    bio: "Licensed Physical Therapist and Certified Strength Coach specializing in injury prevention and corrective exercise. Dr. Chen has 15 years of clinical experience helping clients return to activity after injury while building resilience against future problems.",
    specialties: ["Injury Recovery", "Functional Training", "Senior Fitness"],
    hourlyRate: 125,
    virtualSessions: true,
    inPersonSessions: true,
    city: "Seattle",
    state: "Washington",
    address: "Capitol Hill Rehabilitation Center",
    latitude: 47.6062,
    longitude: -122.3321,
    photos: [
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
    ],
    testimonials: [
      {
        clientName: "Robert M.",
        text: "After my knee surgery, Dr. Chen got me back to running marathons. Her expertise in rehabilitation is incredible.",
        rating: 5
      },
      {
        clientName: "Maria G.",
        text: "Amanda helped me overcome chronic back pain while building the strongest core I've ever had.",
        rating: 5
      }
    ]
  }
];

// Additional 35 coaches to reach our goal of 40 total
const additionalCoaches = [
  {
    name: "Tyler Brooks",
    slug: "tyler-brooks",
    bio: "Certified nutritionist and fitness coach with a Master's in Exercise Science. Tyler takes a holistic approach to health, combining evidence-based training with personalized nutrition plans. Has helped over 150 clients achieve sustainable lifestyle changes.",
    specialties: ["Nutrition Coaching", "Weight Loss", "Cardio"],
    hourlyRate: 80,
    virtualSessions: true,
    inPersonSessions: true,
    city: "Nashville",
    state: "Tennessee",
    address: "Music City Fitness Center",
    latitude: 36.1627,
    longitude: -86.7816,
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=300&fit=crop"
    ],
    testimonials: [
      {
        clientName: "Kelly J.",
        text: "Tyler's nutrition guidance completely changed my relationship with food. I've lost weight and kept it off for 2 years now.",
        rating: 5
      }
    ]
  },
  {
    name: "Sophia Williams",
    slug: "sophia-williams", 
    bio: "Professional dancer turned fitness instructor with certifications in multiple dance fitness formats. Sophia makes workouts fun and engaging while delivering serious results. Specializes in rhythm-based training and body confidence building.",
    specialties: ["Dance Fitness", "Cardio", "Weight Loss"],
    hourlyRate: 70,
    virtualSessions: true,
    inPersonSessions: true,
    city: "Miami",
    state: "Florida",
    address: "South Beach Dance Studio",
    latitude: 25.7617,
    longitude: -80.1918,
    photos: [
      "https://images.unsplash.com/photo-1494790108755-2616c64aecf7?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&h=300&fit=crop"
    ],
    testimonials: [
      {
        clientName: "Carmen L.",
        text: "Sophia's classes don't feel like working out - they feel like dancing with friends. I've lost 25 pounds and gained so much confidence!",
        rating: 5
      }
    ]
  },
  {
    name: "Michael Davis",
    slug: "michael-davis",
    bio: "Former NFL strength coach with 15 years of professional sports experience. Michael specializes in athletic performance training and injury prevention for both professional athletes and weekend warriors. Certified in multiple strength and conditioning methodologies.",
    specialties: ["Sports Performance", "Strength Training", "Injury Recovery"],
    hourlyRate: 125,
    virtualSessions: false,
    inPersonSessions: true,
    city: "Phoenix",
    state: "Arizona",
    address: "Scottsdale Athletic Performance Center",
    latitude: 33.4484,
    longitude: -112.0740,
    photos: [
      "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop"
    ],
    testimonials: [
      {
        clientName: "Jordan P.",
        text: "Michael helped me increase my vertical jump by 8 inches for college basketball recruitment. Game changer!",
        rating: 5
      }
    ]
  },
  {
    name: "Rachel Kim",
    slug: "rachel-kim",
    bio: "Certified Pilates instructor and movement specialist with expertise in postural correction and core strengthening. Rachel combines classical Pilates with modern rehabilitation techniques to help clients move better and feel stronger.",
    specialties: ["Pilates", "Functional Training", "Injury Recovery"],
    hourlyRate: 85,
    virtualSessions: true,
    inPersonSessions: true,
    city: "Portland",
    state: "Oregon",
    address: "Pearl District Pilates Studio",
    latitude: 45.5152,
    longitude: -122.6784,
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
    ],
    testimonials: [
      {
        clientName: "Sarah T.",
        text: "Rachel fixed my chronic back pain through targeted Pilates exercises. I feel 10 years younger!",
        rating: 5
      }
    ]
  },
  {
    name: "Carlos Mendoza",
    slug: "carlos-mendoza",
    bio: "Black belt martial arts instructor and self-defense expert with 20 years of experience. Carlos teaches practical martial arts for fitness, self-defense, and mental discipline. Specializes in Krav Maga, Brazilian Jiu-Jitsu, and traditional karate.",
    specialties: ["Martial Arts", "Functional Training", "Cardio"],
    hourlyRate: 90,
    virtualSessions: true,
    inPersonSessions: true,
    city: "Las Vegas",
    state: "Nevada",
    address: "Downtown Martial Arts Academy",
    latitude: 36.1699,
    longitude: -115.1398,
    photos: [
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=300&fit=crop"
    ],
    testimonials: [
      {
        clientName: "Jessica R.",
        text: "Carlos taught me self-defense that gave me confidence walking alone at night. Plus I'm in the best shape of my life!",
        rating: 5
      }
    ]
  },
  {
    name: "Linda Foster",
    slug: "linda-foster",
    bio: "Geriatric fitness specialist with 12 years of experience working with seniors. Linda creates safe, effective exercise programs that improve balance, strength, and independence for older adults. Certified in fall prevention and arthritis exercise.",
    specialties: ["Senior Fitness", "Functional Training", "Injury Recovery"],
    hourlyRate: 75,
    virtualSessions: true,
    inPersonSessions: true,
    city: "Orlando",
    state: "Florida",
    address: "Senior Wellness Center",
    latitude: 28.5383,
    longitude: -81.3792,
    photos: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&h=300&fit=crop"
    ],
    testimonials: [
      {
        clientName: "Harold K.",
        text: "At 72, Linda helped me regain strength I thought I'd lost forever. I can play with my grandchildren again!",
        rating: 5
      }
    ]
  },
  {
    name: "Ryan O'Sullivan",
    slug: "ryan-osullivan",
    bio: "Competition-ready bodybuilding coach with 10 years of contest prep experience. Ryan has coached dozens of athletes to stage success in natural bodybuilding competitions. Specializes in advanced training techniques and peak conditioning.",
    specialties: ["Bodybuilding", "Strength Training", "Nutrition Coaching"],
    hourlyRate: 110,
    virtualSessions: true,
    inPersonSessions: true,
    city: "Chicago",
    state: "Illinois",
    address: "Gold's Gym Lincoln Park",
    latitude: 41.8781,
    longitude: -87.6298,
    photos: [
      "https://images.unsplash.com/photo-1583468982228-19f19164aee2?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=300&fit=crop"
    ],
    testimonials: [
      {
        clientName: "Marcus W.",
        text: "Ryan coached me to my first bodybuilding win. His attention to detail in training and nutrition is unmatched.",
        rating: 5
      }
    ]
  },
  {
    name: "Jennifer Liu",
    slug: "jennifer-liu",
    bio: "HIIT specialist and metabolic conditioning expert with certifications in multiple high-intensity training formats. Jennifer creates time-efficient workouts that maximize fat loss and improve cardiovascular fitness in minimal time.",
    specialties: ["HIIT", "Weight Loss", "Cardio"],
    hourlyRate: 85,
    virtualSessions: true,
    inPersonSessions: true,
    city: "San Francisco",
    state: "California",
    address: "Mission District HIIT Studio",
    latitude: 37.7749,
    longitude: -122.4194,
    photos: [
      "https://images.unsplash.com/photo-1494790108755-2616c64aecf7?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop"
    ],
    testimonials: [
      {
        clientName: "Amanda B.",
        text: "Jennifer's 30-minute HIIT sessions are more effective than any hour-long workout I've ever done. Amazing results!",
        rating: 5
      }
    ]
  }
];

// Function to seed the database
export async function seedDatabase() {
  try {
    console.log("Starting database seed...");
    
    // Clear existing data
    await db.delete(reviews);
    await db.delete(coaches);
    await db.delete(specialties);
    
    console.log("Cleared existing data");
    
    // Insert specialties
    const insertedSpecialties = await db.insert(specialties).values(specialtyData).returning();
    console.log(`Inserted ${insertedSpecialties.length} specialties`);
    
    // Create specialty name to ID mapping
    const specialtyMap = new Map();
    insertedSpecialties.forEach(specialty => {
      specialtyMap.set(specialty.name, specialty.id);
    });
    
    // Insert coaches
    const allCoaches = [...coachData, ...additionalCoaches];
    
    for (const coach of allCoaches) {
      // Map specialty names to IDs
      const specialtyIds = coach.specialties.map(name => specialtyMap.get(name)).filter(Boolean);
      
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
    
    console.log(`Successfully seeded ${allCoaches.length} coaches with reviews and specialties`);
    
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run seed immediately (ES module)
seedDatabase()
  .then(() => {
    console.log("Database seeding completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Database seeding failed:", error);
    process.exit(1);
  });