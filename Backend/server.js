require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDb = require("./configs/db");
const { clerkWebhooks, stripeWebhooks } = require("./controller/webhooks");
const educatorRoute = require("./routes/educator-routes");
const { clerkMiddleware } = require("@clerk/express");
const connectCloudinary = require("./configs/cloudinary");
const app = express();
const courseRoute = require("./routes/course-route");
const userRoute = require("./routes/user-route");

//middleware

app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

app.use(express.json());
app.use(clerkMiddleware());
app.use(
  cors({
    origin: "https://lms-website-git-main-1234-noobs-projects.vercel.app",
    methods: "GET,POST",
  })
);

app.post("/clerk", clerkWebhooks);

//adding routes

app.use("/api/educator", educatorRoute);
app.use("/api/course", courseRoute);
app.use("/api/user", userRoute);

const port = process.env.PORT || 3000;

connectDb();
connectCloudinary();

app.get("/", (req, res) => {
  res.send("Api working");
});

app.listen(port, () => {
  console.log(`Server running on the port ${port}`);
});
