const express = require("express");
const upload = require("../configs/multer");

const route = express.Router();
const {
  getEducatorCourses,
  updateRoleToEducator,
  addCourse,
  getEducatorDashboard,
  getEnrolledStudentsData,
} = require("../controller/educator-controller");
const { educatorAuth } = require("../middleware/auth-middleware");

route.get("/update-role", updateRoleToEducator);

route.post("/add-course", upload.single("image"), educatorAuth, addCourse);

route.get("/courses", educatorAuth, getEducatorCourses);

route.get("/dashboard", educatorAuth, getEducatorDashboard);

route.get("/enrolled-students", educatorAuth, getEnrolledStudentsData);

module.exports = route;
