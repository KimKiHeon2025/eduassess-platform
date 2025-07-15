# Educational Assessment Platform

## Overview

This is a full-stack educational assessment platform built with React, Express, TypeScript, and PostgreSQL. The application allows instructors to create questions, build assessments, and grade student submissions while providing students with an interface to take quizzes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **File Uploads**: Multer for handling image uploads
- **Session Management**: PostgreSQL-backed sessions

### Project Structure
- **Monorepo Layout**: Shared schema and types between client and server
- **Client**: React application in `/client` directory
- **Server**: Express API in `/server` directory  
- **Shared**: Common types and database schema in `/shared` directory

## Key Components

### Database Schema
The application uses five main entities:
- **Users**: Authentication and role-based access (instructor/student)
- **Questions**: Support for multiple-choice and descriptive questions with image attachments
- **Assessments**: Collections of questions with time limits and activation status
- **Submissions**: Student answers and grading status tracking
- **Grades**: Individual question scores and feedback

### Core Features
1. **Question Management**: Create, edit, and delete questions with image support
2. **Assessment Builder**: Compose assessments from existing questions
3. **Quiz Taking**: Student interface with timer and progress tracking
4. **Grading System**: Manual grading for descriptive questions with feedback
5. **File Upload**: Image handling for questions and answer options
6. **PDF Export**: Generate detailed exam result reports with correct/incorrect answers marked
7. **Analytics Dashboard**: Subject-wise performance analysis with charts and 100-point score conversion
8. **Dual Login System**: Separate authentication for students (name + birth date) and teachers (ID + password)
9. **Home Button Navigation**: Easy access to home page from all application sections

### Authentication & Authorization
- **Student Login**: 성명 + 생년월일 6자리 입력 방식
- **Teacher Login**: 특정 ID + 패스워드 방식 (admin/jhj0901, instructor/password123, teacher/teacher123)
- Role-based access control with different navigation menus
- Local storage based session management
- Route protection based on user roles

## Data Flow

### Question Creation Flow
1. Instructor creates question via form with optional images
2. Images uploaded to `/uploads` directory via Multer
3. Question data and image URLs stored in PostgreSQL
4. Real-time UI updates via TanStack Query cache invalidation

### Assessment Taking Flow
1. Student accesses quiz by assessment ID
2. Questions loaded and displayed with navigation
3. Answers stored in local state and periodically synced
4. Final submission creates record with timestamp and status
5. Automatic grading for multiple-choice questions

### Grading Workflow
1. Instructors view pending submissions
2. Manual grading interface for descriptive questions
3. Score calculation and feedback storage
4. Status updates reflected in real-time

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **react-hook-form**: Form state management
- **zod**: Runtime type validation
- **multer**: File upload handling
- **jspdf**: PDF generation for exam result reports
- **html2canvas**: HTML to canvas conversion for PDF export

### Development Tools
- **Vite**: Fast development server and bundling
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Server bundling for production

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- tsx for running TypeScript server with hot reload
- Shared development between client and server via proxy

### Production Build
- Vite builds frontend to `/dist/public`
- ESBuild bundles server to `/dist/index.js`
- Static file serving for uploaded images
- Database migrations via Drizzle Kit

### Environment Requirements
- Node.js runtime with ES module support
- PostgreSQL database (Neon serverless recommended)
- File system access for image uploads
- Environment variable for `DATABASE_URL`

### Scalability Considerations
- Serverless database connection pooling
- Static asset serving can be moved to CDN
- File uploads can be migrated to object storage
- Session storage uses efficient PostgreSQL backend

## Recent Updates (2025-07-11)

### Render Deployment Configuration (Latest Update)
- **Complete Deployment Package**: Full Render hosting setup with PostgreSQL database
- **Configuration Files**: render.yaml, .gitignore, LICENSE, comprehensive README.md
- **Deployment Guides**: Detailed step-by-step RENDER_DEPLOY.md and DEPLOYMENT_STEPS.md
- **GitHub Ready**: Repository structure optimized for GitHub and Render deployment
- **Free Hosting Solution**: Configured for Render's free tier with database support
- **Domain Options**: Free .onrender.com subdomain with custom domain upgrade path
- **Production Settings**: NODE_ENV production configuration and static file serving
- **Database Migration**: Automatic database schema deployment with npm run db:push
- **Deployment Status**: Port configuration fixed for Render compatibility (process.env.PORT)
- **Current Issue**: 502 Bad Gateway error persisting - requires complete file structure upload
- **Next Steps**: Complete GitHub repository setup with all missing files and dependencies

### Animated Onboarding Tutorial System Implementation
- **Interactive Tutorial Overlay**: Step-by-step guided tours with element highlighting and pulse animations
- **Tutorial Launcher Modal**: 3 comprehensive tutorial options (Teacher, Student, Accessibility)
- **Smart Element Targeting**: CSS selector-based highlighting with smooth scrolling and spotlight effects
- **Progress Tracking**: Local storage-based completion tracking and resumable sessions
- **Multi-Modal Learning**: Auto-advance, manual navigation, and interactive completion verification
- **Accessibility Integration**: Dedicated accessibility feature tutorial with high-contrast and font-size guides
- **User Type Detection**: Automatic tutorial recommendations based on user role (teacher/student)
- **Navigation Integration**: Tutorial launch buttons integrated into both teacher and student dashboards

### Gamification System Implementation
- **Complete Gamification Framework**: Points, levels, badges, achievements system
- **Progress Tracking**: Visual progress bars with level progression and streak counters
- **Badge Collection**: 4-tier rarity system (common, rare, epic, legendary) with earned/available states
- **Achievement System**: Category-based achievements with progress tracking and reward claiming
- **Animated Feedback**: Point gain animations and level-up celebrations using Framer Motion
- **Student Dashboard**: Dedicated gamified dashboard with all engagement features integrated
- **Database Schema**: Full gamification tables (user_stats, badges, achievements, point_history)

### PDF Analytics Reports
- Added comprehensive PDF report generation for analytics dashboard
- Includes charts, statistics, and subject-wise analysis
- Supports both individual subject and overall performance reports

### Responsive Web Design Implementation
- Mobile-first navigation with collapsible menus
- Responsive dashboard cards and statistics
- Optimized for mobile, tablet, and desktop viewing
- Enhanced touch-friendly interface elements

### Windows Deployment Package
- Created complete Windows installation package (eduassess-platform.tar.gz)
- Added Windows batch file (실행.bat) for one-click startup
- Comprehensive setup guide (WINDOWS_SETUP.md) with troubleshooting
- Korean language installation instructions (윈도우_설치방법.txt)

### Enhanced Documentation
- Complete README.md with feature overview and setup instructions
- System requirements and compatibility information
- Technical stack documentation
- User guide for both teachers and students

### Web Deployment Setup
- Added deployment configuration for public testing
- Created comprehensive TESTER_GUIDE.md for beta testing
- Configured download endpoints for Windows package distribution
- Ready for public URL deployment via Replit Deploy

### Comprehensive Demo Page
- Created full-featured demo page (/demo) showcasing all platform capabilities
- Interactive gamification system testing interface
- Complete accessibility feature demonstrations
- Test account information and guided testing workflow