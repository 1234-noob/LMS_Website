const { clerkClient } = require("@clerk/express");
const Course = require("../models/course");
const Purchase = require("../models/purchase");
const purchase = require("../models/purchase");
const cloudinary = require("cloudinary").v2;

const updateRoleToEducator = async (req, res) => {
  try {
    //gets from clerk middleware
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Role updated to educator" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//Add new Course
const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;
    console.log("hi");
    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Thumbnail not attached" });
    }
    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = educatorId;
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    const newCourse = await Course.create(parsedCourseData);

    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();

    res.status(201).json({
      newCourse,
      success: true,
      message: "Course Added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get educator Courses

const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;

    const educatorCourses = await Course.find({ educator });
    res.status(200).json({
      success: true,
      message: "Educator courses found",
      educatorCourses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get Educator dashboard data (enrolled students, courses,total earning)
const getEducatorDashboard = async (req, res) => {
  try {
    const educator = req.auth.userId;

    const educatorCourses = await Course.find({ educator });
    const totalCourses = educatorCourses.length;

    const courseId = educatorCourses.map((course) => course._id);

    //calculate total earning from purchases
    const purchases = await Purchase.find({
      courseId: {
        $in: courseId,
      },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    //collect unique enrolled students Ids with their course titles

    const enrolledStudentsData = [];
    for (const course of educatorCourses) {
      const students = await User.find(
        {
          _id: {
            $in: course.enrolledStudents,
          },
        },
        "name imageUrl"
      );
      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }
    res.status(200).json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get enrolled students data with purchase data

const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const educatorCourses = await Course.find({ educator });

    const courseIds = educatorCourses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("UserId", "name imageUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.status(200).json({
      success: true,
      enrolledStudents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  updateRoleToEducator,
  addCourse,
  getEducatorCourses,
  getEducatorDashboard,
  getEnrolledStudentsData,
};
