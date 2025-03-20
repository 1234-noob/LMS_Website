require("dotenv").config();
const User = require("../models/user");
const Course = require("../models/course");
const Purchase = require("../models/purchase");
const stripe = require("stripe");

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

module.exports = { getUserData, getUserEnrolledCourses, purchaseCourse };
