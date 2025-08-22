import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Alert, Row, Col, InputGroup } from "react-bootstrap";
import useAuthStore from "../store/authStore";
import api from "../services/api";
import { motion } from "framer-motion";
import { BoxArrowInRight, EyeFill, EyeSlashFill } from "react-bootstrap-icons";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.token);
      navigate("/tickets");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* CORRECTED LINE: Added w-100 to the Row to make it take full width */}
      <Row className="justify-content-md-center w-100">
        <Col md={6} lg={5} xl={4}>
          <motion.div
            className="glass-panel p-4 p-md-5"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-center mb-4">
              <h2 className="fw-bold page-title d-flex align-items-center justify-content-center">
                <BoxArrowInRight className="me-3" />
                Welcome Back
              </h2>
              <p>Log in to the future of support.</p>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Minimum 8 Characters"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-btn"
                  >
                    {showPassword ? <EyeSlashFill /> : <EyeFill />}
                  </Button>
                </InputGroup>
              </Form.Group>
              <Button
                className="w-100"
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? "Logging In..." : "Log In"}
              </Button>
            </Form>
            <div className="w-100 text-center mt-4">
              <span className="text-muted">Need an account?</span>{" "}
              <Link to="/register">Register here</Link>
            </div>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
