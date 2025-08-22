const Article = require("../models/Article");

const getArticles = async (req, res) => {
  try {
    const { query } = req.query;
    let searchCriteria = {};

    // For admins, allow fetching all articles (drafts and published)
    if (req.user.role === "admin") {
      searchCriteria = query ? { $text: { $search: query } } : {};
    } else {
      // For non-admins, only show published articles
      searchCriteria = query
        ? { status: "published", $text: { $search: query } }
        : { status: "published" };
    }

    const articles = await Article.find(searchCriteria).sort({
      updatedAt: -1,
    });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ... rest of the controller functions remain the same
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    // Admins can see drafts, others can only see published
    if (
      article &&
      (article.status === "published" || req.user.role === "admin")
    ) {
      res.json(article);
    } else {
      res.status(404).json({ message: "Article not found or not published." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createArticle = async (req, res) => {
  try {
    const { title, body, tags, status } = req.body;
    const article = new Article({ title, body, tags, status });
    const createdArticle = await article.save();
    res.status(201).json(createdArticle);
  } catch (error) {
    res.status(400).json({ message: "Invalid article data" });
  }
};

const updateArticle = async (req, res) => {
  try {
    const { title, body, tags, status } = req.body;
    const article = await Article.findById(req.params.id);

    if (article) {
      article.title = title ?? article.title;
      article.body = body ?? article.body;
      article.tags = tags ?? article.tags;
      article.status = status ?? article.status;
      const updatedArticle = await article.save();
      res.json(updatedArticle);
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid article data" });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (article) {
      await article.deleteOne();
      res.json({ message: "Article removed" });
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
