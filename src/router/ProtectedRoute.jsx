import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

/**
 * Protected Route Component
 * Restricts access to authenticated users only
 * Redirects unauthenticated users to login page
 */

export default function ProtectedRoute({ children }) {
  const { isGuest, authLoading } = useAuth();

  if (authLoading) return <p>Loading...</p>;

  // Redirect to login if user is not authenticated
  if (isGuest) return <Navigate to="/login" replace />;

  return children;
}
