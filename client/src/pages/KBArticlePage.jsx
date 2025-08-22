import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Spinner, Alert, Breadcrumb, Badge } from "react-bootstrap";
import api from "../services/api";
import { motion } from "framer-motion";

const KBArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/kb/${id}`);
        setArticle(data);
      } catch (err) {
        setError("Failed to load knowledge base article.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading)
    return (
      <div className="centered-spinner-container">
        <Spinner animation="border" style={{ width: "4rem", height: "4rem" }} />
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!article) return <Alert variant="warning">Article not found.</Alert>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/tickets" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{article.title}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="glass-panel p-4 p-md-5">
        <h1 className="page-title mb-3">{article.title}</h1>
        <div className="mb-4">
          {article.tags.map((tag) => (
            <Badge pill bg="info" className="me-2" key={tag}>
              {tag}
            </Badge>
          ))}
        </div>
        <p className="lead" style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
          {article.body}
        </p>
        <footer className="blockquote-footer mt-4">
          Last updated on {new Date(article.updatedAt).toLocaleDateString()}
        </footer>
      </div>
    </motion.div>
  );
};

export default KBArticlePage;
