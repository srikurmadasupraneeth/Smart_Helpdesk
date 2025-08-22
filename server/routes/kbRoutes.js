const express = require("express");
const router = express.Router();
const {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleById,
} = require("../controllers/kbController");
const { protect, admin } = require("../middleware/authMiddleware");

// Routes for all authenticated users
router.route("/").get(protect, getArticles);
router.route("/:id").get(protect, getArticleById);

// Admin-only routes for KB management
router.route("/").post(protect, admin, createArticle);
router
  .route("/:id")
  .put(protect, admin, updateArticle)
  .delete(protect, admin, deleteArticle);

module.exports = router;
