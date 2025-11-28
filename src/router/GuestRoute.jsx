import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

/**
 * GuestRoute component - Route guard for guest-only pages (login, signup)
 * Restricts authenticated users from accessing guest-only routes and redirects them to home
 */

export default function GuestRoute({ children }) {
  // Get authentication state from context
  const { user, isGuest, authLoading } = useAuth();

  if (authLoading) return <p>Loading...</p>;

  // Redirect authenticated users away from guest-only routes to prevent unauthorized access
  if (!isGuest && user) return <Navigate to="/" replace />;

  return children;
}
