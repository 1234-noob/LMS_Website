const { Webhook } = require("svix");

const User = require("../models/user");
const stripe = require("stripe");
const Purchase = require("../models/purchase");
const Course = require("../models/course");

// Api controller function to manage clerk user with database
const clerkWebhooks = async (req, res) => {
  // Log incoming headers to ensure the endpoint is hit

  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    if (type === "user.created") {
      await User.create({
        _id: data.id,
        name: data.first_name + " " + data.last_name,
        email: data.email_addresses[0].email_address,
        imageUrl: data.image_url,
      });
      res.status(201).json({ message: "User created" });
    } else if (type === "user.updated") {
      await User.findByIdAndUpdate(data.id, {
        name: data.first_name + " " + data.last_name,
        email: data.email_addresses[0].email_address,
        imageUrl: data.image_url,
      });
      res.status(200).json({ message: "User updated" });
    } else if (type === "user.deleted") {
      await User.findByIdAndDelete(data.id);
      res.status(200).json({ message: "User deleted" });
    } else {
      res.status(400).json({ message: "Unhandled clerk webhook type" });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const stripeWebhooks = async (req, res) => {
  // Log incoming headers to verify endpoint call
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const sig = req.headers["stripe-signature"];
  console.log(req.headers);
  let event;

  try {
    // Construct the event using Stripe's library
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
  console.log(event.type);
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentId = paymentIntent.id;
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentId,
      });
      const { purchaseId } = session.data[0].metadata;
      const purchaseData = await Purchase.findById(purchaseId);
      const userData = await User.findById(purchaseData.userId);
      const courseData = await Course.findById(
        purchaseData.courseId.toString()
      );
      courseData.enrolledStudents.push(userData);
      await courseData.save();

      userData.enrolledCourses.push(courseData._id);
      await userData.save();

      purchaseData.status = "completed";
      await purchaseData.save();

      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentId = paymentIntent.id;
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentId,
      });
      const { purchaseId } = session.data[0].metadata;
      const purchaseData = await Purchase.findById(purchaseId);

      purchaseData.status = "failed";
      await purchaseData.save();

      break;
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.status(200).json({ received: true });
};

module.exports = { clerkWebhooks, stripeWebhooks };
