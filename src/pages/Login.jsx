import { useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks";
import { STORAGE_KEY_JUST_LOGGED_IN } from "../config/constants";
import { LoginHeader, LoginForm, LoginModeToggle } from "../components";

/**
 * Login Page Component
 */
export default function Login() {
  // ========== HOOKS & INITIALIZATION ==========
  const { login, signup } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extract redirect message from location state (e.g., after account deletion)
  const redirectMessage = location.state?.message || null;
  // Detect initial mode from URL parameter or default to login
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

  // ========== STATE MANAGEMENT ==========
  // Authentication mode toggle
  const [mode, setMode] = useState(initialMode);
  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Derived state - determines which fields to show based on mode
  const isLogin = mode === "login";

  // ========== HELPER FUNCTIONS ==========
  // Reset all form fields and validation state
  const resetForm = () => {
    setIdentifier("");
    setUsername("");
    setEmail("");
    setPassword("");
    setTouched({});
    setError(null);
  };
  // Toggle between login and signup modes
  const switchMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    resetForm();
  };

  // ========== FORM SUBMISSION HANDLER ==========
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // ========== LOGIN VALIDATION ==========
        if (!identifier.trim()) {
          setError("Please enter your email or username.");
          setLoading(false);
          return;
        }
        if (!password.trim()) {
          setError("Please enter your password.");
          setLoading(false);
          return;
        }
        // Attempt login with identifier and password
        await login(identifier, password);
      } else {
        // ========== SIGNUP VALIDATION ==========
        if (!username.trim()) {
          setError("Please enter a username.");
          setLoading(false);
          return;
        }
        if (!email.trim()) {
          setError("Please enter an email address.");
          setLoading(false);
          return;
        }
        // Validate email format with regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          setError("Please enter a valid email address.");
          setLoading(false);
          return;
        }
        // Validate password minimum length
        if (!password.trim() || password.length < 4) {
          setError("Password must be at least 4 characters.");
          setLoading(false);
          return;
        }

        // Attempt signup with user data
        await signup({ username, email, password });
      }

      // ========== SUCCESS HANDLING ==========
      sessionStorage.setItem(STORAGE_KEY_JUST_LOGGED_IN, 'true');
      navigate("/");
    } catch (err) {
      // ========== ERROR HANDLING ==========
      const errMsg = err?.message || "";
      setError(errMsg || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ========== RENDER ==========
  return (
    // Main container: centered flex layout, full viewport height, styled background
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      minHeight: "100vh",
      paddingTop: "80px",
      paddingBottom: "40px",
      paddingLeft: "20px",
      paddingRight: "20px",
      background: "var(--bg)" }}>

      {/* Width constraint wrapper */}
      <div style={{ width: "100%", maxWidth: "500px" }}>

        {/* Form card container with shadow and border */}
        <div style={{
          width: "100%",
          padding: "50px 80px",
          borderRadius: 16,
          background: "#ffffff",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(0,0,0,0.03)",
          boxSizing: "border-box" }}>

          {/* Page header with mode-specific title and description */}
          <LoginHeader isLogin={isLogin} />

          {/* Main form with mode-specific fields and validation */}
          <LoginForm
            isLogin={isLogin}
            identifier={identifier}
            setIdentifier={setIdentifier}
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            touched={touched}
            setTouched={setTouched}
            loading={loading}
            error={error}
            redirectMessage={redirectMessage}
            onSubmit={handleSubmit}
          />

          {/* Mode toggle button: allows switching between login and signup */}
          <LoginModeToggle isLogin={isLogin} onToggle={switchMode} />
        </div>
      </div>
    </div>
  );
}
