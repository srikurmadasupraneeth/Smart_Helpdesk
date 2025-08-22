require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

// Import routes
const authRoutes = require("./routes/authRoutes");
const kbRoutes = require("./routes/kbRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const agentRoutes = require("./routes/agentRoutes");
const configRoutes = require("./routes/configRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: "*" })); // Configure for production later
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        latency: `${duration}ms`,
      })
    );
  });
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/kb", kbRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/config", configRoutes);

// Health check endpoints
app.get("/healthz", (req, res) => res.status(200).send("OK"));
app.get("/readyz", (req, res) => {
  // 1 means connected
  if (mongoose.connection.readyState === 1) {
    res.status(200).send("Ready");
  } else {
    res.status(503).send("Not Ready");
  }
});

// Custom error handler
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

// Export the app for testing purposes
// The server will only start listening when this file is run directly
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
