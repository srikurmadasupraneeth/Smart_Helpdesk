import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

const AuthGuard = ({ children, role }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a role is required, check if the user has that role.
  // Admins are allowed to access agent routes.
  if (role) {
    if (role === "agent" && user?.role !== "agent" && user?.role !== "admin") {
      return <Navigate to="/tickets" replace />;
    }
    if (role === "admin" && user?.role !== "admin") {
      return <Navigate to="/tickets" replace />;
    }
  }

  return children;
};

export default AuthGuard;
