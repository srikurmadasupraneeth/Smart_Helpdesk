import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Alert, Row, Col, InputGroup } from "react-bootstrap";
import useAuthStore from "../store/authStore";
import api from "../services/api";
import { motion } from "framer-motion";
import { PersonPlusFill, EyeFill, EyeSlashFill } from "react-bootstrap-icons";

const RegisterPage = () => {
  const [name, setName] = useState("");
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
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      login(data.token);
      navigate("/tickets");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to register. The email might already be in use."
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
                <PersonPlusFill className="me-3" />
                Create an Account
              </h2>
              <p>Join the next generation of helpdesks.</p>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Jane Doe"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="jane.doe@example.com"
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
                {loading ? "Registering..." : "Register"}
              </Button>
            </Form>
            <div className="w-100 text-center mt-4">
              <span className="text-muted">Already have an account?</span>{" "}
              <Link to="/login">Log in</Link>
            </div>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterPage;
