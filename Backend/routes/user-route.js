const express = require("express");
const {
  getUserData,
  getUserEnrolledCourses,
  purchaseCourse,
} = require("../controller/user-controller");
const purchase = require("../models/purchase");

const route = express.Router();

route.get("/data", getUserData);

route.get("/enrolled-courses", getUserEnrolledCourses);

route.post("/purchase", purchaseCourse);

module.exports = route;
