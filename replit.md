# Attendance Tracker App

## Overview

This is a mobile-first attendance tracking application built with React, TypeScript, and Tailwind CSS. The app helps users track their attendance for various subjects/classes with features like schedule management, daily attendance marking, statistics visualization, and browser notifications. The application uses local storage for data persistence and provides a clean, intuitive interface for managing academic attendance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety and modern component patterns
- **Vite** as the build tool for fast development and optimized production builds
- **Tailwind CSS** for utility-first styling with a custom design system
- **shadcn/ui** component library for consistent, accessible UI components
- **Wouter** for lightweight client-side routing
- **TanStack Query** for state management and data fetching patterns

### State Management
- **Custom React Hooks** for business logic encapsulation (`useAttendance`, `useNotifications`)
- **Local Storage** as the primary data persistence layer with automatic synchronization
- **React Query** for caching and server state management (prepared for future API integration)

### Data Layer
- **Zod schemas** for runtime type validation and data modeling
- **In-memory storage interface** with abstract storage patterns for easy database migration
- **Drizzle ORM** configured for PostgreSQL (ready for server-side implementation)

### UI/UX Design
- **Mobile-first responsive design** optimized for smartphone usage
- **Tab-based navigation** with three main screens: Setup, Daily, and Stats
- **Progressive Web App** capabilities through service worker integration
- **Dark/light mode support** through CSS custom properties

### Component Architecture
- **Atomic design principles** with reusable UI components
- **Compound component patterns** for complex UI elements like forms and modals
- **Custom hooks** for business logic separation and reusability
- **TypeScript interfaces** for prop validation and component contracts

### Development Tools
- **ESBuild** for server-side bundling and Node.js compatibility
- **PostCSS** with Autoprefixer for CSS processing
- **TypeScript strict mode** for enhanced type checking
- **Hot Module Replacement** for development efficiency

## External Dependencies

### Core Frontend Libraries
- **React 18** - Modern UI library with concurrent features
- **Vite** - Fast build tool and development server
- **TypeScript** - Static type checking for JavaScript

### UI Framework
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless component primitives for accessibility
- **Lucide React** - Icon library for consistent iconography
- **shadcn/ui** - Pre-built accessible components

### State & Data Management
- **TanStack React Query** - Server state management and caching
- **Zod** - Schema validation and type inference
- **nanoid** - Unique ID generation for client-side records

### Database & ORM (Prepared)
- **Drizzle ORM** - Type-safe SQL ORM for PostgreSQL
- **Neon Database** - Serverless PostgreSQL for cloud deployment
- **Drizzle Kit** - Database migration and schema management

### Development & Build Tools
- **Vite plugins** - React support and development enhancements
- **esbuild** - Fast JavaScript bundler for production
- **PostCSS** - CSS processing and optimization

### Utilities
- **date-fns** - Date manipulation and formatting
- **clsx** - Conditional className utility
- **class-variance-authority** - Component variant management

### Notifications & PWA
- **Browser Notification API** - Native push notifications
- **Service Worker** - Offline functionality and caching
- **Web App Manifest** - Progressive Web App capabilities