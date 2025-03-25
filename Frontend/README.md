# Learning Management System - Frontend

## Project Overview

A comprehensive Learning Management System built with React that enables students to enroll in courses and educators to create and manage educational content.

## Core Features

### Student Features

- Course enrollment through Stripe payment integration
- Video lecture player with progress tracking
- Course completion tracking
- Course rating system
- Responsive course content viewer

### Educator Features

- Course creation and management
- Student enrollment tracking
- Revenue dashboard
- Course analytics
- Student progress monitoring

## Technical Architecture

### Key Components

- **Player.jsx**: Video player component with progress tracking
- **Rating.jsx**: Star rating component for course feedback
- **Loading.jsx**: Loading state component
- **Footer.jsx**: Shared footer component

### Authentication & User Management

- Clerk integration for user authentication
- Role-based access (Student/Educator)
- Protected routes for enrolled courses

### State Management

- React Context API for global state
- AppContext for managing:
  - User data
  - Enrolled courses
  - Course progress
  - Authentication tokens

### API Integration

- Axios for API requests
- Endpoints for:
  - Course management
  - Progress tracking
  - Payments
  - Ratings

### Video Integration

- React Player for video playback
- Progress tracking
- Chapter/Lecture organization

## Getting Started

1. **Installation**

```bash
npm install
```

2. **Environment Setup**
   Create `.env` file with:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_BACKEND_URL=your_backend_url
```

3. **Development**

```bash
npm run dev
```

4. **Build**

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── student/
│   │   ├── Player.jsx
│   │   ├── Rating.jsx
│   │   └── Loading.jsx
│   └── educator/
├── context/
│   └── AppContext.jsx
├── pages/
│   ├── student/
│   └── educator/
├── assets/
└── routes/
```

## Dependencies

- React + Vite
- Clerk for authentication
- Axios for API calls
- React Player for video
- React Router for navigation
- TailwindCSS for styling
- React Toastify for notifications

## Additional Information

- Minimum Node.js version: 14.x
- Recommended IDE: VS Code
