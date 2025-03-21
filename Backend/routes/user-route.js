const express = require("express");
const {
  getUserData,
  getUserEnrolledCourses,
  purchaseCourse,
  updateUserCourseProgress,
  getUserCourseProgress,
  addUserRating,
} = require("../controller/user-controller");
const purchase = require("../models/purchase");

const route = express.Router();

route.get("/data", getUserData);

route.get("/enrolled-courses", getUserEnrolledCourses);

route.post("/purchase", purchaseCourse);

route.post("/update-course-progress", updateUserCourseProgress);

route.post("/get-course-progress", getUserCourseProgress);

route.post("/add-rating", addUserRating);

module.exports = route;
