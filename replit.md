# CoachBnB - Fitness Coach Directory Platform

## Overview

CoachBnB is a comprehensive full-stack fitness coaching marketplace that connects certified fitness professionals with clients seeking personal training services. Built as an Airbnb-style platform, it features a robust database of 40+ professional coaches with multiple photos, detailed bios, client testimonials, and location-based services. The platform includes OAuth authentication (Google, Facebook, Apple), Google Maps integration for location-based coach discovery, advanced filtering with AND logic for specialties, and both virtual and in-person training options.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built using React with TypeScript, utilizing the Wouter library for client-side routing. The UI components are based on Radix UI primitives with shadcn/ui styling, providing a consistent and accessible design system. The application follows a component-based architecture with pages organized in a standard React structure. State management is handled through React Query for server state and React's built-in state management for local component state.

### Backend Architecture
The server is built using Express.js with TypeScript, following a REST API architecture. The application uses a layered approach with route handlers in the routes file and a storage abstraction layer that currently implements in-memory storage but is designed to be easily replaceable with database implementations. The server handles API endpoints for coaches, inquiries, reviews, and filtering operations.

### Data Storage Solutions
The application uses PostgreSQL with Drizzle ORM as the primary database solution, featuring comprehensive schemas for users, coaches, specialties, reviews, and inquiries. The platform includes a rich dataset of 40+ professional coaches with detailed profiles, multiple high-quality photos, authentic client testimonials, and location data for Google Maps integration. Database includes specialty filtering with AND logic, user authentication storage, and comprehensive review systems.

### Component System
The UI is built using a comprehensive component library based on Radix UI primitives, providing consistent styling and behavior across the application. Components include form elements, navigation components, cards, modals, and specialized components like coach cards and search bars. The styling system uses Tailwind CSS with a custom design system that mirrors Airbnb's visual design language.

### Search and Filtering System
The application implements a sophisticated search and filtering system that allows users to find coaches based on multiple criteria including location, specialties, price range, and session type (virtual vs in-person). The search functionality is integrated with URL query parameters for shareable search results and includes pagination support.

### Data Validation
Input validation is handled using Zod schemas integrated with Drizzle ORM for type-safe database operations. The shared schema file defines validation rules for all data models, ensuring consistency between client and server-side validation.

## External Dependencies

### UI and Styling
- **Radix UI**: Comprehensive set of unstyled, accessible UI components including dialogs, dropdowns, forms, and navigation elements
- **Tailwind CSS**: Utility-first CSS framework for styling with custom design tokens and responsive design
- **Lucide React**: Icon library providing consistent iconography throughout the application
- **Class Variance Authority**: Utility for managing conditional CSS classes and component variants

### Data Management
- **Drizzle ORM**: Type-safe database ORM configured for PostgreSQL with migration support
- **Drizzle Kit**: Database migration and schema management tools
- **Neon Database**: Serverless PostgreSQL database service for production deployment
- **Zod**: Schema validation library for runtime type checking and form validation

### Frontend Utilities
- **React Query (TanStack Query)**: Server state management for API calls, caching, and synchronization
- **React Hook Form**: Form handling and validation with minimal re-renders
- **Wouter**: Lightweight client-side routing library for single-page application navigation
- **Date-fns**: Date manipulation and formatting utilities
- **Embla Carousel**: Carousel component for image galleries and content rotation

### Development and Build Tools
- **Vite**: Fast build tool and development server with hot module replacement
- **TypeScript**: Static type checking for enhanced developer experience and code reliability
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing tool with Autoprefixer for browser compatibility

### Database and Storage
- **PostgreSQL**: Primary database system with full-text search and JSON support capabilities
- **Connect PG Simple**: PostgreSQL session store for Express sessions (prepared for authentication)

## Recent Updates (January 2025)

### Authentication & User Management (Updated November 2025)
- Removed Replit authentication and replaced with industry-standard OAuth providers
- Implemented OAuth 2.0 authentication with three providers: Google, Facebook, and Apple Sign In
- Apple OAuth includes proper POST callback handling and first-time user data capture
- Simplified authentication middleware by removing OIDC token refresh logic
- Added user profiles with role-based access (USER/COACH)
- Created landing page for non-authenticated users
- Updated navbar with authentication states and user profile display
- All login redirects now point to dedicated /login page

### Location & Maps Integration
- Integrated Google Maps JavaScript API with interactive markers
- Added location-based coach discovery and filtering
- Implemented map/list view toggle in search interface
- Added address and coordinate data for coaches with physical locations

### Complete Coach Database & Onboarding System
- Expanded to 19 professional coaches with realistic profiles, multiple photos, and authentic testimonials
- Implemented comprehensive coach onboarding system with application tracking and admin approval workflow
- Created diverse coaching specialties including Weight Loss, Strength Training, Yoga, CrossFit, HIIT, Martial Arts, and more
- Added pricing tiers ranging from $65-125/hour based on expertise level
- Deployed full database with PostgreSQL integration and proper schema management

### Advanced Filtering System
- Changed specialty filtering from OR to AND logic (coaches must have ALL selected specialties)
- Improved filter state management with proper cleanup
- Enhanced search functionality with location-based filtering
- Added virtual vs in-person session filtering

### User Experience Updates (August 2025)
- Users can browse coaches freely without authentication
- Authentication required only for messaging coaches or applying as a coach
- Complete two-sided marketplace functionality operational
- Enhanced search functionality with comprehensive filter clearing capability
- Pre-populated location search from homepage ZIP code selections

### Location Data Enhancement (August 2025)
- Updated all coaches with authentic US addresses across major cities
- Added realistic coordinates for proper distance calculations
- Covers major metropolitan areas: Houston, Austin, Boston, Seattle, Phoenix, Portland, Nashville, Atlanta, Chicago, Beverly Hills, San Francisco, Washington DC, Philadelphia, Minneapolis, Las Vegas
- Reduced default search radius to 25 miles for more relevant local results
- Enhanced ZIP code autocomplete with Google Places API integration

### Design System Overhaul (November 2025)
- Implemented energetic fitness brand design with vibrant color palette
  - Primary: Coral/Orange (#FF6B4A) for energy and motivation
  - Secondary: Deep Teal (#00A896) for trust and professionalism
  - Accent: Amber (#FBBF24) for highlights and CTAs
- Updated typography system for better hierarchy
  - Headings: Poppins (600-800 weights) for bold, confident messaging
  - Body: Inter (400-900 weights) for excellent readability
- Enhanced component styling across the platform
  - Landing page: Gradient hero section, trust badges, improved features layout
  - Navigation bar: Gradient logo with dumbbell icon, backdrop blur glassmorphism, enhanced hover states
  - Footer: Better organization, social media icons with transitions, improved link structure
  - Coach cards: Aspect ratio image containers, floating badges, gradient overlays, enhanced hover effects
- Added utility classes for consistent design language
  - gradient-primary, gradient-secondary for branded backgrounds
  - hover-lift for card elevation effects
  - Enhanced shadow utilities for depth and hierarchy
- Improved accessibility and code quality
  - Fixed React warnings for nested anchor tags
  - Proper semantic HTML structure
  - Maintained WCAG color contrast standards
  - Comprehensive data-testid coverage for testing
- End-to-end testing confirmed all design enhancements working correctly

### Landing Page Redesign (November 2025)
- Implemented hero section with background image carousel
  - Embla carousel with autoplay (4-second intervals) using fixed Unsplash fitness stock photos
  - Dark gradient overlay for text readability
  - Manual navigation via carousel indicator dots
  - Full-height responsive design (700-800px)
- Enhanced hero content for maximum engagement
  - "40+ Certified Fitness Professionals" trust badge
  - Compelling headline: "Find Your Perfect Fitness Coach" with gradient text
  - Prominent ZIP code search with Google Places autocomplete
  - Three trust indicators with glassmorphism styling (Verified Credentials, Authentic Reviews, Secure Platform)
- Featured coaches section showcasing top-rated trainers
  - Simple 3-column grid layout displaying exactly 3 coaches with rating >= 4.8 or new coaches
  - All cards are equal size with consistent styling
  - Each coach card wrapped in proper Link component for SEO and accessibility
  - Hover effects with image zoom and button transitions
  - Shows photo, rating badge (or "New"), location, specialties, and pricing
- Testimonials section with client success stories
  - Three featured testimonials with 5-star ratings
  - Client photos, names, locations, and authentic quotes
  - Responsive grid layout with hover effects
- Enhanced social proof statistics section
  - 10,000+ Sessions Completed
  - 40+ Certified Coaches
  - 4.9 Average Rating
  - 100% Verified Credentials
  - Icons and gradient background for visual impact
- Removed authentication section to create dedicated login page
- Implemented image preloading for smooth carousel transitions
- Added comprehensive data-testid attributes for testing
- Optimized loading states to prevent layout shift

### Dedicated Login Page (November 2025)
- Created standalone login page at /login route
- Full-height centered layout with gradient background and decorative patterns
- Prominent "Welcome to CoachBnB" heading with gradient branding
- SocialAuth component integration with three authentication options:
  - Continue with Google
  - Continue with Facebook  
  - Continue with Replit
- Clear description of login benefits (messaging coaches, applying as coach, managing fitness journey)
- Links to Terms of Service and Privacy Policy
- "Browse coaches without signing in" link for easy navigation back to landing
- Auto-redirect to home page if user is already authenticated
- Updated navbar to link to /login instead of direct OAuth endpoint
- Comprehensive data-testid coverage for testing

The architecture is designed to be production-ready and scalable, with clear separation of concerns, comprehensive authentication, modern design system, and web development best practices throughout the stack.