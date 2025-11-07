import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
// @ts-ignore - passport-apple doesn't have TypeScript definitions
import { Strategy as AppleStrategy } from "passport-apple";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}

async function upsertUser(
  claims: any,
  provider: string
) {
  // Generate a unique ID based on provider and external ID
  const userId = `${provider}_${claims["sub"] || claims["id"]}`;
  
  await storage.upsertUser({
    id: userId,
    email: claims["email"],
    firstName: claims["first_name"] || claims["given_name"] || claims["name"]?.split(' ')[0],
    lastName: claims["last_name"] || claims["family_name"] || claims["name"]?.split(' ')[1],
    profileImageUrl: claims["profile_image_url"] || claims["picture"],
    provider: provider,
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const user = {
          claims: {
            sub: profile.id,
            email: profile.emails?.[0]?.value,
            given_name: profile.name?.givenName,
            family_name: profile.name?.familyName,
            picture: profile.photos?.[0]?.value,
          },
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        };
        await upsertUser(user.claims, "google");
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }));
  }

  // Facebook OAuth Strategy
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ['id', 'emails', 'name', 'picture']
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const user = {
          claims: {
            sub: profile.id,
            email: profile.emails?.[0]?.value,
            given_name: profile.name?.givenName,
            family_name: profile.name?.familyName,
            picture: profile.photos?.[0]?.value,
          },
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        };
        await upsertUser(user.claims, "facebook");
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }));
  }

  // Apple OAuth Strategy
  if (process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_CLIENT_ID && process.env.APPLE_PRIVATE_KEY) {
    passport.use(new AppleStrategy({
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      privateKeyString: process.env.APPLE_PRIVATE_KEY,
      callbackURL: "/api/auth/apple/callback",
      passReqToCallback: true
    }, async (req: any, accessToken: any, refreshToken: any, idToken: any, profile: any, done: any) => {
      try {
        // Apple sends user info only on first login in req.body.user
        const firstTimeUser = req.body.user ? JSON.parse(req.body.user) : null;
        
        const user = {
          claims: {
            sub: profile.id || profile.sub,
            email: profile.email,
            given_name: firstTimeUser?.name?.firstName,
            family_name: firstTimeUser?.name?.lastName,
          },
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        };
        await upsertUser(user.claims, "apple");
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }));
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  // Google OAuth routes
  app.get("/api/auth/google", 
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get("/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/");
    }
  );

  // Facebook OAuth routes
  app.get("/api/auth/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
  );

  app.get("/api/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/");
    }
  );

  // Apple OAuth routes  
  app.get("/api/auth/apple",
    passport.authenticate("apple", { scope: ["email", "name"] })
  );

  // Note: Apple uses POST for callback, not GET
  app.post("/api/auth/apple/callback",
    passport.authenticate("apple", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/");
    }
  );

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return next();
};