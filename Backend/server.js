require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDb = require("./configs/db");
const { clerkWebhooks } = require("./controller/webhooks");

const app = express();

//middleware

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

connectDb();

//route for clerk

app.post("/clerk", clerkWebhooks);

app.listen(port, () => {
  console.log(`Server running on the port ${port}`);
});
