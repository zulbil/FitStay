import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all coaches with optional filters
  app.get("/api/coaches", async (req, res) => {
    try {
      const { 
        city, 
        specialties, 
        minPrice, 
        maxPrice, 
        virtualOnly, 
        limit = "20", 
        offset = "0" 
      } = req.query;

      const filters: any = {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      };

      if (city) filters.city = city as string;
      if (specialties) {
        filters.specialties = Array.isArray(specialties) 
          ? specialties as string[] 
          : [specialties as string];
      }
      if (minPrice) filters.minPrice = parseInt(minPrice as string);
      if (maxPrice) filters.maxPrice = parseInt(maxPrice as string);
      if (virtualOnly) filters.virtualOnly = virtualOnly === 'true';

      const result = await storage.getCoaches(filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch coaches" });
    }
  });

  // Get coach by slug
  app.get("/api/coaches/:slug", async (req, res) => {
    try {
      const coach = await storage.getCoachBySlug(req.params.slug);
      if (!coach) {
        return res.status(404).json({ message: "Coach not found" });
      }
      res.json(coach);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch coach" });
    }
  });

  // Get reviews for a coach
  app.get("/api/coaches/:slug/reviews", async (req, res) => {
    try {
      const coach = await storage.getCoachBySlug(req.params.slug);
      if (!coach) {
        return res.status(404).json({ message: "Coach not found" });
      }
      
      const reviews = await storage.getReviewsByCoachId(coach.id);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Get all specialties
  app.get("/api/specialties", async (req, res) => {
    try {
      const specialties = await storage.getSpecialties();
      res.json(specialties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch specialties" });
    }
  });

  // Create inquiry
  app.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);
      
      // Log inquiry for demo purposes (replace with actual email service)
      console.log("New inquiry received:", inquiry);
      
      res.status(201).json(inquiry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid inquiry data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
