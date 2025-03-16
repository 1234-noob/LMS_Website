const { Webhook } = require("svix");
const User = require("../models/user");

//Api controller function to manage clerk user with database

const clerkWebhooks = async (req, res) => {
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
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { clerkWebhooks };
