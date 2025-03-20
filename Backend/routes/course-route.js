const express = require("express");
const {
  getAllCourses,
  getCourseId,
} = require("../controller/course-controller");

const route = express.Router();

route.get("/all", getAllCourses);

route.get("/:id", getCourseId);

module.exports = route;
