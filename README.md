# File Scanner Application

## 🎥 Demo Video

[Watch the application demonstration](https://youtu.be/j2oGBOlSL_U)

A full-stack MERN (MongoDB, Express.js, React, Node.js) application that allows users to upload files and scan them for potentially dangerous content. The application uses a queue-based architecture for processing files asynchronously with a modern, responsive web interface.

## Tech Stack

### Backend

- **Node.js** with **TypeScript** - Runtime environment and programming language
- **Express.js** - Web application framework
- **MongoDB** with **Mongoose** - Database and ODM
- **BullMQ** - Redis-based queue for handling file scanning jobs
- **Multer** - Middleware for handling file uploads
- **CORS** - Cross-Origin Resource Sharing middleware

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - User interface library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **React Hot Toast** - Toast notifications
- **Next Themes** - Theme management

## Project Structure

```
├── cyberxplore-backend/
│   ├── index.ts                # Main application entry point
│   ├── models/
│   │   └── MetadataModel.ts   # MongoDB schema for file metadata
│   ├── queues/
│   │   └── fileQueue.ts       # BullMQ queue configuration
│   ├── routes/
│   │   ├── files.ts          # API routes for fetching files
│   │   └── upload.ts         # API routes for file upload
│   ├── uploads/              # Directory for stored files
│   └── workers/
│       └── fileWorker.ts     # Worker process for file scanning
├── cyberxplore-frontend/
│   ├── app/
│   │   ├── dashboard/        # Dashboard page and components
│   │   │   ├── components/   # Dashboard-specific components
│   │   │   ├── page.tsx     # Dashboard page
│   │   │   └── types.ts     # TypeScript interfaces
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout component
│   │   └── page.tsx         # File upload page
│   ├── components/
│   │   └── theme-provider.tsx # Theme context provider
│   ├── lib/                  # Utility functions
│   ├── public/              # Static assets
```

## Features

1. **File Upload System**

   - Drag and drop file upload interface
   - Supports PDF, DOCX, JPG, JPEG, and PNG files
   - 5MB file size limit
   - Real-time upload progress tracking
   - Automatic file naming with timestamps

2. **File Scanning System**

   - Asynchronous processing using BullMQ
   - Scans for dangerous keywords ("rm -rf", "eval", "bitcoin")
   - Progress tracking with job status updates
   - Webhook notifications for infected files (optional)

3. **Dashboard & File Management**

   - Modern, responsive dashboard interface
   - Real-time file status monitoring with auto-refresh
   - File filtering by status (all, pending, scanning, scanned)
   - Pagination for large file lists
   - Detailed file information modal
   - Statistics cards showing scan results
   - Toast notifications for status changes

4. **User Experience**
   - Modern UI with Tailwind CSS
   - Dark/Light theme support
   - Toast notifications for user feedback
   - Responsive design for all devices
   - Seamless navigation between upload and dashboard

## Prerequisites

- Node.js (Latest LTS version)
- MongoDB
- Redis Server
- TypeScript

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd CyberXplore Assignment
   ```

2. Install backend dependencies:

   ```bash
   cd cyberxplore-backend
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd cyberxplore-frontend
   npm install
   ```

4. Environment Setup:
   - Ensure MongoDB is running on localhost:27017 (or set MONGODB_URI env variable)
   - Ensure Redis is running on localhost:6379 (or set REDIS_HOST and REDIS_PORT env variable)
   - Optional: Set WEBHOOK_URL for malware notifications

## Running the Application

1. Start the backend services:

   ```bash
   cd cyberxplore-backend
   npm start
   ```

   This will start both the main server and the worker process using `concurrently`.

   - Main server will run on http://localhost:8000
   - File worker will process uploaded files asynchronously

2. Start the frontend development server:

   ```bash
   cd cyberxplore-frontend
   npm run dev
   ```

   The frontend will run on http://localhost:3000

## API Endpoints

1. **Upload File**

   - POST `/upload`
   - Accepts multipart form data with field name "file"
   - Returns file metadata including status

2. **List Files**
   - GET `/files`
   - Returns list of all uploaded files with their scan status

## Technical Details

### File Upload Flow

1. User uploads file through drag-and-drop or file selection interface
2. Frontend sends file to backend API endpoint
3. Multer middleware validates and stores file
4. File metadata is saved to MongoDB
5. File is queued for scanning using BullMQ
6. Worker processes file and updates status
7. Frontend receives real-time updates via polling

### File Scanning Process

1. Worker picks up file from queue
2. Reads file content
3. Checks for dangerous keywords ("rm -rf", "eval", "bitcoin")
4. Updates metadata with scan results
5. Sends webhook notification if file is infected (when configured)

### Frontend Architecture

- **Next.js App Router**: Modern routing with server components
- **Real-time Updates**: Auto-refresh dashboard every 5 seconds
- **State Management**: React hooks for component state
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Toast Notifications**: User feedback for all operations

### Queue Configuration

- Concurrent processing: 2 files
- Exponential backoff for failed jobs
- 3 retry attempts
- Keeps history of last 100 completed/failed jobs

## Package Dependencies

### Main Dependencies

#### Backend

- `express`: Web framework
- `mongoose`: MongoDB ODM
- `bullmq`: Redis-based queue
- `multer`: File upload handling
- `cors`: Cross-origin resource sharing
- `concurrently`: Run multiple commands concurrently

#### Frontend

- `next`: React framework with App Router
- `react`: User interface library
- `react-dom`: React DOM renderer
- `lucide-react`: Modern icon library
- `react-hot-toast`: Toast notifications
- `next-themes`: Theme management
- `tailwindcss`: Utility-first CSS framework
- `tailwindcss-animate`: Animation utilities

### Development Dependencies

- `typescript`: Programming language
- `@types/*`: TypeScript type definitions
- `postcss`: CSS post-processor
- `@types/node`: Node.js type definitions

## Error Handling

- File type validation (PDF, DOCX, JPG, JPEG, PNG only)
- File size limits (5MB maximum)
- Queue processing errors with retry mechanism
- MongoDB connection errors
- General API error handling with appropriate HTTP status codes
- Frontend error states with user-friendly messages
