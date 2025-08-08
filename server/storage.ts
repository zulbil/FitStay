import { type User, type InsertUser, type Coach, type InsertCoach, type Specialty, type InsertSpecialty, type Review, type InsertReview, type Inquiry, type InsertInquiry } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Coaches
  getCoach(id: string): Promise<Coach | undefined>;
  getCoachBySlug(slug: string): Promise<Coach | undefined>;
  getCoaches(filters?: {
    city?: string;
    specialties?: string[];
    minPrice?: number;
    maxPrice?: number;
    virtualOnly?: boolean;
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

    // Seed coaches
    const coachData = [
      {
        slug: "sarah-chen",
        headline: "Certified Weight Loss Specialist",
        bio: "Hi! I'm Sarah, a certified personal trainer with over 8 years of experience helping clients achieve their fitness goals. I specialize in weight loss, HIIT workouts, and building sustainable healthy habits.",
        city: "San Francisco",
        country: "USA",
        specialties: ["Weight Loss", "HIIT"],
        pricePerHour: 65,
        virtualOnly: false,
        ratingAvg: 4.9,
        ratingCount: 127,
        photos: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"]
      },
      {
        slug: "marcus-johnson",
        headline: "Strength Training Expert",
        bio: "Professional strength coach with 10+ years experience. Specializing in powerlifting, muscle building, and athletic performance. Let's build your strongest self together.",
        city: "Austin",
        country: "USA",
        specialties: ["Strength Training", "Powerlifting"],
        pricePerHour: 75,
        virtualOnly: false,
        ratingAvg: 4.8,
        ratingCount: 89,
        photos: ["https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop"]
      },
      {
        slug: "elena-rodriguez",
        headline: "Yoga & Mindfulness Instructor",
        bio: "Certified yoga instructor passionate about helping clients find balance through movement and mindfulness. Specializing in Hatha, Vinyasa, and meditation practices.",
        city: "Denver",
        country: "USA",
        specialties: ["Yoga", "Meditation"],
        pricePerHour: 55,
        virtualOnly: false,
        ratingAvg: 5.0,
        ratingCount: 156,
        photos: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop"]
      },
      {
        slug: "david-park",
        headline: "Nutrition & Wellness Coach",
        bio: "Registered dietitian and nutrition coach helping clients develop sustainable eating habits. Specializing in meal planning, sports nutrition, and metabolic health.",
        city: "Seattle",
        country: "USA",
        specialties: ["Nutrition"],
        pricePerHour: 45,
        virtualOnly: true,
        ratingAvg: 4.7,
        ratingCount: 203,
        photos: ["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"]
      },
      {
        slug: "jamie-fitness",
        headline: "HIIT & Cardio Specialist",
        bio: "High-energy fitness trainer specializing in HIIT workouts and cardio conditioning. Perfect for busy professionals looking for efficient, effective workouts.",
        city: "Miami",
        country: "USA",
        specialties: ["HIIT", "Weight Loss"],
        pricePerHour: 60,
        virtualOnly: true,
        ratingAvg: 4.9,
        ratingCount: 145,
        photos: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"]
      },
      {
        slug: "alex-mobility",
        headline: "Mobility & Recovery Coach",
        bio: "Movement specialist focused on mobility training, injury prevention, and recovery. Helping athletes and everyday people move better and feel stronger.",
        city: "Portland",
        country: "USA",
        specialties: ["Mobility", "Sports Performance"],
        pricePerHour: 70,
        virtualOnly: false,
        ratingAvg: 4.8,
        ratingCount: 92,
        photos: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop"]
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
        lat: null,
        lng: null,
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

      // Add some reviews
      const reviewData = [
        {
          author: "Michael Johnson",
          rating: 5,
          comment: "Sarah is absolutely amazing! She helped me lose 25 pounds in 4 months and completely changed my relationship with fitness."
        },
        {
          author: "Amanda Liu", 
          rating: 5,
          comment: "Best investment I've made for my health! Sarah's expertise in HIIT training has improved my endurance significantly."
        }
      ];

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

  async getCoach(id: string): Promise<Coach | undefined> {
    return this.coaches.get(id);
  }

  async getCoachBySlug(slug: string): Promise<Coach | undefined> {
    return Array.from(this.coaches.values()).find(coach => coach.slug === slug);
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
    let coaches = Array.from(this.coaches.values());

    // Apply filters
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

export const storage = new MemStorage();
