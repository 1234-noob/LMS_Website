require("dotenv").config();
const User = require("../models/user");
const Course = require("../models/course");
const Purchase = require("../models/purchase");
const stripe = require("stripe");
const courseProgress = require("../models/courseProgress");

const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const userData = await User.findById(userId).populate("enrolledCourses");

    res.status(200).json({
      success: true,
      enrolledCourese: userData.enrolledCourses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//controller to purchase course by a user

const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth.userId;
    const userData = await User.findById(userId);

    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      res.status(400).json({
        success: false,
        message: "User or course not found",
      });
    }
    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount:
        courseData.coursePrice -
        ((courseData.discount * courseData.coursePrice) / 100).toFixed(2),
    };

    const newPurchase = await Purchase.create(purchaseData);
    //initialization stripe gateway
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY.toLowerCase();
    //Creating line items to for Stripe

    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(newPurchase.amount) * 100,
        },
        quantity: 1,
      },
    ];
    //creating a payment session
    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}`,
      line_items: line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });
    res.status(200).json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update user progress

const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId, lectureId } = req.body;

    let progressData = await courseProgress.findOne({ userId, courseId });
    if (!progressData) {
      progressData = await courseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
      return res
        .status(201)
        .json({ success: true, message: "Progress updated" });
    }
    if (progressData.lectureCompleted.includes(lectureId)) {
      return res.status(200).json({
        success: true,
        message: "Lecture already completed",
      });
    }
    progressData.lectureCompleted.push(lectureId);
    await progressData.save();
    res.status(200).json({ success: true, message: "Progress updated" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get user course progress

const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId } = req.body;

    const progressData = await courseProgress.find({
      userId,
      courseId,
    });

    if (!progressData) {
      res.status(400).json({
        success: false,
        message: "Progress not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Progress found",
      progressData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//user rating to course

const addUserRating = async (req, res) => {
  const userId = req.auth.userId;
  const { courseId, rating } = req.body;

  if (!courseId || !rating || !userId || rating < 1 || rating > 5) {
    res.status(400).json({ success: false, message: "Invalid details" });
  }

  try {
    const course = await Course.findById(courseId);
    const user = await User.findById(userId);
    if (!course) {
      res.status(400).json({ success: false, message: "Course not found" });
    }
    if (!user || !user.enrolledCourses.includes(courseId)) {
      res.status(400).json({
        success: false,
        message: "User has not purchased this course",
      });
    }
    //if rating available the findIndex returns index value ,if not then it returns -1
    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId === userId
    );
    if (existingRatingIndex > -1) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }
    await course.save();

    res.status(200).json({ success: true, message: "Rating added" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserData,
  getUserEnrolledCourses,
  purchaseCourse,
  updateUserCourseProgress,
  getUserCourseProgress,
  addUserRating,
};
