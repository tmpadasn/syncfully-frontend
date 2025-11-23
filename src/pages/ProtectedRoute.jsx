import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, isGuest, authLoading } = useAuth();

  if (authLoading) return <p>Loading...</p>;

  if (isGuest) return <Navigate to="/login" replace />;

  return children;
}
