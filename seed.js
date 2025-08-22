const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

// Load environment variables from the project root .env file
dotenv.config();

const User = require("./server/models/User");
const Article = require("./server/models/Article");
const Ticket = require("./server/models/Ticket");
const Config = require("./server/models/Config");

const connectDB = async () => {
  try {
    // This script can be run from the host. It connects to the MongoDB
    // container exposed on localhost.
    // Ensure your MONGO_URI in the root .env points to the local instance.
    // Example: MONGO_URI=mongodb://localhost:27017/helpdesk
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for Seeding");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.log(
      "Hint: Ensure your Docker container for mongo is running and the MONGO_URI in your .env file is correct (e.g., mongodb://localhost:27017/helpdesk)."
    );
    process.exit(1);
  }
};

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Article.deleteMany();
    await Ticket.deleteMany();
    await Config.deleteMany();

    const salt = await bcrypt.genSalt(10);

    // Create users
    const users = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@example.com",
        password_hash: await bcrypt.hash("123456", salt),
        role: "admin",
      },
      {
        name: "Agent User",
        email: "agent@example.com",
        password_hash: await bcrypt.hash("123456", salt),
        role: "agent",
      },
      {
        name: "End User",
        email: "user@example.com",
        password_hash: await bcrypt.hash("123456", salt),
        role: "user",
      },
    ]);

    console.log("Users seeded.");

    // Create KB articles
    await Article.insertMany([
      {
        title: "How to update payment method",
        body: 'Go to your account settings, find the billing section, and click "Update Card". Provide your new card details and save the changes.',
        tags: ["billing", "payments"],
        status: "published",
      },
      {
        title: "Troubleshooting 500 errors",
        body: "A 500 error is a server-side error. Please try clearing your browser cache and cookies. If the problem persists, contact support with the error details and the time it occurred.",
        tags: ["tech", "errors"],
        status: "published",
      },
      {
        title: "Tracking your shipment",
        body: "Once your order ships, you will receive an email with a tracking link. You can also find the tracking number in your order history on our website.",
        tags: ["shipping", "delivery"],
        status: "published",
      },
      {
        title: "Internal Guide to Ticket Escalation",
        body: "This article is for internal use only. Escalate billing issues to the finance team and critical tech bugs to the on-call engineer.",
        tags: ["internal", "agent-guide"],
        status: "draft",
      },
    ]);

    console.log("Articles seeded.");

    // Create tickets
    await Ticket.insertMany([
      {
        title: "Refund for double charge",
        description:
          "I was charged twice for order #1234. My invoice is incorrect and I need a refund for the extra charge.",
        createdBy: users.find((u) => u.role === "user")._id,
        category: "billing",
      },
      {
        title: "App shows 500 on login",
        description:
          "I am unable to log in. The app is showing a 500 internal server error. The stack trace mentions an 'auth module' failure.",
        createdBy: users.find((u) => u.role === "user")._id,
        category: "tech",
      },
      {
        title: "Where is my package?",
        description:
          "My shipment has been delayed for 5 days and the tracking has not updated. The tracking number is SH123456789.",
        createdBy: users.find((u) => u.role === "user")._id,
        category: "shipping",
      },
    ]);

    console.log("Tickets seeded.");

    // Create default config
    await new Config().save();
    console.log("Default config saved.");

    console.log("✅ Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error during data import: ${error}`);
    process.exit(1);
  }
};

connectDB().then(() => {
  importData();
});
