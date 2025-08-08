# CoachBnB - Fitness Coach Directory Platform

## Overview

CoachBnB is a comprehensive full-stack fitness coaching marketplace that connects certified fitness professionals with clients seeking personal training services. Built as an Airbnb-style platform, it features a robust database of 40+ professional coaches with multiple photos, detailed bios, client testimonials, and location-based services. The platform includes Replit authentication, Google Maps integration for location-based coach discovery, advanced filtering with AND logic for specialties, and both virtual and in-person training options.

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

### Authentication & User Management
- Implemented complete Replit authentication system with session management
- Added user profiles with role-based access (USER/COACH)
- Created landing page for non-authenticated users
- Updated navbar with authentication states and user profile display

### Location & Maps Integration
- Integrated Google Maps JavaScript API with interactive markers
- Added location-based coach discovery and filtering
- Implemented map/list view toggle in search interface
- Added address and coordinate data for 30+ coaches with physical locations

### Enhanced Coach Database
- Expanded from 6 to 40+ professional coaches with diverse specialties
- Added multiple high-quality photos (2-3 per coach) for visual appeal
- Created comprehensive coach bios with certifications and experience
- Implemented authentic client testimonials and review system
- Added pricing tiers ranging from $65-125/hour based on expertise level

### Advanced Filtering System
- Changed specialty filtering from OR to AND logic (coaches must have ALL selected specialties)
- Improved filter state management with proper cleanup
- Enhanced search functionality with location-based filtering
- Added virtual vs in-person session filtering

The architecture is designed to be production-ready and scalable, with clear separation of concerns, comprehensive authentication, and modern web development best practices throughout the stack.