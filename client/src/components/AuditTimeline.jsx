import { Card } from "react-bootstrap";
import {
  ClockHistory,
  ChatDotsFill,
  PencilFill,
  CheckCircleFill,
  Cpu,
} from "react-bootstrap-icons";
import { motion } from "framer-motion";

const AuditTimeline = ({ logs }) => {
  const getIcon = (action) => {
    switch (action) {
      case "TICKET_CREATED":
        return <PencilFill size={10} />;
      case "REPLY_SENT":
      case "AUTO_REPLY_SENT":
        return <ChatDotsFill size={10} />;
      case "TICKET_RESOLVED":
      case "AUTO_CLOSED":
        return <CheckCircleFill size={10} />;
      default:
        return <Cpu size={10} />;
    }
  };

  const getActionText = (log) => {
    const actionText = log.action.replace(/_/g, " ").toLowerCase();
    return `Ticket ${actionText} by ${log.actor}`;
  };

  return (
    <Card className="glass-panel">
      <Card.Header as="h5" className="d-flex align-items-center">
        <ClockHistory className="me-2" /> Audit Timeline
      </Card.Header>
      <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
        <div className="audit-timeline-container">
          {logs && logs.length > 0 ? (
            logs.map((log, index) => (
              <motion.div
                key={log._id}
                className="timeline-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="timeline-icon">{getIcon(log.action)}</div>
                <strong>{getActionText(log)}</strong>
                <p className="mb-0 small">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-muted">No audit logs yet.</p>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default AuditTimeline;
