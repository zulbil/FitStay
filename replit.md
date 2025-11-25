# CoachNearby - Fitness Coach Directory Platform

## Overview

CoachNearby is a comprehensive full-stack fitness coaching marketplace that connects certified fitness professionals with clients seeking personal training services. Built as an Airbnb-style platform, it features a robust database of 40+ professional coaches with multiple photos, detailed bios, client testimonials, and location-based services. The platform includes OAuth authentication (Google, Facebook, Apple), Google Maps integration for location-based coach discovery, advanced filtering with AND logic for specialties, and both virtual and in-person training options.

**Domain:** coachnearby.com

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

## Recent Updates (November 2025)

### Brand Update
- Rebranded from CoachBnB to CoachNearby
- Domain: coachnearby.com
- Updated all branding across the platform including logos, meta tags, and content

### Authentication & User Management
- OAuth 2.0 authentication with three providers: Google, Facebook, and Apple Sign In
- Traditional username/password authentication using passport-local strategy
- Password security: bcrypt hashing with 10 salt rounds
- Apple OAuth includes proper POST callback handling and first-time user data capture
- User profiles with role-based access (USER/COACH)
- Database schema includes username and password fields for local authentication
- Login page features tabbed interface for OAuth (Quick Sign In) and traditional (Email & Password) authentication
  - Flattened UI structure with button toggles for Login/Signup to avoid nested Tabs accessibility issues
  - All elements fully testable with Playwright
- Form validation using Zod schemas with client-side error display
- React Query mutations for signup/login with proper session management and cache invalidation
- Navbar dropdown menu for authenticated users
- Created landing page for non-authenticated users
- All login redirects now point to dedicated /login page

### Location & Maps Integration
- Integrated Google Maps JavaScript API with interactive markers
- Added location-based coach discovery and filtering
- Implemented map/list view toggle in search interface
- Added address and coordinate data for coaches with physical locations

### Complete Coach Database & Onboarding System
- 19 professional coaches with realistic profiles, multiple photos, and authentic testimonials
- Comprehensive coach onboarding system with application tracking and admin approval workflow
- Diverse coaching specialties including Weight Loss, Strength Training, Yoga, CrossFit, HIIT, Martial Arts, and more
- Pricing tiers ranging from $65-125/hour based on expertise level
- Full database with PostgreSQL integration and proper schema management

### Advanced Filtering System
- Specialty filtering with AND logic (coaches must have ALL selected specialties)
- Improved filter state management with proper cleanup
- Enhanced search functionality with location-based filtering
- Virtual vs in-person session filtering

### Design System
- Energetic fitness brand design with vibrant color palette
  - Primary: Coral/Orange (#FF6B4A) for energy and motivation
  - Secondary: Deep Teal (#00A896) for trust and professionalism
  - Accent: Amber (#FBBF24) for highlights and CTAs
- Typography system: Poppins for headings, Inter for body text
- Enhanced component styling across the platform
- Utility classes: gradient-primary, gradient-secondary, hover-lift

### Landing Page
- Hero section with background image carousel
- Featured coaches section showcasing top-rated trainers
- Testimonials section with client success stories
- Social proof statistics section

### Dedicated Login Page
- Standalone login page at /login route
- Full-height centered layout with gradient background
- SocialAuth component integration with three authentication options
- Auto-redirect to home page if user is already authenticated

The architecture is designed to be production-ready and scalable, with clear separation of concerns, comprehensive authentication, modern design system, and web development best practices throughout the stack.
