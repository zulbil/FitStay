# CoachBnB - Fitness Coach Directory Platform

## Overview

CoachBnB is a full-stack web application that connects fitness professionals with clients seeking personal training services. Built as an Airbnb-style marketplace, the platform allows users to search and book fitness coaches based on location, specialty, and preferences, while enabling coaches to showcase their services and connect with potential clients. The application features a modern, responsive design with comprehensive search and filtering capabilities, user profiles, reviews, and inquiry systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built using React with TypeScript, utilizing the Wouter library for client-side routing. The UI components are based on Radix UI primitives with shadcn/ui styling, providing a consistent and accessible design system. The application follows a component-based architecture with pages organized in a standard React structure. State management is handled through React Query for server state and React's built-in state management for local component state.

### Backend Architecture
The server is built using Express.js with TypeScript, following a REST API architecture. The application uses a layered approach with route handlers in the routes file and a storage abstraction layer that currently implements in-memory storage but is designed to be easily replaceable with database implementations. The server handles API endpoints for coaches, inquiries, reviews, and filtering operations.

### Data Storage Solutions
The application uses Drizzle ORM configured for PostgreSQL as the primary database solution, with schemas defined for users, coaches, specialties, reviews, and inquiries. Currently, a memory-based storage implementation is used for development, but the architecture supports easy migration to PostgreSQL production databases. The database schema supports complex relationships between users and coaches, specialty categorization, and review/inquiry systems.

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

The architecture is designed to be production-ready and scalable, with clear separation of concerns and modern web development best practices throughout the stack.