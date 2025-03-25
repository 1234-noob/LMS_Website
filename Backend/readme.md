# API Documentation

This document explains every endpoint available in the backend API.

## Table of Contents

- [User API (/api/user)](#user-api)
- [Educator API (/api/educator)](#educator-api)
- [Course API (/api/course)](#course-api)
- [Clerk & Stripe Webhook API (/clerk and /stripe)](#clerk--stripe-webhook-api)
- [Configuration Files](#configuration-files)

---

## User API (/api/user)

Endpoints under this route manage user-related functionalities.

- **GET /data**  
  _Description:_ Retrieves the current user's information from the database.  
  _Usage:_ Use this endpoint to fetch user profile data including name, email, image, and enrolled courses.  
  **Success Response:**

  ```json
  {
    "success": true,
    "user": {
      "_id": "<userId>",
      "name": "John Doe",
      "email": "john@example.com",
      "imageUrl": "http://example.com/image.jpg",
      "enrolledCourses": [ ... ]
    }
  }
  ```

  **Error Response:**

  ```json
  {
    "success": false,
    "message": "User not found"
  }
  ```

- **GET /enrolled-courses**  
  _Description:_ Retrieves the list of courses in which the user is enrolled.  
  _Usage:_ Useful for displaying a user's purchased or ongoing courses.  
  **Success Response:**

  ```json
  {
    "success": true,
    "enrolledCourese": [
      { "_id": "courseId", "courseTitle": "Course 101", ... }
    ]
  }
  ```

  **Error Response:**

  ```json
  {
    "success": false,
    "message": "Error message"
  }
  ```

- **POST /purchase**  
  _Description:_ Initiates the purchase process for a course by creating a Stripe checkout session.  
  _Payload:_ Expects a JSON object with the `courseId`.  
  _Usage:_ Customers call this when they decide to buy a course.  
  **Success Response:**

  ```json
  {
    "success": true,
    "session_url": "https://stripe.com/checkout/session/..."
  }
  ```

  **Error Response:**

  ```json
  {
    "success": false,
    "message": "User or course not found"
  }
  ```

- **POST /update-course-progress**  
  _Description:_ Records that a particular lecture within a course has been completed by the user.  
  _Payload:_ Requires `courseId` and `lectureId`.  
  _Usage:_ Triggered when a user completes a lecture, updating their course progress status.  
  **Success Response:**

  ```json
  {
    "success": true,
    "message": "Progress updated"
  }
  ```

  **Error Response:**

  ```json
  {
    "success": false,
    "message": "Error message"
  }
  ```

- **POST /get-course-progress**  
  _Description:_ Retrieves the progress data of a specific course for the user.  
  _Payload:_ Expects a JSON object with the `courseId`.  
  _Usage:_ Useful for displaying which lectures have been completed by the user.  
  **Success Response:**

  ```json
  {
    "success": true,
    "message": "Progress found",
    "progressData": [ ... ]
  }
  ```

  **Error Response:**

  ```json
  {
    "success": false,
    "message": "Progress not found"
  }
  ```

- **POST /add-rating**  
  _Description:_ Allows the user to add or update their rating for a course they are enrolled in.  
  _Payload:_ Requires `courseId` and a rating value between 1 and 5.  
  _Usage:_ Helps in collecting feedback on courses.  
  **Success Response:**
  ```json
  {
    "success": true,
    "message": "Rating added"
  }
  ```
  **Error Response:**
  ```json
  {
    "success": false,
    "message": "Invalid details"
  }
  ```

---

## Educator API (/api/educator)

Endpoints here let educators manage courses and view related data.

- **GET /update-role**  
  _Description:_ Changes the current user's role to educator.  
  _Usage:_ Called when a user wants to switch to an educator account.  
  **Success Response:**

  ```json
  {
    "success": true,
    "message": "Role updated to educator"
  }
  ```

  **Error Response:**

  ```json
  {
    "success": false,
    "message": "Unauthorized Access"
  }
  ```

- **POST /add-course**  
  _Description:_ Allows an educator to add a new course.  
  _Payload:_ Uses form-data that includes `courseData` (JSON string with course details) and an `image` file for the thumbnail.  
  _Usage:_ Educators call this to create a new course offering.  
  **Success Response:**

  ```json
  {
    "newCourse": { "courseTitle": "New Course", ... },
    "success": true,
    "message": "Course Added"
  }
  ```

  **Error Response:**

  ```json
  {
    "success": false,
    "message": "Thumbnail not attached"
  }
  ```

- **GET /courses**  
  _Description:_ Retrieves all courses created by the educator.  
  _Usage:_ Helps educators see the list of courses they manage.  
  **Success Response:**

  ```json
  {
    "success": true,
    "message": "Educator courses found",
    "educatorCourses": [ ... ]
  }
  ```

  **Error Response:**

  ```json
  {
    "success": false,
    "message": "Error message"
  }
  ```

- **GET /dashboard**  
  _Description:_ Provides dashboard data for educators including total courses, total earnings, and details of enrolled students per course.  
  _Usage:_ Useful as an overview for an educator's performance and student engagement.  
  **Success Response:**

  ```json
  {
    "success": true,
    "dashboardData": {
      "totalEarnings": 100,
      "enrolledStudentsData": [
        { "courseTitle": "Course 101", "student": { "name": "Student Name", ... } }
      ],
      "totalCourses": 5
    }
  }
  ```

  **Error Response:**

  ```json
  {
    "success": false,
    "message": "Error message"
  }
  ```

- **GET /enrolled-students**  
  _Description:_ Retrieves data about students enrolled in the educator’s courses, along with purchase information such as purchase dates.  
  _Usage:_ Educators use this endpoint to see who has bought their courses.  
  **Success Response:**
  ```json
  {
    "success": true,
    "enrolledStudents": [
      {
        "student": { "_id": "userId", "name": "Student Name", "imageUrl": "http://..." },
        "courseTitle": "Course 101",
        "purchaseDate": "2023-01-01T00:00:00.000Z"
      }
    ],
    "userData": [ ... ]
  }
  ```
  **Error Response:**
  ```json
  {
    "success": false,
    "message": "Error message"
  }
  ```

---

## Course API (/api/course)

These endpoints expose course-related data visible to all users.

- **GET /all**  
  _Description:_ Fetches all published courses with minimal details (excluding course content and enrolled students).  
  _Usage:_ Used to display courses available for sale on the front-end.  
  **Success Response:**

  ```json
  {
    "success": true,
    "courses": [
      { "courseTitle": "Course 101", ... }
    ]
  }
  ```

  **Error Response:**

  ```json
  {
    "success": false,
    "message": "Error message"
  }
  ```

- **GET /:id**  
  _Description:_ Retrieves detailed information for a single course by its ID.  
  _Usage:_ Provides course details including chapters and lectures; lecture URLs are hidden when the lecture is not marked as free for preview.  
  **Success Response:**
  ```json
  {
    "success": true,
    "courseData": { "courseTitle": "Course 101", "courseContent": [ ... ] }
  }
  ```
  **Error Response:**
  ```json
  {
    "success": false,
    "message": "Error message"
  }
  ```

---

## Clerk & Stripe Webhook API (/clerk and /stripe)

This section explains the webhook endpoints that handle events from Clerk (for user management) and Stripe (for payment processing). These webhooks ensure that your system stays in-sync with external services. Clerk sends events when users are created, updated, or deleted, while Stripe notifies your system about payment events such as successful or failed payments.

### Clerk Webhooks

- **POST /clerk**  
  _Description:_ Processes events from Clerk such as user creation, update, or deletion. When an event occurs, Clerk sends a payload to this endpoint. The system verifies the payload signature and then either creates, updates, or deletes user records accordingly.  
  _Usage:_ Automatically triggered by Clerk based on user events.  
  **Success Response Example:**
  ```json
  {
    "message": "User created"
  }
  ```
  **Error Response Example:**
  ```json
  {
    "message": "Unhandled clerk webhook type"
  }
  ```

### Stripe Webhooks

- **POST /stripe**  
  _Description:_ Handles events from Stripe, such as successful payments (payment*intent.succeeded) or failed payments (payment_intent.payment_failed). On a successful payment, the endpoint updates purchase records, enrolls the customer in the course, and changes the payment status to "completed". For failed payments, it updates the status to "failed".  
  \_Usage:* Automatically triggered by Stripe after payment events; the endpoint uses Stripe's library to reconstruct and verify the event before processing.  
  **Success Response:**
  ```json
  {
    "received": true
  }
  ```
  **Error Response:**
  ```json
  {
    "message": "Webhook Error: <error_message>"
  }
  ```

---

## Configuration Files

This section explains the configuration files used in the backend along with detailed descriptions of their purpose and usage.

### Multer Configuration

This config sets up Multer to handle file uploads (e.g., course thumbnails).  
**Example:**

```javascript
// filepath: c:\Users\chinm\OneDrive\Desktop\LMS_Website\Backend\configs\multer.js
const multer = require("multer");

// Configure storage engine. In this example, we use default disk storage with no custom options.
const storage = multer.diskStorage({});
const upload = multer({
  storage,
});

module.exports = upload;
```

_Description:_ The storage engine can be expanded to include custom filename generation or destination paths. Here, files are stored temporarily without renaming.

### Database Configuration

This config connects to MongoDB using Mongoose by reading the URI from environment variables.  
**Example:**

```javascript
// filepath: c:\Users\chinm\OneDrive\Desktop\LMS_Website\Backend\configs\db.js
require("dotenv").config();
const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("Database connected");
    });
  } catch (error) {
    console.log("Database connection failed");
    process.exit(1);
  }
};

module.exports = connectDb;
```

_Description:_ Ensure you set the `MONGO_URI` environment variable correctly. This file establishes the connection and logs the connection status.

### Cloudinary Configuration

This config sets up Cloudinary to handle image upload and storage using credentials stored in environment variables.  
**Example:**

```javascript
// filepath: c:\Users\chinm\OneDrive\Desktop\LMS_Website\Backend\configs\cloudinary.js
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
};

module.exports = connectCloudinary;
```

_Description:_ This file configures Cloudinary with your account details. It is critical for handling image uploads when adding new courses.
