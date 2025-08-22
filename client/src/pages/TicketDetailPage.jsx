import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  Spinner,
  Alert,
  Row,
  Col,
  Form,
  Button,
  Badge,
} from "react-bootstrap";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import useNotificationStore from "../store/notificationStore";
import AuditTimeline from "../components/AuditTimeline";
import {
  PatchCheckFill,
  SendFill,
  ArrowCounterclockwise,
  Robot,
  PersonFill,
} from "react-bootstrap-icons";
import { motion } from "framer-motion";

const TicketDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const [ticket, setTicket] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [conversation, setConversation] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState("");

  const fetchTicketData = useCallback(async () => {
    setLoading(true);
    try {
      const ticketRes = await api.get(`/tickets/${id}`);
      setTicket(ticketRes.data);

      const auditRes = await api.get(`/tickets/${id}/audit`);
      setAuditLogs(auditRes.data);

      const initialPost = {
        _id: ticketRes.data._id,
        actor: "user",
        author: ticketRes.data.createdBy.name,
        createdAt: ticketRes.data.createdAt,
        message: ticketRes.data.description,
      };
      const replies = auditRes.data
        .filter(
          (log) =>
            log.action === "REPLY_SENT" || log.action === "AUTO_REPLY_SENT"
        )
        .map((log) => ({
          _id: log._id,
          actor: log.actor,
          author:
            log.actor === "system"
              ? "AI Assistant"
              : log.meta.author || "Support Agent",
          createdAt: log.createdAt,
          message: log.meta.reply,
          citations: log.meta.citations || [],
        }));
      setConversation([
        initialPost,
        ...replies.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        ),
      ]);

      if (user?.role === "agent" || user?.role === "admin") {
        try {
          const suggestionRes = await api.get(`/agent/suggestion/${id}`);
          setSuggestion(suggestionRes.data);
          if (!replyText) setReplyText(suggestionRes.data.draftReply || "");
        } catch (err) {
          console.log("AI suggestion not available yet.");
        }
      }
    } catch (err) {
      setError(
        "Failed to fetch ticket details. You may not have permission to view this."
      );
    } finally {
      setLoading(false);
    }
  }, [id, user?.role, replyText]);

  useEffect(() => {
    fetchTicketData();
  }, [id]); // Only refetch when ID changes

  const handleAction = async (actionFn, successMsg, errorMsg) => {
    if (
      !window.confirm(
        `Are you sure you want to ${successMsg.split(" ")[1]} this ticket?`
      )
    )
      return;
    try {
      await actionFn();
      addNotification(successMsg, "success");
      fetchTicketData(); // Refetch data after action
    } catch (err) {
      addNotification(errorMsg, "danger");
    }
  };

  const handleSendReply = () =>
    handleAction(
      () => api.post(`/tickets/${id}/reply`, { reply: replyText }),
      "Reply sent successfully!",
      "Failed to post reply."
    );
  const handleResolveTicket = () =>
    handleAction(
      () => api.post(`/tickets/${id}/resolve`),
      "Ticket has been resolved.",
      "Failed to resolve ticket."
    );
  const handleReopenTicket = () =>
    handleAction(
      () => api.post(`/tickets/${id}/reopen`),
      "Ticket has been reopened.",
      "Failed to reopen ticket."
    );

  const getStatusClass = (status) => `status-${status.replace(/_/g, "-")}`;
  const isAgentOrAdmin = user?.role === "agent" || user?.role === "admin";
  const isResolved =
    ticket?.status === "resolved" || ticket?.status === "closed";

  if (loading)
    return (
      <div className="centered-spinner-container">
        <Spinner animation="border" style={{ width: "4rem", height: "4rem" }} />
      </div>
    );
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!ticket) return <Alert variant="warning">Ticket not found.</Alert>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Row className="align-items-center mb-4 page-header">
        <Col>
          <h1 className="mb-1">{ticket.title}</h1>
          <small>Ticket #{ticket._id.substring(ticket._id.length - 6)}</small>
        </Col>
        <Col xs="auto" className="d-flex align-items-center gap-2">
          <span className={`status-badge ${getStatusClass(ticket.status)}`}>
            {ticket.status.replace("_", " ")}
          </span>
          {isAgentOrAdmin && !isResolved && (
            <Button variant="success" size="sm" onClick={handleResolveTicket}>
              <PatchCheckFill className="me-2" /> Resolve
            </Button>
          )}
          {isAgentOrAdmin && isResolved && (
            <Button variant="warning" size="sm" onClick={handleReopenTicket}>
              <ArrowCounterclockwise className="me-2" /> Reopen
            </Button>
          )}
        </Col>
      </Row>
      <Row>
        <Col
          lg={isAgentOrAdmin && !isResolved ? 7 : 12}
          xl={isAgentOrAdmin && !isResolved ? 8 : 12}
        >
          <Card className="mb-4 glass-panel">
            <Card.Header as="h5">Conversation</Card.Header>
            <Card.Body>
              {conversation.map((entry) => (
                <div
                  key={entry._id}
                  className={`conversation-entry actor-${entry.actor}`}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong className="author d-flex align-items-center">
                      {entry.actor === "system" ? (
                        <Robot className="me-2" />
                      ) : (
                        <PersonFill className="me-2" />
                      )}{" "}
                      {entry.author}
                    </strong>
                    <span className="timestamp">
                      {new Date(entry.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="m-0" style={{ whiteSpace: "pre-wrap" }}>
                    {entry.message}
                  </p>
                  {entry.citations?.length > 0 && (
                    <div className="mt-3">
                      <strong className="d-block mb-1">Cited Articles:</strong>
                      {entry.citations.map((c) => (
                        <Link
                          to={`/kb/${c._id}`}
                          className="d-block small"
                          key={c._id}
                        >
                          {c.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </Card.Body>
          </Card>
          {(!isAgentOrAdmin || isResolved) && (
            <AuditTimeline logs={auditLogs} />
          )}
        </Col>

        {isAgentOrAdmin && !isResolved && (
          <Col lg={5} xl={4}>
            <div className="sticky-top" style={{ top: "100px" }}>
              <Card className="mb-4 glass-panel">
                <Card.Header as="h5">Agent Tools</Card.Header>
                <Card.Body>
                  {suggestion ? (
                    <div className="mb-4">
                      <strong>AI Suggestion:</strong>
                      <div
                        className="small p-2 mt-1 rounded"
                        style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                      >
                        <p className="mb-1">
                          <strong>Category:</strong>{" "}
                          <Badge bg="info">
                            {suggestion.predictedCategory}
                          </Badge>
                        </p>
                        <p className="mb-0">
                          <strong>Confidence:</strong>{" "}
                          <Badge bg="primary">
                            {(suggestion.confidence * 100).toFixed(0)}%
                          </Badge>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center my-3">
                      <Spinner animation="grow" size="sm" />{" "}
                      <span className="ms-2">Awaiting AI suggestion...</span>
                    </div>
                  )}
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendReply();
                    }}
                  >
                    <Form.Group>
                      <Form.Label as="strong">Send Reply:</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={8}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your response here..."
                        disabled={!suggestion}
                      />
                    </Form.Group>
                    <Button
                      variant="primary"
                      type="submit"
                      className="mt-3 w-100 fw-bold d-flex align-items-center justify-content-center"
                      disabled={!replyText}
                    >
                      <SendFill className="me-2" /> Send Reply
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
              <AuditTimeline logs={auditLogs} />
            </div>
          </Col>
        )}
      </Row>
    </motion.div>
  );
};

export default TicketDetailPage;
