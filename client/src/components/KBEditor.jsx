import { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { PencilSquare, PlusCircle } from "react-bootstrap-icons";

const KBEditor = ({ articleToEdit, onFormSubmit, onCancelEdit }) => {
  const initialFormState = { title: "", body: "", tags: "", status: "draft" };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (articleToEdit) {
      setFormData({ ...articleToEdit, tags: articleToEdit.tags.join(", ") });
    } else {
      setFormData(initialFormState);
    }
  }, [articleToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const articleData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };
    onFormSubmit(articleData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-panel p-4 sticky-top"
    >
      <h5 className="d-flex align-items-center mb-4">
        {articleToEdit ? (
          <PencilSquare className="me-2" />
        ) : (
          <PlusCircle className="me-2" />
        )}
        {articleToEdit ? "Edit Article" : "Create New Article"}
      </h5>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Body</Form.Label>
          <Form.Control
            name="body"
            as="textarea"
            rows={8}
            value={formData.body}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Tags (comma-separated)</Form.Label>
              <Form.Control
                name="tags"
                value={formData.tags}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex justify-content-end mt-3">
          {articleToEdit && (
            <Button variant="secondary" onClick={onCancelEdit} className="me-2">
              Cancel
            </Button>
          )}
          <Button variant="primary" type="submit">
            {articleToEdit ? "Update Article" : "Create Article"}
          </Button>
        </div>
      </Form>
    </motion.div>
  );
};

export default KBEditor;
