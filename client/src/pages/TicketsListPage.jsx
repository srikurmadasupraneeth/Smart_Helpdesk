import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import { PlusCircleFill, TicketPerforatedFill } from "react-bootstrap-icons";
import { motion } from "framer-motion";

const TicketsListPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/tickets");
      setTickets(data);
    } catch (err) {
      setError("Failed to fetch tickets.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/tickets", { title, description });
      navigate(`/tickets/${data._id}`);
      handleClose();
    } catch (err) {
      setError("Failed to create ticket.");
    }
  };

  const handleClose = () => {
    setShowCreateModal(false);
    setTitle("");
    setDescription("");
    setError("");
  };

  const getStatusClass = (status) => `status-${status.replace(/_/g, "-")}`;

  return (
    <>
      <Row className="align-items-center mb-4 page-header">
        <Col>
          <h1 className="d-flex align-items-center">
            <TicketPerforatedFill className="me-3" />
            {user?.role === "user"
              ? "My Support Tickets"
              : "All Support Tickets"}
          </h1>
        </Col>
        {user?.role === "user" && (
          <Col xs="auto">
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              className="d-flex align-items-center fw-bold"
            >
              <PlusCircleFill className="me-2" /> Create New Ticket
            </Button>
          </Col>
        )}
      </Row>

      {loading ? (
        <div className="centered-spinner-container">
          <Spinner
            animation="border"
            style={{ width: "4rem", height: "4rem" }}
          />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : tickets.length === 0 ? (
        <Card className="glass-panel text-center p-5">
          <Card.Body>
            <h4>No tickets found.</h4>
            {user?.role === "user" && (
              <p className="text-muted">Ready to create your first one?</p>
            )}
          </Card.Body>
        </Card>
      ) : (
        tickets.map((ticket, index) => (
          <motion.div
            key={ticket._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className="mb-3 glass-panel"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/tickets/${ticket._id}`)}
            >
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">{ticket.title}</h5>
                  <small>
                    Created by {ticket.createdBy.name} on{" "}
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <span
                  className={`status-badge ${getStatusClass(ticket.status)}`}
                >
                  {ticket.status.replace("_", " ")}
                </span>
              </Card.Body>
            </Card>
          </motion.div>
        ))
      )}

      <Modal show={showCreateModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Support Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateTicket}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., Issue with my recent invoice"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Please describe your issue in detail..."
              />
            </Form.Group>
            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Submit Ticket
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default TicketsListPage;
