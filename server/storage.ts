import { type User, type InsertUser, type UpsertUser, type Coach, type InsertCoach, type Specialty, type InsertSpecialty, type Review, type InsertReview, type Inquiry, type InsertInquiry, type CoachApplication, type InsertCoachApplication } from "@shared/schema";
import { users, coaches, reviews, inquiries, specialties, coachApplications } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Coaches
  getCoach(id: string): Promise<Coach | undefined>;
  getCoachBySlug(slug: string): Promise<Coach | undefined>;
  getCoaches(filters?: {
    city?: string;
    zipCode?: string;
    searchLat?: number;
    searchLng?: number;
    radius?: number;
    specialties?: string[];
    minPrice?: number;
    maxPrice?: number;
    virtualOnly?: boolean;
    sortBy?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ coaches: Coach[]; total: number }>;
  createCoach(coach: InsertCoach): Promise<Coach>;
  updateCoach(id: string, coach: Partial<InsertCoach>): Promise<Coach | undefined>;

  // Specialties
  getSpecialties(): Promise<Specialty[]>;
  createSpecialty(specialty: InsertSpecialty): Promise<Specialty>;

  // Reviews
  getReviewsByCoachId(coachId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Inquiries
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiries(): Promise<Inquiry[]>;
  
  // Coach Applications
  createCoachApplication(application: InsertCoachApplication): Promise<CoachApplication>;
  getCoachApplicationByUserId(userId: string): Promise<CoachApplication | undefined>;
  getCoachApplications(): Promise<CoachApplication[]>;
  updateCoachApplication(id: string, updates: Partial<InsertCoachApplication>): Promise<CoachApplication | undefined>;
  createCoachFromApplication(applicationId: string): Promise<Coach | undefined>;
  
  // Admin management
  getClients(): Promise<User[]>;
  deleteCoach(id: string): Promise<void>;
  updateSpecialty(id: string, updates: Partial<InsertSpecialty>): Promise<Specialty | undefined>;
  deleteSpecialty(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private coaches: Map<string, Coach>;
  private specialties: Map<string, Specialty>;
  private reviews: Map<string, Review>;
  private inquiries: Map<string, Inquiry>;

  constructor() {
    this.users = new Map();
    this.coaches = new Map();
    this.specialties = new Map();
    this.reviews = new Map();
    this.inquiries = new Map();
    
    // Seed data
    this.seedData();
  }

  private generateReviewsForCoach(coachSlug: string, coachId: string) {
    const reviewTemplates = {
      'sarah-chen': [
        { author: "Jessica Martinez", rating: 5, comment: "Sarah completely transformed my approach to fitness! Lost 28 pounds in 5 months and gained so much confidence. Her HIIT workouts are challenging but so effective." },
        { author: "Mike Thompson", rating: 5, comment: "Best trainer I've ever worked with. Sarah's weight loss program is science-based and actually works. Down 35 pounds and feeling incredible!" },
        { author: "Amanda Rodriguez", rating: 5, comment: "Sarah helped me break through my plateau after years of struggling. Her personalized approach and motivational coaching style make all the difference." }
      ],
      'marcus-steel': [
        { author: "David Chen", rating: 5, comment: "Marcus is a powerlifting legend! He helped me add 150lbs to my total and qualify for nationals. His technique coaching is unmatched." },
        { author: "Lisa Johnson", rating: 5, comment: "Never thought I could deadlift 300lbs as a woman, but Marcus made it happen! His strength programs are incredibly effective." },
        { author: "Robert Kim", rating: 4, comment: "Solid coaching and great programming. Marcus knows his stuff when it comes to powerlifting and strength training." }
      ],
      'elena-harmony': [
        { author: "Sarah Wilson", rating: 5, comment: "Elena's yoga classes have been life-changing for my stress and flexibility. Her meditation guidance helped me find inner peace I never knew existed." },
        { author: "Jennifer Lopez", rating: 5, comment: "Perfect blend of challenging poses and mindful practice. Elena creates such a welcoming, spiritual environment for growth." },
        { author: "Mark Davis", rating: 5, comment: "As a stressed executive, Elena's classes became my sanctuary. Her teaching style is both grounding and transformative." }
      ],
      'default': [
        { author: "Client A", rating: 5, comment: "Amazing coach with incredible expertise! Highly professional and gets real results." },
        { author: "Client B", rating: 4, comment: "Great trainer who really knows their stuff. Very motivating and supportive throughout the journey." },
        { author: "Client C", rating: 5, comment: "Exceeded all my expectations! This coach completely transformed my fitness and mindset." }
      ]
    };

    // Return coach-specific reviews or default ones
    return reviewTemplates[coachSlug] || reviewTemplates['default'];
  }

  private seedData() {
    // Seed specialties
    const specialtyData = [
      { name: "Weight Loss", description: "Fat loss and body composition improvement" },
      { name: "Strength Training", description: "Building muscle and power" },
      { name: "Yoga", description: "Flexibility, mindfulness, and balance" },
      { name: "Nutrition", description: "Meal planning and dietary guidance" },
      { name: "HIIT", description: "High-intensity interval training" },
      { name: "Powerlifting", description: "Competitive lifting and strength" },
      { name: "Pilates", description: "Core strength and stability" },
      { name: "Sports Performance", description: "Athletic performance enhancement" },
      { name: "Mobility", description: "Movement quality and injury prevention" },
      { name: "Meditation", description: "Mindfulness and stress management" }
    ];

    specialtyData.forEach(spec => {
      const specialty: Specialty = {
        id: randomUUID(),
        name: spec.name,
        description: spec.description
      };
      this.specialties.set(specialty.id, specialty);
    });

    // Seed coaches - Houston area focused for location testing
    const coachData = [
      {
        slug: "sarah-chen",
        headline: "Elite Weight Loss & HIIT Specialist",
        bio: "NASM-certified personal trainer with 8+ years transforming lives through evidence-based weight loss and HIIT programs. Former competitive athlete turned coach, I understand what it takes to push past plateaus and achieve lasting results.",
        city: "Houston",
        state: "Texas",
        zipCode: "77043",
        country: "US",
        address: "3663 Westheimer Rd",
        fullAddress: "3663 Westheimer Rd, Houston, TX 77027",
        lat: 29.7390,
        lng: -95.4426,
        specialties: ["Weight Loss", "HIIT"],
        pricePerHour: 95,
        virtualOnly: false,
        ratingAvg: 4.9,
        ratingCount: 247,
        photos: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1550259979-ed79b48d2a30?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "marcus-steel",
        headline: "Powerlifting & Strength Coach",
        bio: "Former powerlifting champion with 12+ years coaching experience. Specialized in Olympic lifting, powerlifting, and strength training for all levels. Multiple world record holder seeking to build the next generation of strong athletes.",
        city: "Sugar Land",
        state: "Texas", 
        zipCode: "77478",
        country: "US",
        address: "2711 Plaza Dr",
        fullAddress: "2711 Plaza Dr, Sugar Land, TX 77478",
        lat: 29.5944,
        lng: -95.6349,
        specialties: ["Strength Training", "Powerlifting"],
        pricePerHour: 110,
        virtualOnly: false,
        ratingAvg: 4.8,
        ratingCount: 189,
        photos: [
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019612062-5a9c769fdd5b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "elena-harmony",
        headline: "Yoga & Mindfulness Master",
        bio: "RYT-500 certified yoga instructor and meditation teacher. 10+ years guiding students through transformative practices combining ancient wisdom with modern wellness. Specializing in stress relief, flexibility, and inner peace.",
        city: "The Woodlands",
        state: "Texas",
        zipCode: "77380",
        country: "US", 
        address: "1201 Lake Woodlands Dr",
        fullAddress: "1201 Lake Woodlands Dr, The Woodlands, TX 77380",
        lat: 30.1588,
        lng: -95.4695,
        specialties: ["Yoga", "Meditation"],
        pricePerHour: 80,
        virtualOnly: false,
        ratingAvg: 5.0,
        ratingCount: 312,
        photos: [
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1506629905607-c52b09bc7b6d?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "david-nutrition",
        headline: "Clinical Nutritionist & Wellness Expert", 
        bio: "Licensed Registered Dietitian with Master's in Sports Nutrition. 15+ years helping clients optimize health through personalized nutrition strategies. Specializes in metabolic health, meal planning, and sustainable lifestyle changes.",
        city: "Katy",
        state: "Texas",
        zipCode: "77494",
        country: "US",
        address: "23501 Cinco Ranch Blvd",
        fullAddress: "23501 Cinco Ranch Blvd, Katy, TX 77494",
        lat: 29.7399,
        lng: -95.7630,
        specialties: ["Nutrition"],
        pricePerHour: 85,
        virtualOnly: false,
        ratingAvg: 4.7,
        ratingCount: 403,
        photos: [
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "jamie-cardio", 
        headline: "HIIT & Cardio Performance Coach",
        bio: "High-energy fitness specialist with background in competitive athletics. Expert in HIIT protocols, cardio conditioning, and metabolic training. Perfect for busy professionals seeking maximum results in minimal time.",
        city: "Pearland",
        state: "Texas",
        zipCode: "77584",
        country: "US",
        address: "11200 Broadway St",
        fullAddress: "11200 Broadway St, Pearland, TX 77584",
        lat: 29.5637,
        lng: -95.3103,
        specialties: ["HIIT", "Weight Loss"],
        pricePerHour: 75,
        virtualOnly: false,
        ratingAvg: 4.9,
        ratingCount: 298,
        photos: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "alex-mobility",
        headline: "Mobility & Movement Specialist", 
        bio: "Doctor of Physical Therapy and movement specialist. 8+ years helping clients improve mobility, prevent injuries, and optimize athletic performance through corrective exercise and movement screening.",
        city: "Austin",
        state: "Texas",
        zipCode: "78701",
        country: "US", 
        address: "100 Congress Avenue",
        fullAddress: "100 Congress Avenue, Austin, TX 78701",
        lat: 30.2672,
        lng: -97.7431,
        specialties: ["Mobility", "Sports Performance"],
        pricePerHour: 90,
        virtualOnly: false,
        ratingAvg: 4.8,
        ratingCount: 156,
        photos: [
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019612062-5a9c769fdd5b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "maya-pilates",
        headline: "Classical Pilates Master Instructor",
        bio: "Master Pilates instructor trained in classical method with 12+ years experience. Specializes in core strength, posture correction, and mind-body connection. Former dancer bringing artistry to movement.", 
        city: "Spring",
        state: "Texas",
        zipCode: "77379",
        country: "US",
        address: "25704 I-45 N",
        fullAddress: "25704 I-45 N, Spring, TX 77379",
        lat: 30.0799,
        lng: -95.4183,
        specialties: ["Pilates", "Mobility"],
        pricePerHour: 100,
        virtualOnly: false,
        ratingAvg: 4.9,
        ratingCount: 234,
        photos: [
          "https://images.unsplash.com/photo-1506629905607-c52b09bc7b6d?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "carlos-boxing",
        headline: "Professional Boxing & Combat Sports Coach",
        bio: "Former professional boxer with 15+ years coaching experience. Specializes in boxing technique, combat conditioning, and mental toughness training. Perfect for fitness boxing and competitive training.",
        city: "Las Vegas",
        country: "USA",
        address: "3400 Las Vegas Blvd S, Las Vegas, NV 89109, USA",
        lat: 36.1162,
        lng: -115.1730,
        specialties: ["Sports Performance", "Strength Training"],
        pricePerHour: 85,
        virtualOnly: false,
        ratingAvg: 4.7,
        ratingCount: 178,
        photos: [
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019612062-5a9c769fdd5b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "rachel-runner",
        headline: "Marathon & Endurance Running Coach",
        bio: "Boston Marathon qualifier and USATF certified running coach. 10+ years helping runners achieve personal bests from 5K to marathon distance. Specializes in training periodization and injury prevention.",
        city: "Boston",
        country: "USA",
        address: "67 Newbury Street, Boston, MA 02116, USA",
        lat: 42.3505,
        lng: -71.0621,
        specialties: ["Sports Performance"],
        pricePerHour: 70,
        virtualOnly: false,
        ratingAvg: 4.8,
        ratingCount: 145,
        photos: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1550259979-ed79b48d2a30?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1506629905607-c52b09bc7b6d?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "tom-crossfit",
        headline: "CrossFit Level 3 Trainer & Competition Coach",
        bio: "CrossFit Level 3 trainer with 8+ years coaching athletes from beginners to Games competitors. Specializes in functional fitness, Olympic lifting, and metabolic conditioning for peak performance.",
        city: "San Diego",
        country: "USA",
        address: "1537 India Street, San Diego, CA 92101, USA",
        lat: 32.7281,
        lng: -117.1677,
        specialties: ["Strength Training", "HIIT"],
        pricePerHour: 95,
        virtualOnly: false,
        ratingAvg: 4.9,
        ratingCount: 267,
        photos: [
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019612062-5a9c769fdd5b?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "lisa-swimmer",
        headline: "Swimming Technique & Triathlon Coach",
        bio: "Former collegiate swimmer and triathlon coach with 12+ years experience. Specializes in swimming technique, open water training, and triathlon preparation for all levels from beginner to Ironman.",
        city: "Honolulu",
        country: "USA",
        address: "2552 Kalakaua Avenue, Honolulu, HI 96815, USA",
        lat: 21.2784,
        lng: -157.8334,
        specialties: ["Sports Performance"],
        pricePerHour: 80,
        virtualOnly: false,
        ratingAvg: 4.8,
        ratingCount: 134,
        photos: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "james-bodybuilding",
        headline: "Natural Bodybuilding & Physique Coach",
        bio: "Natural bodybuilding champion and contest prep specialist. 15+ years helping clients build muscle, cut fat, and achieve their dream physique through evidence-based training and nutrition protocols.",
        city: "Phoenix",
        country: "USA",
        address: "4455 E Camelback Rd, Phoenix, AZ 85018, USA",
        lat: 33.5020,
        lng: -111.9757,
        specialties: ["Strength Training", "Nutrition"],
        pricePerHour: 105,
        virtualOnly: false,
        ratingAvg: 4.7,
        ratingCount: 198,
        photos: [
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019612062-5a9c769fdd5b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "anna-dance",
        headline: "Dance Fitness & Choreography Instructor",
        bio: "Professional dancer and choreographer bringing 10+ years of studio experience to fitness. Specializes in dance fitness, Zumba, and movement expression. Making fitness fun and accessible for everyone.",
        city: "New York",
        country: "USA",
        address: "1567 Broadway, New York, NY 10036, USA",
        lat: 40.7580,
        lng: -73.9855,
        specialties: ["HIIT", "Weight Loss"],
        pricePerHour: 85,
        virtualOnly: false,
        ratingAvg: 4.9,
        ratingCount: 289,
        photos: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1506629905607-c52b09bc7b6d?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "mike-kettlebell",
        headline: "Kettlebell & Functional Training Expert",
        bio: "RKC certified kettlebell instructor with 9+ years specializing in functional movement patterns. Expert in kettlebell sport, strongman training, and primal movement for real-world strength and conditioning.",
        city: "Nashville",
        country: "USA",
        address: "1809 21st Ave S, Nashville, TN 37212, USA",
        lat: 36.1385,
        lng: -86.8014,
        specialties: ["Strength Training", "Mobility"],
        pricePerHour: 75,
        virtualOnly: false,
        ratingAvg: 4.8,
        ratingCount: 167,
        photos: [
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019612062-5a9c769fdd5b?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "sophia-wellness",
        headline: "Holistic Wellness & Life Coach",
        bio: "Certified wellness coach combining fitness, nutrition, and mindfulness for total life transformation. 7+ years helping busy professionals create sustainable healthy habits and achieve work-life balance.",
        city: "Chicago",
        country: "USA",
        address: "875 N Michigan Ave, Chicago, IL 60611, USA",
        lat: 41.8995,
        lng: -87.6251,
        specialties: ["Weight Loss", "Nutrition", "Meditation"],
        pricePerHour: 90,
        virtualOnly: false,
        ratingAvg: 4.9,
        ratingCount: 234,
        photos: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "ryan-athlete",
        headline: "Elite Athletic Performance Coach",
        bio: "Former Division I athlete and certified strength coach working with pro athletes and weekend warriors. Specializes in speed training, agility, and sport-specific conditioning for peak athletic performance.",
        city: "Dallas",
        country: "USA",
        address: "1701 N Market St, Dallas, TX 75202, USA",
        lat: 32.7838,
        lng: -96.8059,
        specialties: ["Sports Performance", "Strength Training"],
        pricePerHour: 120,
        virtualOnly: false,
        ratingAvg: 4.8,
        ratingCount: 145,
        photos: [
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019612062-5a9c769fdd5b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "maria-seniors",
        headline: "Senior Fitness & Rehabilitation Specialist",
        bio: "Exercise physiologist specializing in senior fitness and post-rehabilitation training. 11+ years helping older adults maintain independence, improve balance, and age gracefully through safe, effective exercise.",
        city: "Tampa",
        country: "USA",
        address: "401 E Jackson St, Tampa, FL 33602, USA",
        lat: 27.9492,
        lng: -82.4602,
        specialties: ["Mobility", "Strength Training"],
        pricePerHour: 65,
        virtualOnly: false,
        ratingAvg: 5.0,
        ratingCount: 178,
        photos: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "kevin-cycling",
        headline: "Cycling & Spin Class Instructor",
        bio: "Certified spin instructor and cycling coach with competitive racing background. 8+ years leading high-energy classes and training cyclists for centuries, gran fondos, and competitive events.",
        city: "Boulder",
        country: "USA",
        address: "1123 Pearl St, Boulder, CO 80302, USA",
        lat: 40.0190,
        lng: -105.2737,
        specialties: ["Sports Performance", "HIIT"],
        pricePerHour: 70,
        virtualOnly: false,
        ratingAvg: 4.7,
        ratingCount: 156,
        photos: [
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019612062-5a9c769fdd5b?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "nicole-barre",
        headline: "Barre & Ballet-Inspired Fitness Expert",
        bio: "Former professional ballet dancer turned barre instructor. 9+ years creating graceful, challenging workouts that sculpt lean muscle and improve posture through ballet-inspired movements.",
        city: "Charleston",
        country: "USA",
        address: "102 N Market St, Charleston, SC 29401, USA",
        lat: 32.7797,
        lng: -79.9310,
        specialties: ["Pilates", "Mobility"],
        pricePerHour: 75,
        virtualOnly: false,
        ratingAvg: 4.9,
        ratingCount: 201,
        photos: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1506629905607-c52b09bc7b6d?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "derek-martial",
        headline: "Martial Arts & Self-Defense Instructor",
        bio: "3rd degree black belt in Taekwondo and certified Krav Maga instructor. 12+ years teaching martial arts, self-defense, and discipline through traditional and modern combat systems.",
        city: "Atlanta",
        country: "USA",
        address: "265 Peachtree Center Ave, Atlanta, GA 30303, USA",
        lat: 33.7593,
        lng: -84.3866,
        specialties: ["Sports Performance", "Strength Training"],
        pricePerHour: 80,
        virtualOnly: false,
        ratingAvg: 4.8,
        ratingCount: 123,
        photos: [
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019612062-5a9c769fdd5b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "amanda-postpartum",
        headline: "Pre & Postnatal Fitness Specialist",
        bio: "Certified pre and postnatal exercise specialist helping mothers stay fit through pregnancy and recover postpartum. 6+ years supporting women through their fitness journey during this special time.",
        city: "Minneapolis",
        country: "USA",
        address: "1200 Nicollet Mall, Minneapolis, MN 55403, USA",
        lat: 44.9633,
        lng: -93.2683,
        specialties: ["Weight Loss", "Mobility"],
        pricePerHour: 85,
        virtualOnly: false,
        ratingAvg: 5.0,
        ratingCount: 167,
        photos: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "jordan-hiit",
        headline: "HIIT & Boot Camp Commander",
        bio: "Former military fitness instructor bringing discipline and intensity to civilian fitness. 10+ years leading boot camp classes and HIIT sessions that push limits and deliver real results.",
        city: "Virginia Beach",
        country: "USA",
        address: "1849 Pacific Ave, Virginia Beach, VA 23451, USA",
        lat: 36.8531,
        lng: -75.9787,
        specialties: ["HIIT", "Strength Training"],
        pricePerHour: 70,
        virtualOnly: false,
        ratingAvg: 4.7,
        ratingCount: 189,
        photos: [
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "stephanie-stretch",
        headline: "Flexibility & Stretching Specialist",
        bio: "Certified flexibility specialist and former gymnast with 8+ years helping clients improve range of motion, reduce pain, and prevent injuries through targeted stretching and mobility work.",
        city: "Salt Lake City",
        country: "USA",
        address: "136 E South Temple, Salt Lake City, UT 84111, USA",
        lat: 40.7596,
        lng: -111.8868,
        specialties: ["Mobility", "Yoga"],
        pricePerHour: 65,
        virtualOnly: false,
        ratingAvg: 4.8,
        ratingCount: 145,
        photos: [
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1506629905607-c52b09bc7b6d?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "brandon-outdoor",
        headline: "Outdoor Adventure & Functional Fitness",
        bio: "Adventure athlete and wilderness guide combining outdoor activities with functional fitness training. 9+ years leading hiking, rock climbing, and outdoor boot camps that build real-world strength.",
        city: "Asheville",
        country: "USA",
        address: "46 Haywood St, Asheville, NC 28801, USA",
        lat: 35.5951,
        lng: -82.5515,
        specialties: ["Sports Performance", "Mobility"],
        pricePerHour: 80,
        virtualOnly: false,
        ratingAvg: 4.9,
        ratingCount: 134,
        photos: [
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019612062-5a9c769fdd5b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "crystal-mindful",
        headline: "Mindful Movement & Stress Relief Coach",
        bio: "Licensed therapist and certified yoga instructor specializing in stress management through movement. 7+ years helping clients reduce anxiety and build resilience through mindful fitness practices.",
        city: "Sedona",
        country: "USA",
        address: "2250 W State Route 89A, Sedona, AZ 86336, USA",
        lat: 34.8697,
        lng: -111.7610,
        specialties: ["Yoga", "Meditation"],
        pricePerHour: 90,
        virtualOnly: false,
        ratingAvg: 5.0,
        ratingCount: 198,
        photos: [
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1506629905607-c52b09bc7b6d?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "tyler-calisthenics",
        headline: "Calisthenics & Bodyweight Expert",
        bio: "Calisthenics athlete and movement coach specializing in bodyweight training progressions. 6+ years teaching clients to master their bodyweight through skills like handstands, muscle-ups, and human flags.",
        city: "San Antonio",
        country: "USA",
        address: "123 Losoya St, San Antonio, TX 78205, USA",
        lat: 29.4246,
        lng: -98.4951,
        specialties: ["Strength Training", "Mobility"],
        pricePerHour: 75,
        virtualOnly: false,
        ratingAvg: 4.8,
        ratingCount: 156,
        photos: [
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "vanessa-dance",
        headline: "Latin Dance & Cardio Fusion Instructor",
        bio: "Professional Latin dance instructor bringing passion and energy to fitness. 8+ years teaching salsa, bachata, and dance cardio fusion classes that make exercise feel like a celebration.",
        city: "Orlando",
        country: "USA",
        address: "8001 S Orange Blossom Trl, Orlando, FL 32809, USA",
        lat: 28.4677,
        lng: -81.3947,
        specialties: ["HIIT", "Weight Loss"],
        pricePerHour: 70,
        virtualOnly: false,
        ratingAvg: 4.9,
        ratingCount: 223,
        photos: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1506629905607-c52b09bc7b6d?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "gary-powerlifting",
        headline: "Elite Powerlifting & Competition Coach",
        bio: "National level powerlifting competitor and coach with 18+ years experience. Specializes in competition preparation, technique refinement, and breaking through strength plateaus at the highest level.",
        city: "Columbus",
        country: "USA",
        address: "175 S 3rd St, Columbus, OH 43215, USA",
        lat: 39.9625,
        lng: -82.9988,
        specialties: ["Powerlifting", "Strength Training"],
        pricePerHour: 115,
        virtualOnly: false,
        ratingAvg: 4.7,
        ratingCount: 134,
        photos: [
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019612062-5a9c769fdd5b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "melissa-aqua",
        headline: "Aquatic Fitness & Water Therapy Specialist",
        bio: "Certified aquatic fitness instructor with background in water therapy. 9+ years helping clients with joint issues, arthritis, and injuries maintain fitness through low-impact water workouts.",
        city: "San Jose",
        country: "USA",
        address: "200 S 1st St, San Jose, CA 95113, USA",
        lat: 37.3361,
        lng: -121.8905,
        specialties: ["Mobility", "Weight Loss"],
        pricePerHour: 80,
        virtualOnly: false,
        ratingAvg: 4.8,
        ratingCount: 167,
        photos: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "trevor-strongman",
        headline: "Strongman & Functional Strength Coach",
        bio: "Competitive strongman athlete with 11+ years coaching functional strength training. Specializes in odd object lifting, farmer's walks, and building practical strength for everyday life and competition.",
        city: "Kansas City",
        country: "USA",
        address: "1201 Walnut St, Kansas City, MO 64106, USA",
        lat: 39.0982,
        lng: -94.5842,
        specialties: ["Strength Training", "Sports Performance"],
        pricePerHour: 85,
        virtualOnly: false,
        ratingAvg: 4.7,
        ratingCount: 145,
        photos: [
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019612062-5a9c769fdd5b?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "jasmine-aerial",
        headline: "Aerial Yoga & Circus Arts Instructor",
        bio: "Professional circus artist and aerial yoga instructor with 7+ years experience. Combines traditional yoga with aerial arts for unique workouts that build strength, flexibility, and confidence.",
        city: "Richmond",
        country: "USA",
        address: "919 E Main St, Richmond, VA 23219, USA",
        lat: 37.5407,
        lng: -77.4360,
        specialties: ["Yoga", "Mobility"],
        pricePerHour: 95,
        virtualOnly: false,
        ratingAvg: 4.9,
        ratingCount: 189,
        photos: [
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1506629905607-c52b09bc7b6d?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "curtis-rehab",
        headline: "Exercise Therapy & Rehabilitation Specialist",
        bio: "Licensed physical therapist assistant with 13+ years in rehabilitation and corrective exercise. Specializes in post-injury training, movement dysfunction correction, and pain-free fitness.",
        city: "Memphis",
        country: "USA",
        address: "145 S Main St, Memphis, TN 38103, USA",
        lat: 35.1470,
        lng: -90.0505,
        specialties: ["Mobility", "Strength Training"],
        pricePerHour: 90,
        virtualOnly: false,
        ratingAvg: 4.8,
        ratingCount: 156,
        photos: [
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019612062-5a9c769fdd5b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "diana-nutrition",
        headline: "Sports Nutrition & Meal Planning Expert",
        bio: "Certified sports nutritionist with Master's in Exercise Science. 10+ years creating personalized nutrition strategies for athletes and fitness enthusiasts to optimize performance and body composition.",
        city: "Phoenix",
        country: "USA",
        address: null,
        lat: null,
        lng: null,
        specialties: ["Nutrition", "Weight Loss"],
        pricePerHour: 95,
        virtualOnly: true,
        ratingAvg: 4.9,
        ratingCount: 267,
        photos: [
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "pete-golf",
        headline: "Golf Fitness & Performance Specialist",
        bio: "TPI certified golf fitness instructor and former collegiate golfer. 8+ years helping golfers improve their game through mobility training, strength conditioning, and movement screening specific to golf.",
        city: "Scottsdale",
        country: "USA",
        address: "7014 E Camelback Rd, Scottsdale, AZ 85251, USA",
        lat: 33.5021,
        lng: -111.9262,
        specialties: ["Sports Performance", "Mobility"],
        pricePerHour: 100,
        virtualOnly: false,
        ratingAvg: 4.8,
        ratingCount: 134,
        photos: [
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019612062-5a9c769fdd5b?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "lauren-bootcamp",
        headline: "High-Intensity Boot Camp Commander",
        bio: "Former military instructor and certified boot camp leader with 12+ years experience. Creates challenging, motivating group workouts and individual training that builds mental and physical toughness.",
        city: "Jacksonville",
        country: "USA",
        address: "117 W Duval St, Jacksonville, FL 32202, USA",
        lat: 30.3282,
        lng: -81.6557,
        specialties: ["HIIT", "Strength Training"],
        pricePerHour: 75,
        virtualOnly: false,
        ratingAvg: 4.7,
        ratingCount: 198,
        photos: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "richard-wellness",
        headline: "Executive Wellness & Stress Management Coach",
        bio: "Corporate wellness specialist with 14+ years helping executives and busy professionals integrate fitness into demanding schedules. Expert in stress management, energy optimization, and sustainable habits.",
        city: "Washington DC",
        country: "USA",
        address: "1100 Pennsylvania Avenue, Washington, DC 20004, USA",
        lat: 38.8938,
        lng: -77.0281,
        specialties: ["Weight Loss", "Nutrition", "Meditation"],
        pricePerHour: 125,
        virtualOnly: false,
        ratingAvg: 4.9,
        ratingCount: 145,
        photos: [
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019612062-5a9c769fdd5b?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "emily-teen",
        headline: "Youth & Teen Fitness Specialist",
        bio: "Youth development specialist with 9+ years working with teenagers and young athletes. Focuses on building healthy habits, confidence, and athletic skills in a positive, encouraging environment.",
        city: "Raleigh",
        country: "USA",
        address: "222 Glenwood Ave, Raleigh, NC 27603, USA",
        lat: 35.7721,
        lng: -78.6386,
        specialties: ["Sports Performance", "Strength Training"],
        pricePerHour: 70,
        virtualOnly: false,
        ratingAvg: 5.0,
        ratingCount: 167,
        photos: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "antonio-recovery",
        headline: "Recovery & Regeneration Specialist",
        bio: "Certified recovery specialist and massage therapist with 10+ years focusing on muscle recovery, injury prevention, and performance optimization through advanced recovery techniques and modalities.",
        city: "Albuquerque",
        country: "USA",
        address: "20 1st Plaza NW, Albuquerque, NM 87102, USA",
        lat: 35.0844,
        lng: -106.6504,
        specialties: ["Mobility", "Sports Performance"],
        pricePerHour: 85,
        virtualOnly: false,
        ratingAvg: 4.8,
        ratingCount: 134,
        photos: [
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019612062-5a9c769fdd5b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=400&h=300&fit=crop"
        ]
      },
      {
        slug: "sarah-virtual",
        headline: "Online Fitness & Virtual Training Expert",
        bio: "Digital fitness pioneer with 6+ years creating engaging online workout experiences. Specializes in virtual personal training, online group classes, and building fitness communities in the digital space.",
        city: "Remote",
        country: "USA",
        address: null,
        lat: null,
        lng: null,
        specialties: ["HIIT", "Weight Loss", "Strength Training"],
        pricePerHour: 65,
        virtualOnly: true,
        ratingAvg: 4.9,
        ratingCount: 389,
        photos: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop"
        ]
      }
    ];

    coachData.forEach(coach => {
      const userId = randomUUID();
      const user: User = {
        id: userId,
        email: `${coach.slug}@coachbnb.com`,
        name: coach.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        role: "COACH",
        createdAt: new Date()
      };
      this.users.set(user.id, user);

      const coachRecord: Coach = {
        id: randomUUID(),
        userId: userId,
        slug: coach.slug,
        headline: coach.headline,
        bio: coach.bio,
        city: coach.city,
        country: coach.country,
        address: coach.address || null,
        lat: coach.lat || null,
        lng: coach.lng || null,
        specialties: coach.specialties,
        pricePerHour: coach.pricePerHour,
        virtualOnly: coach.virtualOnly,
        ratingAvg: coach.ratingAvg,
        ratingCount: coach.ratingCount,
        photos: coach.photos,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.coaches.set(coachRecord.id, coachRecord);

      // Add comprehensive reviews/testimonials for each coach
      const reviewData = this.generateReviewsForCoach(coach.slug, coachRecord.id);

      reviewData.forEach(reviewItem => {
        const review: Review = {
          id: randomUUID(),
          coachId: coachRecord.id,
          author: reviewItem.author,
          rating: reviewItem.rating,
          comment: reviewItem.comment,
          createdAt: new Date()
        };
        this.reviews.set(review.id, review);
      });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      name: insertUser.name || null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    if (userData.id && this.users.has(userData.id)) {
      const existingUser = this.users.get(userData.id)!;
      const updatedUser = { ...existingUser, ...userData, updatedAt: new Date() };
      this.users.set(userData.id, updatedUser);
      return updatedUser;
    } else {
      const id = userData.id || randomUUID();
      const user: User = {
        ...userData,
        id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(id, user);
      return user;
    }
  }

  // Helper function to calculate distance between two points (Haversine formula)
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in miles
  }

  async getCoach(id: string): Promise<Coach | undefined> {
    return this.coaches.get(id);
  }

  async getCoachBySlug(slug: string): Promise<Coach | undefined> {
    return Array.from(this.coaches.values()).find(coach => coach.slug === slug);
  }

  async getCoaches(filters: {
    city?: string;
    zipCode?: string;
    searchLat?: number;
    searchLng?: number;
    radius?: number;
    specialties?: string[];
    minPrice?: number;
    maxPrice?: number;
    virtualOnly?: boolean;
    sortBy?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ coaches: Coach[]; total: number }> {
    let coaches = Array.from(this.coaches.values());

    // Apply location-based filtering
    if (filters.searchLat && filters.searchLng && filters.radius) {
      coaches = coaches.filter(coach => {
        if (!coach.lat || !coach.lng) return false;
        const distance = this.calculateDistance(
          filters.searchLat!, 
          filters.searchLng!, 
          coach.lat, 
          coach.lng
        );
        return distance <= filters.radius!;
      });
    }

    // Apply city filter
    if (filters.city) {
      coaches = coaches.filter(coach => 
        coach.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }

    if (filters.specialties && filters.specialties.length > 0) {
      coaches = coaches.filter(coach =>
        filters.specialties!.every(specialty => coach.specialties.includes(specialty))
      );
    }

    if (filters.minPrice !== undefined) {
      coaches = coaches.filter(coach => coach.pricePerHour >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      coaches = coaches.filter(coach => coach.pricePerHour <= filters.maxPrice!);
    }

    if (filters.virtualOnly !== undefined) {
      if (filters.virtualOnly) {
        // Show only virtual-only coaches
        coaches = coaches.filter(coach => coach.virtualOnly);
      } else {
        // Show only coaches that offer in-person sessions (not virtual-only)
        coaches = coaches.filter(coach => !coach.virtualOnly);
      }
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          coaches.sort((a, b) => a.pricePerHour - b.pricePerHour);
          break;
        case 'price-high':
          coaches.sort((a, b) => b.pricePerHour - a.pricePerHour);
          break;
        case 'rating':
          coaches.sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0));
          break;
        case 'newest':
          coaches.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          break;
        default:
          // Default sorting by rating then by rating count
          coaches.sort((a, b) => {
            const ratingDiff = (b.ratingAvg || 0) - (a.ratingAvg || 0);
            if (ratingDiff !== 0) return ratingDiff;
            return (b.ratingCount || 0) - (a.ratingCount || 0);
          });
      }
    } else {
      // Default sorting
      coaches.sort((a, b) => {
        const ratingDiff = (b.ratingAvg || 0) - (a.ratingAvg || 0);
        if (ratingDiff !== 0) return ratingDiff;
        return (b.ratingCount || 0) - (a.ratingCount || 0);
      });
    }

    const total = coaches.length;

    // Apply pagination
    const offset = filters.offset || 0;
    const limit = filters.limit || 20;
    coaches = coaches.slice(offset, offset + limit);

    return { coaches, total };
  }

  async createCoach(insertCoach: InsertCoach): Promise<Coach> {
    const id = randomUUID();
    const coach: Coach = {
      ...insertCoach,
      id,
      specialties: insertCoach.specialties || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.coaches.set(id, coach);
    return coach;
  }

  async updateCoach(id: string, updateData: Partial<InsertCoach>): Promise<Coach | undefined> {
    const coach = this.coaches.get(id);
    if (!coach) return undefined;

    const updatedCoach: Coach = {
      ...coach,
      ...updateData,
      updatedAt: new Date()
    };
    this.coaches.set(id, updatedCoach);
    return updatedCoach;
  }

  async getSpecialties(): Promise<Specialty[]> {
    return Array.from(this.specialties.values());
  }

  async createSpecialty(insertSpecialty: InsertSpecialty): Promise<Specialty> {
    const id = randomUUID();
    const specialty: Specialty = { 
      ...insertSpecialty, 
      id,
      description: insertSpecialty.description || null
    };
    this.specialties.set(id, specialty);
    return specialty;
  }

  async getReviewsByCoachId(coachId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.coachId === coachId);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = { 
      ...insertReview, 
      id,
      createdAt: new Date()
    };
    this.reviews.set(id, review);
    return review;
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = randomUUID();
    const inquiry: Inquiry = { 
      ...insertInquiry, 
      id,
      createdAt: new Date()
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  // User operations for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Coach operations
  async getCoach(id: string): Promise<Coach | undefined> {
    const [coach] = await db.select().from(coaches).where(eq(coaches.id, id));
    return coach || undefined;
  }

  async getCoachBySlug(slug: string): Promise<Coach | undefined> {
    const [coach] = await db.select().from(coaches).where(eq(coaches.slug, slug));
    return coach || undefined;
  }

  async getCoaches(filters: {
    city?: string;
    specialties?: string[];
    minPrice?: number;
    maxPrice?: number;
    virtualOnly?: boolean;
    sortBy?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ coaches: Coach[]; total: number }> {
    let query = db.select().from(coaches);
    
    // Apply filters - implement the same logic as MemStorage
    const filteredCoaches = await query;
    
    // For now, return all coaches - will implement filtering later
    return {
      coaches: filteredCoaches,
      total: filteredCoaches.length
    };
  }

  async createCoach(coachData: InsertCoach): Promise<Coach> {
    const [coach] = await db.insert(coaches).values(coachData).returning();
    return coach;
  }

  async updateCoach(id: string, coachData: Partial<InsertCoach>): Promise<Coach | undefined> {
    const [coach] = await db
      .update(coaches)
      .set({ ...coachData, updatedAt: new Date() })
      .where(eq(coaches.id, id))
      .returning();
    return coach || undefined;
  }

  // Specialty operations
  async getSpecialties(): Promise<Specialty[]> {
    return await db.select().from(specialties);
  }

  async createSpecialty(specialtyData: InsertSpecialty): Promise<Specialty> {
    const [specialty] = await db.insert(specialties).values(specialtyData).returning();
    return specialty;
  }

  // Review operations
  async getReviewsByCoachId(coachId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.coachId, coachId));
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(reviewData).returning();
    return review;
  }

  // Inquiry operations
  async createInquiry(inquiryData: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await db.insert(inquiries).values(inquiryData).returning();
    return inquiry;
  }

  // Coach Application methods
  async createCoachApplication(applicationData: InsertCoachApplication): Promise<CoachApplication> {
    const [application] = await db.insert(coachApplications).values(applicationData).returning();
    return application;
  }

  async getCoachApplicationByUserId(userId: string): Promise<CoachApplication | undefined> {
    const [application] = await db.select().from(coachApplications).where(eq(coachApplications.userId, userId));
    return application || undefined;
  }

  async updateCoachApplicationStatus(id: string, status: "pending" | "approved" | "rejected"): Promise<CoachApplication | undefined> {
    const [application] = await db
      .update(coachApplications)
      .set({ status, updatedAt: new Date() })
      .where(eq(coachApplications.id, id))
      .returning();
    return application || undefined;
  }

  async getInquiries(): Promise<Inquiry[]> {
    const allInquiries = await db.select({
      id: inquiries.id,
      coachId: inquiries.coachId,
      name: inquiries.name,
      email: inquiries.email,
      message: inquiries.message,
      createdAt: inquiries.createdAt,
      coach: {
        slug: coaches.slug,
        headline: coaches.headline,
      }
    })
    .from(inquiries)
    .leftJoin(coaches, eq(inquiries.coachId, coaches.id))
    .orderBy(inquiries.createdAt);
    
    return allInquiries;
  }

  async getCoachApplications(): Promise<CoachApplication[]> {
    const applications = await db.select({
      id: coachApplications.id,
      userId: coachApplications.userId,
      status: coachApplications.status,
      headline: coachApplications.headline,
      bio: coachApplications.bio,
      experience: coachApplications.experience,
      certifications: coachApplications.certifications,
      pricePerHour: coachApplications.pricePerHour,
      virtualOnly: coachApplications.virtualOnly,
      specialties: coachApplications.specialties,
      location: coachApplications.location,
      address: coachApplications.address,
      latitude: coachApplications.latitude,
      longitude: coachApplications.longitude,
      profilePhoto: coachApplications.profilePhoto,
      additionalPhotos: coachApplications.additionalPhotos,
      instagramUrl: coachApplications.instagramUrl,
      websiteUrl: coachApplications.websiteUrl,
      adminNotes: coachApplications.adminNotes,
      createdAt: coachApplications.createdAt,
      user: {
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
      }
    })
    .from(coachApplications)
    .leftJoin(users, eq(coachApplications.userId, users.id))
    .orderBy(coachApplications.createdAt);
    
    return applications;
  }

  async updateCoachApplication(id: string, updates: Partial<InsertCoachApplication>): Promise<CoachApplication | undefined> {
    const [application] = await db.update(coachApplications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(coachApplications.id, id))
      .returning();
    return application;
  }

  async createCoachFromApplication(applicationId: string): Promise<Coach | undefined> {
    const [application] = await db.select().from(coachApplications).where(eq(coachApplications.id, applicationId));
    
    if (!application || application.status !== "approved") {
      return undefined;
    }

    const coachData = {
      userId: application.userId,
      slug: application.headline.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
      headline: application.headline,
      bio: application.bio,
      city: application.location || "Unknown",
      country: "USA",
      address: application.address,
      lat: application.latitude,
      lng: application.longitude,
      specialties: application.specialties || [],
      pricePerHour: application.pricePerHour,
      virtualOnly: application.virtualOnly || false,
      photos: application.profilePhoto ? [application.profilePhoto, ...(application.additionalPhotos || [])] : [],
    };

    const [coach] = await db.insert(coaches).values(coachData).returning();
    return coach;
  }

  async getClients(): Promise<User[]> {
    const clients = await db.select().from(users).where(eq(users.role, "USER"));
    return clients;
  }

  async deleteCoach(id: string): Promise<void> {
    await db.delete(coaches).where(eq(coaches.id, id));
  }

  async updateSpecialty(id: string, updates: Partial<InsertSpecialty>): Promise<Specialty | undefined> {
    const [specialty] = await db.update(specialties)
      .set(updates)
      .where(eq(specialties.id, id))
      .returning();
    return specialty;
  }

  async deleteSpecialty(id: string): Promise<void> {
    await db.delete(specialties).where(eq(specialties.id, id));
  }
}

// Use DatabaseStorage for production with coach applications
export const storage = new DatabaseStorage();
