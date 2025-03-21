const mongoose = require("mongoose");

const courseProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    lectureCompleted: [],
  },
  {
    minimize: false,
  }
);

module.exports = mongoose.model("courseProgress", courseProgressSchema);
