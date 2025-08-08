import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, real, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User table with Replit Auth support
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  name: text("name"), // Keep for compatibility
  role: text("role").notNull().default("USER"), // USER | COACH | ADMIN
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const coaches = pgTable("coaches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  slug: text("slug").notNull().unique(),
  headline: text("headline").notNull(),
  bio: text("bio").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull().default("CA"), // US State (e.g., "CA", "NY")
  zipCode: text("zip_code").notNull().default("90210"), // US ZIP code (e.g., "90210", "10001")
  country: text("country").notNull().default("US"),
  address: text("address"), // Full street address
  fullAddress: text("full_address"), // Complete formatted address
  lat: real("lat"),
  lng: real("lng"),
  specialties: text("specialties").array().notNull().default([]),
  pricePerHour: integer("price_per_hour").notNull(),
  virtualOnly: boolean("virtual_only").default(false),
  ratingAvg: real("rating_avg").default(0),
  ratingCount: integer("rating_count").default(0),
  photos: text("photos").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const specialties = pgTable("specialties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  coachId: varchar("coach_id").notNull().references(() => coaches.id),
  author: text("author").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  coachId: varchar("coach_id").notNull().references(() => coaches.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ZIP code locations table for search functionality
export const zipCodes = pgTable("zip_codes", {
  zipCode: text("zip_code").primaryKey(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  stateCode: text("state_code").notNull(), // e.g., "CA", "NY"
  county: text("county"),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
});

export const coachApplications = pgTable("coach_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  status: varchar("status", { enum: ["pending", "approved", "rejected"] }).default("pending"),
  
  // Basic Info
  headline: varchar("headline").notNull(),
  bio: text("bio").notNull(),
  experience: text("experience").notNull(),
  certifications: text("certifications").array().default([]),
  
  // Pricing & Services  
  pricePerHour: integer("price_per_hour").notNull(),
  virtualOnly: boolean("virtual_only").default(false),
  specialties: varchar("specialties").array().default([]),
  
  // Location - Updated for US addresses
  city: text("city").notNull().default("TBD"),
  state: text("state").notNull().default("CA"),
  zipCode: text("zip_code").notNull().default("90210"),
  address: text("address"), // Street address
  fullAddress: text("full_address"), // Complete formatted address
  location: varchar("location"), // Legacy field for display compatibility
  latitude: real("latitude"),
  longitude: real("longitude"),
  
  // Profile Photos (URLs)
  profilePhoto: varchar("profile_photo"),
  additionalPhotos: varchar("additional_photos").array().default([]),
  
  // Social Media
  instagramUrl: varchar("instagram_url"),
  websiteUrl: varchar("website_url"),
  
  // Admin Notes
  adminNotes: text("admin_notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCoachSchema = createInsertSchema(coaches).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSpecialtySchema = createInsertSchema(specialties).omit({
  id: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
});

export const insertCoachApplicationSchema = createInsertSchema(coachApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;

export type Coach = typeof coaches.$inferSelect;
export type InsertCoach = z.infer<typeof insertCoachSchema>;

export type Specialty = typeof specialties.$inferSelect;
export type InsertSpecialty = z.infer<typeof insertSpecialtySchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

export type CoachApplication = typeof coachApplications.$inferSelect;
export type InsertCoachApplication = z.infer<typeof insertCoachApplicationSchema>;
