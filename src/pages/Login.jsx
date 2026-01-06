import { useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { STORAGE_KEY_JUST_LOGGED_IN } from "../config/constants";

/* ===================== LOGIN COMPONENT ===================== */

// Login component
// Responsible for presenting login/signup UI, validating simple inputs,
// and delegating auth calls to the Auth hook. Keeps local form state
// and sets a short-lived flag on successful auth so other pages can show
// a welcome message.
export default function Login() {
  // Component state & routing: keeps local form inputs, loading and error flags.
  // Separates UI state from Auth hook so side-effects and navigation remain explicit.
  const { login, signup } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectMessage = location.state?.message || null;
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

  const [mode, setMode] = useState(initialMode);
  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isLogin = mode === "login";

  const resetForm = () => {
    setIdentifier("");
    setUsername("");
    setEmail("");
    setPassword("");
    setTouched({});
    setError(null);
  };

  const switchMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Submit handler: validate locally, delegate to Auth hook, and handle navigation.
    // Maintains a loading flag for optimistic UX and sets a session marker on success.
    // Note: client-side checks are defensive only; server enforces final validation.
    try {
      if (isLogin) {
        // Validate login inputs
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

        await login(identifier, password);
      } else {
        // Basic signup validation — ensure required fields are present
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
        // Simple email format check to catch obvious typos early
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          setError("Please enter a valid email address.");
          setLoading(false);
          return;
        }
        if (!password.trim() || password.length < 4) {
          setError("Password must be at least 4 characters.");
          setLoading(false);
          return;
        }

        // Auth hook handles server calls and error translation
        await signup({ username, email, password });
      }

      // Mark that the user just logged in so the landing page can show
      // a brief welcome message. This avoids coupling the auth flow with
      // the global UI directly.
      // This flag is ephemeral and used only to trigger a one-time toast.
      sessionStorage.setItem(STORAGE_KEY_JUST_LOGGED_IN, 'true');
      navigate("/");
    } catch (err) {
      // Handle specific error messages from AuthContext
      const errMsg = err?.message || "";
      setError(errMsg || "Something went wrong. Try again.");
      // User stays on login page (no navigate)
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (field) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const passwordTooShort = password && password.length < 4;

  // RETURN LOGIN PAGE LAYOUT
  // Render: conditional fields based on `mode` with accessible attributes and inline feedback.
  // Keeps markup simple so tests and E2E flows can reliably query inputs and errors.
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh", paddingTop: "80px", paddingBottom: "40px", paddingLeft: "20px", paddingRight: "20px", background: "var(--bg)" }}>
      <div style={{ width: "100%", maxWidth: "500px" }}>
        <div style={{ width: "100%", padding: "50px 80px", borderRadius: 16, background: "#ffffff", boxShadow: "0 20px 50px rgba(0, 0, 0, 0.1)", border: "1px solid rgba(0,0,0,0.03)", boxSizing: "border-box" }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, marginTop: 0, color: "#241818", textAlign: "center" }}>
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>

          <p style={{ fontSize: 15, color: "#5d4c4c", marginBottom: 32, marginTop: 0, lineHeight: 1.6, textAlign: "center" }}>
            {isLogin
              ? "Log in to rate works, save favorites and get recommendations."
              : "Sign up and start rating, saving and discovering."}
          </p>

          {redirectMessage && (
            <div style={{ padding: "16px 18px", marginBottom: 20, borderRadius: 10, border: "1px solid #81c784", background: "#e8f5e9", color: "#2e7d32", fontSize: 14, fontWeight: 500, lineHeight: 1.5, textAlign: "center" }} role="status" aria-live="polite">
              {redirectMessage}
            </div>
          )}

          {/*
            Server responses are rendered as alerts; role and aria-live
            ensure assistive tech conveys errors/prompts immediately.
          */}

          {error && (
            <div style={{ padding: "16px 18px", marginBottom: 20, borderRadius: 10, border: "1px solid #f5c6cb", background: "#f8d7da", color: "#721c24", fontSize: 14, fontWeight: 500, lineHeight: 1.5, textAlign: "center" }} role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          {/*
            Form fields use aria-describedby and aria-invalid to help
            screen readers present validation state precisely.
          */}

          <form onSubmit={handleSubmit} style={{ width: "100%" }} noValidate>
            {!isLogin && (
              <>
                {/* Username Field (Signup only) */}
                <div style={{ marginBottom: 20 }}>
                  <label htmlFor="username-input" style={{ display: "block", fontSize: 12, color: "#4a3f3f", fontWeight: 800, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1, opacity: 0.75 }}>
                    Username
                  </label>
                  <input
                    id="username-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={(e) => {
                      handleBlur("username");
                      e.target.style.boxShadow = "none";
                    }}
                    style={{
                      width: "100%",
                      padding: "13px 16px",
                      borderRadius: 9,
                      border: "1.5px solid #e0d5cc",
                      fontSize: 15,
                      outline: "none",
                      background: "#fdfbf8",
                      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                      boxSizing: "border-box",
                      ...(touched.username && !username ? { borderColor: "#e5534b", background: "#fff5f5" } : {}),
                    }}
                    onFocus={(e) => Object.assign(e.target.style, { boxShadow: "0 0 0 3px rgba(154, 66, 7, 0.1)" })}
                    required
                    autoComplete="username"
                    aria-required="true"
                    aria-invalid={touched.username && !username}
                    aria-describedby={touched.username && !username ? "username-error" : undefined}
                  />
                  {touched.username && !username && (
                    <div id="username-error" style={{ fontSize: 12, color: "#a43939", marginTop: 6 }} role="alert">
                      Username is required
                    </div>
                  )}
                </div>

                {/* Email Field (Signup only) */}
                <div style={{ marginBottom: 20 }}>
                  <label htmlFor="email-input" style={{ display: "block", fontSize: 12, color: "#4a3f3f", fontWeight: 800, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1, opacity: 0.75 }}>
                    Email Address
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={(e) => {
                      handleBlur("email");
                      e.target.style.boxShadow = "none";
                    }}
                    style={{
                      width: "100%",
                      padding: "13px 16px",
                      borderRadius: 9,
                      border: "1.5px solid #e0d5cc",
                      fontSize: 15,
                      outline: "none",
                      background: "#fdfbf8",
                      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                      boxSizing: "border-box",
                      ...(touched.email && !email ? { borderColor: "#e5534b", background: "#fff5f5" } : {}),
                    }}
                    onFocus={(e) => Object.assign(e.target.style, { boxShadow: "0 0 0 3px rgba(154, 66, 7, 0.1)" })}
                    required
                    autoComplete="email"
                    aria-required="true"
                    aria-invalid={touched.email && !email}
                    aria-describedby={touched.email && !email ? "email-error" : undefined}
                  />
                  {touched.email && !email && (
                    <div id="email-error" style={{ fontSize: 12, color: "#a43939", marginTop: 6 }} role="alert">
                      Email is required
                    </div>
                  )}
                </div>
              </>
            )}

            {isLogin && (
              <>
                {/* Identifier Field (Login only) */}
                <div style={{ marginBottom: 20 }}>
                  <label htmlFor="identifier-input" style={{ display: "block", fontSize: 12, color: "#4a3f3f", fontWeight: 800, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1, opacity: 0.75 }}>
                    Email or Username
                  </label>
                  <input
                    id="identifier-input"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    onBlur={(e) => {
                      handleBlur("identifier");
                      e.target.style.boxShadow = "none";
                    }}
                    style={{
                      width: "100%",
                      padding: "13px 16px",
                      borderRadius: 9,
                      border: "1.5px solid #e0d5cc",
                      fontSize: 15,
                      outline: "none",
                      background: "#fdfbf8",
                      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                      boxSizing: "border-box",
                      ...(touched.identifier && !identifier ? { borderColor: "#e5534b", background: "#fff5f5" } : {}),
                    }}
                    onFocus={(e) => Object.assign(e.target.style, { boxShadow: "0 0 0 3px rgba(154, 66, 7, 0.1)" })}
                    required
                    autoComplete="username email"
                    aria-required="true"
                    aria-invalid={touched.identifier && !identifier}
                    aria-describedby={touched.identifier && !identifier ? "identifier-error" : undefined}
                  />
                  {touched.identifier && !identifier && (
                    <div id="identifier-error" style={{ fontSize: 12, color: "#a43939", marginTop: 6 }} role="alert">
                      Email or username is required
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Password Field */}
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="password-input" style={{ display: "block", fontSize: 12, color: "#4a3f3f", fontWeight: 800, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1, opacity: 0.75 }}>
                Password
              </label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={(e) => {
                  handleBlur("password");
                  e.target.style.boxShadow = "none";
                }}
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: 9,
                  border: "1.5px solid #e0d5cc",
                  fontSize: 15,
                  outline: "none",
                  background: "#fdfbf8",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  boxSizing: "border-box",
                  ...(touched.password && (passwordTooShort || !password) ? { borderColor: "#e5534b", background: "#fff5f5" } : {}),
                }}
                onFocus={(e) => Object.assign(e.target.style, { boxShadow: "0 0 0 3px rgba(154, 66, 7, 0.1)" })}
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                aria-required="true"
                aria-invalid={touched.password && (passwordTooShort || !password)}
                aria-describedby={touched.password && passwordTooShort ? "password-error" : undefined}
              />
              {touched.password && passwordTooShort && (
                <div id="password-error" style={{ fontSize: 12, color: "#a43939", marginTop: 6 }} role="alert">
                  Password too short (min 4 chars)
                </div>
              )}
            </div>

            {/* Password guidance: a short client-side check prevents trivial mistakes
               and improves form completion rates before submission. */}

            {/* /*  Brief inline guidance reduces common input errors.
            //  Keep client-side checks lightweight to avoid false negatives. */}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 12,
                width: "100%",
                background: "linear-gradient(135deg, #9a4207, #b95716)",
                color: "#fff",
                padding: "14px 20px",
                border: "none",
                borderRadius: 9,
                fontWeight: 700,
                fontSize: 15,
                cursor: loading ? "default" : "pointer",
                boxShadow: loading ? "none" : "0 8px 20px rgba(154,66,7,0.25)",
                transition: "transform 0.1s ease, box-shadow 0.1s ease, opacity 0.15s",
                boxSizing: "border-box",
                opacity: loading ? 0.7 : 1,
                transform: loading ? "none" : "translateY(0)",
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
              aria-busy={loading}
            >
              {loading
                ? isLogin
                  ? "Logging you in…"
                  : "Creating account…"
                : isLogin
                ? "Log in"
                : "Sign up"}
            </button>
          </form>

          {/* Toggle Between Login and Signup */}
          <div style={{ marginTop: 20, fontSize: 14, textAlign: "center", color: "#5d4c4c" }}>
            {isLogin ? "New here?" : "Already have an account?"}
            <span
              onClick={switchMode}
              style={{ marginLeft: 4, fontWeight: 600, color: "#9a4207c8", cursor: "pointer", textDecoration: "underline", textDecorationThickness: 1 }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  switchMode();
                }
              }}
              aria-label={isLogin ? "Switch to sign up" : "Switch to login"}
            >
              {isLogin ? "Create an account" : "Log in instead"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
