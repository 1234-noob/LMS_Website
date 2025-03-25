# Learning Management System (LMS)

A full-stack web application for online course management and learning, built with React, Node.js, and MongoDB.

## 🚀 Features

### For Students

- Browse and enroll in courses
- Watch video lectures with progress tracking
- Rate and review courses
- Track course completion
- Secure payment integration with Stripe

### For Educators

- Create and manage courses
- Upload course content and videos
- Monitor student progress
- Track earnings and enrollments
- Access analytics dashboard

## 🛠️ Tech Stack

### Frontend

- React with Vite
- TailwindCSS for styling
- Clerk for authentication
- React Player for video playback
- Axios for API calls
- React Router for navigation

### Backend

- Node.js & Express
- MongoDB with Mongoose
- Cloudinary for image storage
- Stripe for payments
- Clerk for user management

## 🏗️ Project Structure

```
LMS_Website/
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── assets/
│   └── package.json
│
└── Backend/
    ├── configs/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    └── package.json
```

## 🚦 Getting Started

1. **Clone the Repository**

```bash
git clone <repository-url>
cd LMS_Website
```

2. **Set up Environment Variables**

Backend (.env):

```env
MONGO_URI=your_mongodb_uri
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CLERK_SECRET_KEY=your_clerk_secret
```

Frontend (.env):

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_BACKEND_URL=your_backend_url
```

3. **Install Dependencies & Start**

For Backend:

```bash
cd Backend
npm install
npm start
```

For Frontend:

```bash
cd Frontend
npm install
npm run dev
```

## 📝 API Documentation

Detailed API documentation is available in the [Backend README](./Backend/readme.md).

## 🔒 Security Features

- Role-based access control
- Secure payment processing
- Protected video content
- Input validation and sanitization

## 💡 Key Components

- **Course Player**: Interactive video player with progress tracking
- **Course Management**: Tools for creating and managing course content
- **Payment Integration**: Secure payment processing with Stripe
- **Analytics Dashboard**: Insights for educators
- **User Authentication**: Secure login and registration with Clerk

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
