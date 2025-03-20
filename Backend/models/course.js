const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema(
  {
    lectureId: { type: String, required: true },

    lectureTitle: { type: String, required: true },
    lectureDuration: { type: Number, required: true },
    lectureUrl: { type: String, required: true },
    isPreviewFree: { type: Boolean, required: true },
    lectureOrder: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const chapterSchema = new mongoose.Schema(
  {
    chapterId: { type: String, required: true },
    chapterOrder: { type: Number, required: true },
    chapterTitle: {
      type: String,
      required: true,
    },
    chapterContent: [lectureSchema],
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    courseTitle: {
      required: true,
      type: String,
    },
    courseDescription: {
      required: true,
      type: String,
    },
    courseThumbnail: {
      type: String,
    },
    coursePrice: {
      required: true,
      type: Number,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    discount: {
      required: true,
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    courseContent: [chapterSchema],
    courseRatings: [
      {
        userId: {
          type: String,
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
    ],
    educator: {
      type: String,
      ref: "User",
      required: true,
    },
    enrolledStudents: [{ type: String, ref: "User" }],
  },
  {
    timestamps: true,
    minimize: false,
  }
);

module.exports = mongoose.model("Course", courseSchema);
