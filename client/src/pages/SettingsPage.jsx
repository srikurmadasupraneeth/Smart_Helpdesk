import { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import api from "../services/api";
import { GearFill } from "react-bootstrap-icons";
import useNotificationStore from "../store/notificationStore";

const SettingsPage = () => {
  const [config, setConfig] = useState({
    autoCloseEnabled: false,
    confidenceThreshold: 0.75,
    slaHours: 24,
  });
  const [loading, setLoading] = useState(true);
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/config");
      setConfig(data);
    } catch (error) {
      addNotification("Failed to fetch settings.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : parseFloat(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/config", config);
      addNotification("Settings updated successfully!", "success");
    } catch (error) {
      addNotification("Failed to update settings.", "danger");
    }
  };

  if (loading)
    return (
      <div className="centered-spinner-container">
        <Spinner animation="border" style={{ width: "4rem", height: "4rem" }} />
      </div>
    );

  return (
    <>
      <Row className="align-items-center mb-4 page-header">
        <Col>
          <h1>
            <GearFill className="me-3" />
            Agent Settings
          </h1>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md={10} lg={8}>
          <Card className="glass-panel">
            <Card.Body className="p-4 p-md-5">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Check
                    type="switch"
                    id="auto-close-switch"
                    label="Enable AI Auto-Resolution"
                    name="autoCloseEnabled"
                    checked={config.autoCloseEnabled}
                    onChange={handleChange}
                  />
                  <Form.Text>
                    If enabled, the AI can automatically resolve tickets if its
                    confidence is high enough.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    Confidence Threshold:{" "}
                    <strong>
                      {(config.confidenceThreshold * 100).toFixed(0)}%
                    </strong>
                  </Form.Label>
                  <Form.Range
                    name="confidenceThreshold"
                    min="0"
                    max="1"
                    step="0.05"
                    value={config.confidenceThreshold}
                    onChange={handleChange}
                  />
                  <Form.Text>
                    The AI will auto-resolve a ticket only if its confidence is
                    above this level.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    SLA Hours: <strong>{config.slaHours} hours</strong>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="slaHours"
                    value={config.slaHours}
                    onChange={handleChange}
                  />
                  <Form.Text>
                    Service Level Agreement: time within which a ticket should
                    be addressed.
                  </Form.Text>
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100 mt-3">
                  Save Settings
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SettingsPage;
