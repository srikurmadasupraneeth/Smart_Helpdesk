import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import AppNavbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TicketsListPage from "./pages/TicketsListPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import KBPage from "./pages/KBPage";
import SettingsPage from "./pages/SettingsPage";
import KBArticlePage from "./pages/KBArticlePage";
import AuthGuard from "./components/AuthGuard";
import NotificationToast from "./components/NotificationToast";

function App() {
  return (
    <Router>
      <NotificationToast />
      <AppNavbar />
      <Container className="my-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/" element={<Navigate to="/tickets" replace />} />
          <Route
            path="/tickets"
            element={
              <AuthGuard>
                <TicketsListPage />
              </AuthGuard>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <AuthGuard>
                <TicketDetailPage />
              </AuthGuard>
            }
          />
          <Route
            path="/kb/:id"
            element={
              <AuthGuard>
                <KBArticlePage />
              </AuthGuard>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/kb-admin"
            element={
              <AuthGuard role="admin">
                <KBPage />
              </AuthGuard>
            }
          />
          <Route
            path="/settings"
            element={
              <AuthGuard role="admin">
                <SettingsPage />
              </AuthGuard>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/tickets" replace />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
