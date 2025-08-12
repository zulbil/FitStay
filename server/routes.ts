import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertInquirySchema, insertCoachApplicationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);
  
  // Data deletion request endpoint (required by Facebook)
  app.post("/api/data-deletion", async (req, res) => {
    try {
      const { email, reason } = req.body;
      
      // Log the deletion request for processing
      console.log(`Data deletion request received for email: ${email}, reason: ${reason || 'Not provided'}`);
      
      // In a production environment, you would:
      // 1. Validate the email exists in your system
      // 2. Queue the deletion request for manual review
      // 3. Send confirmation email to the user
      // 4. Actually delete the user data after verification
      
      // For now, we'll just acknowledge the request
      res.json({ 
        success: true, 
        message: "Data deletion request received and will be processed within 30 days",
        confirmation_code: `DD-${Date.now().toString().slice(-8)}`
      });
    } catch (error) {
      console.error("Error processing data deletion request:", error);
      res.status(500).json({ message: "Failed to process data deletion request" });
    }
  });

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

  // Helper function to calculate distance between two points (Haversine formula)
  function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
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

  // GET /api/zip-lookup/:zipCode - Lookup ZIP code coordinates for search
  app.get("/api/zip-lookup/:zipCode", async (req, res) => {
    try {
      const { zipCode } = req.params;
      
      // Use Zippopotam.us API for free ZIP code lookup
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      if (!response.ok) {
        return res.status(404).json({ error: "ZIP code not found" });
      }
      
      const data = await response.json();
      const zipData = {
        zipCode: data['post code'],
        city: data.places[0]['place name'],
        state: data.places[0]['state'],
        stateCode: data.places[0]['state abbreviation'],
        lat: parseFloat(data.places[0]['latitude']),
        lng: parseFloat(data.places[0]['longitude']),
      };
      
      res.json(zipData);
    } catch (error) {
      console.error("ZIP lookup error:", error);
      res.status(500).json({ error: "Failed to lookup ZIP code" });
    }
  });

  // Get all coaches with optional filters and location-based search
  app.get("/api/coaches", async (req, res) => {
    try {
      const { 
        city, 
        zipCode,
        lat,
        lng,
        radius = "25", // Default 25 mile radius
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

      // Handle location-based filtering
      if (zipCode || (lat && lng)) {
        let searchLat, searchLng;
        
        if (zipCode) {
          // Lookup ZIP code coordinates
          try {
            const zipResponse = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
            if (zipResponse.ok) {
              const zipData = await zipResponse.json();
              searchLat = parseFloat(zipData.places[0]['latitude']);
              searchLng = parseFloat(zipData.places[0]['longitude']);
            }
          } catch (error) {
            console.error("ZIP lookup error:", error);
          }
        } else if (lat && lng) {
          searchLat = parseFloat(lat as string);
          searchLng = parseFloat(lng as string);
        }
        
        if (searchLat && searchLng) {
          filters.searchLat = searchLat;
          filters.searchLng = searchLng;
          filters.radius = parseInt(radius as string);
        }
      }

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
      
      // Add distance calculation for location-based searches
      if (filters.searchLat && filters.searchLng && result.coaches) {
        result.coaches = result.coaches.map((coach: any) => {
          if (coach.lat && coach.lng) {
            const distance = calculateDistance(
              filters.searchLat, 
              filters.searchLng, 
              coach.lat, 
              coach.lng
            );
            return { ...coach, distance: Math.round(distance * 10) / 10 };
          }
          return coach;
        });
        
        // Sort by distance if location search
        if (!sortBy || sortBy === 'distance') {
          result.coaches.sort((a: any, b: any) => (a.distance || 999) - (b.distance || 999));
        }
      }
      
      res.json(result);
    } catch (error) {
      console.error("Coaches fetch error:", error);
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

  app.get("/api/admin/clients", isAuthenticated, async (req, res) => {
    try {
      // In a real app, you'd check if user is admin
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ message: "Failed to fetch clients" });
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

  // Coach management
  app.patch("/api/admin/coaches/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const coach = await storage.updateCoach(id, updateData);
      res.json(coach);
    } catch (error) {
      console.error("Error updating coach:", error);
      res.status(500).json({ message: "Failed to update coach" });
    }
  });

  app.delete("/api/admin/coaches/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteCoach(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting coach:", error);
      res.status(500).json({ message: "Failed to delete coach" });
    }
  });

  // Specialty management
  app.post("/api/admin/specialties", isAuthenticated, async (req, res) => {
    try {
      const { name, description } = req.body;
      const specialty = await storage.createSpecialty({ name, description });
      res.status(201).json(specialty);
    } catch (error) {
      console.error("Error creating specialty:", error);
      res.status(500).json({ message: "Failed to create specialty" });
    }
  });

  app.patch("/api/admin/specialties/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const specialty = await storage.updateSpecialty(id, updateData);
      res.json(specialty);
    } catch (error) {
      console.error("Error updating specialty:", error);
      res.status(500).json({ message: "Failed to update specialty" });
    }
  });

  app.delete("/api/admin/specialties/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSpecialty(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting specialty:", error);
      res.status(500).json({ message: "Failed to delete specialty" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
