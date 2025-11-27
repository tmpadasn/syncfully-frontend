import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function GuestRoute({ children }) {
  const { user, isGuest, authLoading } = useAuth();

  if (authLoading) return <p>Loading...</p>;

  // If user is logged in, redirect to home page
  if (!isGuest && user) return <Navigate to="/" replace />;

  return children;
}
