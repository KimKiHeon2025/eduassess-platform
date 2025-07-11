#!/bin/bash

# Create a directory for the download package
mkdir -p /tmp/eduassess-platform

# Copy all the essential project files
cp -r client /tmp/eduassess-platform/
cp -r server /tmp/eduassess-platform/
cp -r shared /tmp/eduassess-platform/

# Copy configuration files
cp package.json /tmp/eduassess-platform/
cp vite.config.ts /tmp/eduassess-platform/
cp tsconfig.json /tmp/eduassess-platform/
cp tailwind.config.ts /tmp/eduassess-platform/
cp postcss.config.js /tmp/eduassess-platform/
cp components.json /tmp/eduassess-platform/
cp drizzle.config.ts /tmp/eduassess-platform/

# Copy documentation
cp replit.md /tmp/eduassess-platform/

# Create a README for the download
cat > /tmp/eduassess-platform/README.md << 'EOF'
# EduAssess Platform

An online assessment platform for creating and grading multiple-choice and descriptive questions with image support.

## Features

- **Question Management**: Create, edit, and delete questions with image support
- **Assessment Builder**: Compose assessments from existing questions
- **Quiz Taking**: Student interface with timer and progress tracking
- **Grading System**: Manual grading for descriptive questions with feedback
- **File Upload**: Image handling for questions and answer options

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5000`

## Project Structure

- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared TypeScript types and schemas
- `components.json` - UI component configuration
- `vite.config.ts` - Vite build configuration

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: In-memory storage (can be configured for PostgreSQL)
- **Build Tool**: Vite
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: TanStack Query (React Query)

## Default Login

- Username: instructor
- Password: password123
- Role: instructor

## Development

The application uses:
- Modern ES modules throughout
- TypeScript for type safety
- In-memory storage for development
- File uploads to local `/uploads` directory
- Auto-grading for multiple-choice questions
- Manual grading interface for descriptive questions

## Architecture

The application follows a full-stack TypeScript approach with:
- Shared schema definitions between frontend and backend
- Type-safe API calls using TanStack Query
- Component-based UI with shadcn/ui design system
- Material Design inspired styling
- Responsive layout for desktop and mobile

## License

MIT License
EOF

# Create the ZIP file
cd /tmp
zip -r eduassess-platform.zip eduassess-platform/

# Move it to the workspace
mv eduassess-platform.zip /home/runner/workspace/

echo "Download package created: eduassess-platform.zip"