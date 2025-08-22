import { useState, useEffect } from "react";
import { Card, Button, Spinner, Alert, Row, Col, Badge } from "react-bootstrap";
import api from "../services/api";
import KBEditor from "../components/KBEditor";
// CORRECTED LINE: Changed "react--bootstrap-icons" to "react-bootstrap-icons"
import {
  PencilSquare,
  Trash3Fill,
  Journals,
  PlusCircleFill,
} from "react-bootstrap-icons";
import { motion, AnimatePresence } from "framer-motion";
import useNotificationStore from "../store/notificationStore";

const KBPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      // Assuming this endpoint exists for admin to get all articles
      const { data } = await api.get("/kb?all=true");
      setArticles(data);
    } catch (err) {
      addNotification("Failed to fetch articles.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (article) => {
    setCurrentArticle(article);
    setShowEditor(true);
  };

  const handleNewClick = () => {
    setCurrentArticle(null);
    setShowEditor(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await api.delete(`/kb/${id}`);
        addNotification("Article deleted successfully.", "warning");
        fetchArticles();
      } catch (err) {
        addNotification("Failed to delete article.", "danger");
      }
    }
  };

  const handleSaveArticle = async (articleData) => {
    try {
      const isUpdating = !!currentArticle;
      if (isUpdating) {
        await api.put(`/kb/${currentArticle._id}`, articleData);
      } else {
        await api.post("/kb", articleData);
      }
      addNotification(
        `Article ${isUpdating ? "updated" : "created"} successfully!`,
        "success"
      );
      resetForm();
      fetchArticles();
    } catch (err) {
      addNotification("Failed to save article.", "danger");
    }
  };

  const resetForm = () => {
    setCurrentArticle(null);
    setShowEditor(false);
  };

  return (
    <>
      <Row className="align-items-center mb-4 page-header">
        <Col>
          <h1 className="d-flex align-items-center">
            <Journals className="me-3" /> Knowledge Base Management
          </h1>
        </Col>
        <Col xs="auto">
          {!showEditor && (
            <Button variant="primary" onClick={handleNewClick}>
              <PlusCircleFill className="me-2" />
              Create New Article
            </Button>
          )}
        </Col>
      </Row>

      <Row>
        <Col md={showEditor ? 6 : 12} className="transition-all duration-300">
          {loading ? (
            <div className="centered-spinner-container">
              <Spinner
                animation="border"
                style={{ width: "4rem", height: "4rem" }}
              />
            </div>
          ) : (
            <AnimatePresence>
              {articles.map((article, index) => (
                <motion.div
                  key={article._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: index * 0.05 } }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="mb-3 glass-panel">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <Card.Title className="mb-1">
                            {article.title}
                          </Card.Title>
                          <Badge
                            pill
                            bg={
                              article.status === "published"
                                ? "success"
                                : "secondary"
                            }
                            className="me-2"
                          >
                            {article.status}
                          </Badge>
                          <small className="text-muted">
                            {article.tags.join(", ")}
                          </small>
                        </div>
                        <div className="d-flex">
                          <Button
                            variant="link"
                            onClick={() => handleEditClick(article)}
                            className="p-1 me-2 btn-icon"
                          >
                            <PencilSquare size={20} />
                          </Button>
                          <Button
                            variant="link"
                            onClick={() => handleDelete(article._id)}
                            className="p-1 text-danger btn-icon"
                          >
                            <Trash3Fill size={20} />
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </Col>
        <AnimatePresence>
          {showEditor && (
            <Col md={6}>
              <KBEditor
                articleToEdit={currentArticle}
                onFormSubmit={handleSaveArticle}
                onCancelEdit={resetForm}
              />
            </Col>
          )}
        </AnimatePresence>
      </Row>
    </>
  );
};

export default KBPage;
