import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertInquirySchema, insertCoachApplicationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);
  
  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get all coaches with optional filters
  app.get("/api/coaches", async (req, res) => {
    try {
      const { 
        city, 
        specialties, 
        minPrice, 
        maxPrice, 
        virtualOnly,
        sortBy,
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
      if (sortBy) filters.sortBy = sortBy as string;

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

  // Coach Application Routes
  app.post("/api/coach-applications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Check if user already has an application
      const existingApplication = await storage.getCoachApplicationByUserId(userId);
      if (existingApplication) {
        return res.status(400).json({ message: "You already have a coach application submitted." });
      }

      // Validate request data
      const validatedData = insertCoachApplicationSchema.parse({
        ...req.body,
        userId
      });

      const application = await storage.createCoachApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating coach application:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit application" });
    }
  });

  app.get("/api/coach-applications/me", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const application = await storage.getCoachApplicationByUserId(userId);
      
      if (!application) {
        return res.status(404).json({ message: "No application found" });
      }
      
      res.json(application);
    } catch (error) {
      console.error("Error fetching coach application:", error);
      res.status(500).json({ message: "Failed to fetch application" });
    }
  });

  // Admin routes
  app.get("/api/admin/applications", isAuthenticated, async (req, res) => {
    try {
      // In a real app, you'd check if user is admin
      const applications = await storage.getCoachApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.get("/api/admin/coaches", isAuthenticated, async (req, res) => {
    try {
      // In a real app, you'd check if user is admin
      const coaches = await storage.getCoaches({});
      res.json(coaches);
    } catch (error) {
      console.error("Error fetching coaches:", error);
      res.status(500).json({ message: "Failed to fetch coaches" });
    }
  });

  app.get("/api/admin/inquiries", isAuthenticated, async (req, res) => {
    try {
      // In a real app, you'd check if user is admin
      const inquiries = await storage.getInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.patch("/api/admin/applications/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;
      
      // In a real app, you'd check if user is admin
      const application = await storage.updateCoachApplication(id, { status, adminNotes });
      
      // If approved, create coach profile
      if (status === "approved") {
        await storage.createCoachFromApplication(id);
      }
      
      res.json(application);
    } catch (error) {
      console.error("Error updating application:", error);
      res.status(500).json({ message: "Failed to update application" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
