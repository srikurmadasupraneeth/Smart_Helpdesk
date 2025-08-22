import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import useAuthStore from "../store/authStore";
import {
  BoxArrowRight,
  PersonCircle,
  GearFill,
  Journals,
} from "react-bootstrap-icons";

const AppNavbar = () => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin = user?.role === "admin";

  return (
    <Navbar variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand
          as={NavLink}
          to="/"
          className="fw-bold d-flex align-items-center"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="me-2"
          >
            <path
              d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M2 7L12 12M12 22V12M22 7L12 12M17 4.5L7 9.5"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
          Smart Helpdesk
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated() && (
              <>
                <Nav.Link as={NavLink} to="/tickets">
                  Tickets
                </Nav.Link>
                {isAdmin && (
                  <>
                    <Nav.Link as={NavLink} to="/kb-admin">
                      KB Admin
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/settings">
                      Settings
                    </Nav.Link>
                  </>
                )}
              </>
            )}
          </Nav>
          <Nav>
            {isAuthenticated() ? (
              <NavDropdown
                title={
                  <>
                    <PersonCircle className="me-1" /> {user?.name}
                  </>
                }
                id="user-nav-dropdown"
                align="end"
              >
                {isAdmin && (
                  <>
                    <NavDropdown.Item as={NavLink} to="/kb-admin">
                      <Journals className="me-2" />
                      KB Management
                    </NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to="/settings">
                      <GearFill className="me-2" />
                      Agent Settings
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                  </>
                )}
                <NavDropdown.Item
                  onClick={handleLogout}
                  className="text-danger"
                >
                  <BoxArrowRight className="me-2" /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">
                  Login
                </Nav.Link>
                <Button
                  as={NavLink}
                  to="/register"
                  variant="primary"
                  className="ms-lg-2 mt-2 mt-lg-0"
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
