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
