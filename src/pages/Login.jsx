import { useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { STORAGE_KEY_JUST_LOGGED_IN } from "../config/constants";

const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    minHeight: "100vh",
    paddingTop: "80px",
    paddingBottom: "40px",
    paddingLeft: "20px",
    paddingRight: "20px",
    background: "linear-gradient(135deg, #faf8f5 0%, #f5f0ea 100%)",
  },
  cardWrapper: {
    width: "100%",
    maxWidth: "500px",
  },
  card: {
    width: "100%",
    padding: "50px 80px",
    borderRadius: 16,
    background: "#ffffff",
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(0,0,0,0.03)",
    boxSizing: "border-box",
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    marginBottom: 12,
    marginTop: 0,
    color: "#241818",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#5d4c4c",
    marginBottom: 32,
    marginTop: 0,
    lineHeight: 1.6,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  field: {
    marginBottom: 20,
  },
  label: {
    display: "block",
    fontSize: 12,
    color: "#4a3f3f",
    fontWeight: 800,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.75,
  },
  input: {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 9,
    border: "1.5px solid #e0d5cc",
    fontSize: 15,
    outline: "none",
    background: "#fdfbf8",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxSizing: "border-box",
  },
  inputError: {
    borderColor: "#e5534b",
    background: "#fff5f5",
  },
  errorBox: {
    padding: "16px 18px",
    marginBottom: 20,
    borderRadius: 10,
    border: "1px solid #f5c6cb",
    background: "#f8d7da",
    color: "#721c24",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.5,
    textAlign: "center",
  },
  infoBox: {
    padding: "16px 18px",
    marginBottom: 20,
    borderRadius: 10,
    border: "1px solid #81c784",
    background: "#e8f5e9",
    color: "#2e7d32",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.5,
    textAlign: "center",
  },
  button: {
    marginTop: 12,
    width: "100%",
    background: "linear-gradient(135deg, #9a4207, #b95716)",
    color: "#fff",
    padding: "14px 20px",
    border: "none",
    borderRadius: 9,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(154,66,7,0.25)",
    transition: "transform 0.1s ease, box-shadow 0.1s ease, opacity 0.15s",
    boxSizing: "border-box",
  },
  buttonDisabled: {
    cursor: "default",
    opacity: 0.7,
    boxShadow: "none",
    transform: "none",
  },
  toggleWrapper: {
    marginTop: 20,
    fontSize: 14,
    textAlign: "center",
    color: "#5d4c4c",
  },
  toggleLink: {
    marginLeft: 4,
    fontWeight: 600,
    color: "#9a4207c8",
    cursor: "pointer",
    textDecoration: "underline",
    textDecorationThickness: 1,
  },
  errorMessage: {
    fontSize: 12,
    color: "#a43939",
    marginTop: 6,
  },
};

export default function Login() {
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
        // Validate signup inputs
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
        // Email format validation
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

        await signup({ username, email, password });
      }

      // Set flag for fresh login
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

  return (
    <div style={styles.pageContainer}>
      <div style={styles.cardWrapper}>
        <div style={styles.card}>
          <h1 style={styles.title}>
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>

          <p style={styles.subtitle}>
            {isLogin
              ? "Log in to rate works, save favorites and get recommendations."
              : "Sign up and start rating, saving and discovering."}
          </p>

          {redirectMessage && (
            <div style={styles.infoBox} role="status" aria-live="polite">
              {redirectMessage}
            </div>
          )}

          {error && (
            <div style={styles.errorBox} role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form} noValidate>
            {!isLogin && (
              <>
                <div style={styles.field}>
                  <label htmlFor="username-input" style={styles.label}>
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
                      ...styles.input,
                      ...(touched.username && !username ? styles.inputError : {}),
                    }}
                    onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(154, 66, 7, 0.1)")}
                    required
                    autoComplete="username"
                    aria-required="true"
                    aria-invalid={touched.username && !username}
                    aria-describedby={touched.username && !username ? "username-error" : undefined}
                  />
                  {touched.username && !username && (
                    <div id="username-error" style={styles.errorMessage} role="alert">
                      Username is required
                    </div>
                  )}
                </div>

                <div style={styles.field}>
                  <label htmlFor="email-input" style={styles.label}>
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
                      ...styles.input,
                      ...(touched.email && !email ? styles.inputError : {}),
                    }}
                    onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(154, 66, 7, 0.1)")}
                    required
                    autoComplete="email"
                    aria-required="true"
                    aria-invalid={touched.email && !email}
                    aria-describedby={touched.email && !email ? "email-error" : undefined}
                  />
                  {touched.email && !email && (
                    <div id="email-error" style={styles.errorMessage} role="alert">
                      Email is required
                    </div>
                  )}
                </div>
              </>
            )}

            {isLogin && (
              <div style={styles.field}>
                <label htmlFor="identifier-input" style={styles.label}>
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
                    ...styles.input,
                    ...(touched.identifier && !identifier ? styles.inputError : {}),
                  }}
                  onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(154, 66, 7, 0.1)")}
                  required
                  autoComplete="username email"
                  aria-required="true"
                  aria-invalid={touched.identifier && !identifier}
                  aria-describedby={touched.identifier && !identifier ? "identifier-error" : undefined}
                />
                {touched.identifier && !identifier && (
                  <div id="identifier-error" style={styles.errorMessage} role="alert">
                    Email or username is required
                  </div>
                )}
              </div>
            )}

            <div style={styles.field}>
              <label htmlFor="password-input" style={styles.label}>
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
                  ...styles.input,
                  ...(touched.password && (passwordTooShort || !password)
                    ? styles.inputError
                    : {}),
                }}
                onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(154, 66, 7, 0.1)")}
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                aria-required="true"
                aria-invalid={touched.password && (passwordTooShort || !password)}
                aria-describedby={touched.password && passwordTooShort ? "password-error" : undefined}
              />
              {touched.password && passwordTooShort && (
                <div id="password-error" style={styles.errorMessage} role="alert">
                  Password too short (min 4 chars)
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {}),
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

          <div style={styles.toggleWrapper}>
            {isLogin ? "New here?" : "Already have an account?"}
            <span 
              onClick={switchMode} 
              style={styles.toggleLink}
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
