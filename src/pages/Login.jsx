import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const styles = {
  card: {
    maxWidth: "100%",
    width: "100%",
    margin: "0",
    padding: "48px 40px",
    borderRadius: 16,
    background: "#ffffff",
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(0,0,0,0.03)",
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    marginBottom: 12,
    color: "#241818",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#5d4c4c",
    marginBottom: 28,
    lineHeight: 1.6,
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },

  // ⭐ ADDED FIELD WRAPPER
  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 22,
  },

  label: {
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    boxShadow: "0 8px 20px rgba(154,66,7,0.25)",
    transition: "transform 0.1s ease, box-shadow 0.1s ease, opacity 0.15s",
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
};

export default function Login() {
  const { login, signup } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const redirectMessage = location.state?.message || null;

  const [mode, setMode] = useState("login");
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
        if (!password.trim() || password.length < 4) {
          setError("Password must be at least 4 characters.");
          setLoading(false);
          return;
        }

        await signup({ username, email, password });
      }

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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "60px 24px",
        background: "linear-gradient(135deg, #faf8f5 0%, #f5f0ea 100%)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 480 }}>
        <main style={{ width: "100%" }}>
          <div style={{
            ...styles.card,
            width: "100%",
          }}>
            <h1 style={styles.title}>
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>

            <p style={styles.subtitle}>
              {isLogin
                ? "Log in to rate works, save favorites and get recommendations."
                : "Sign up and start rating, saving and discovering."}
            </p>

            <div style={{ maxWidth: 360, margin: "0 auto" }}>
              {redirectMessage && (
                <div style={styles.infoBox}>{redirectMessage}</div>
              )}

              {error && <div style={styles.errorBox}>{error}</div>}

              <form onSubmit={handleSubmit} style={styles.form} noValidate>
              {!isLogin && (
                <>
                  <div style={styles.field}>
                    <label style={styles.label}>Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onBlur={(e) => {
                        handleBlur("username");
                        e.target.style.boxShadow = "none";
                      }}
                      style={{
                        ...styles.input,
                        ...(touched.username && !username
                          ? styles.inputError
                          : {}),
                      }}
                      onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(154, 66, 7, 0.1)")}
                      required
                    />
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>Email Address</label>
                    <input
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
                    />
                  </div>
                </>
              )}

              {isLogin && (
                <div style={styles.field}>
                  <label style={styles.label}>Email or Username</label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    onBlur={(e) => {
                      handleBlur("identifier");
                      e.target.style.boxShadow = "none";
                    }}
                    style={{
                      ...styles.input,
                      ...(touched.identifier && !identifier
                        ? styles.inputError
                        : {}),
                    }}
                    onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(154, 66, 7, 0.1)")}
                    required
                  />
                </div>
              )}

              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={(e) => {
                    handleBlur("password");
                    e.target.style.boxShadow = "none";
                  }}
                  style={{
                    ...styles.input,
                    ...(touched.password &&
                    (passwordTooShort || !password)
                      ? styles.inputError
                      : {}),
                  }}
                  onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(154, 66, 7, 0.1)")}
                  required
                />
              </div>

              {touched.password && passwordTooShort && (
                <div style={{ fontSize: 12, color: "#a43939", marginTop: -8 }}>
                  Password too short (min 4 chars)
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.button,
                  ...(loading ? styles.buttonDisabled : {}),
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
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
                <span onClick={switchMode} style={styles.toggleLink}>
                  {isLogin ? "Create an account" : "Log in instead"}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
