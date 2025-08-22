const express = require("express");
const router = express.Router();
const { getConfig, updateConfig } = require("../controllers/configController");
const { protect, admin } = require("../middleware/authMiddleware");

// Admin-only routes for getting and updating system configuration
router
  .route("/")
  .get(protect, admin, getConfig)
  .put(protect, admin, updateConfig);

module.exports = router;
