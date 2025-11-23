import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const styles = {
  card: {
    maxWidth: 420,
    width: "100%",
    margin: "0 auto",
    padding: "24px 24px 20px",
    borderRadius: 12,
    background: "#ffffff",
    boxShadow: "0 14px 30px rgba(0, 0, 0, 0.06)",
    border: "1px solid rgba(0,0,0,0.03)",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 8,
    color: "#241818",
  },
  subtitle: {
    fontSize: 14,
    color: "#5d4c4c",
    marginBottom: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  // ⭐ ADDED FIELD WRAPPER
  field: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    fontSize: 13,
    color: "#392c2cff",
    fontWeight: 500,
    marginBottom: 4,
  },
  input: {
    width: "100%",
    padding: "9px 11px",
    borderRadius: 8,
    border: "1px solid #d5d5d5",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  },
  inputError: {
    borderColor: "#e5534b",
  },
  errorBox: {
    padding: "10px 12px",
    marginBottom: 14,
    borderRadius: 8,
    border: "1px solid #f5c6cb",
    background: "#f8d7da",
    color: "#721c24",
    fontSize: 13,
  },
  infoBox: {
    padding: "10px 12px",
    marginBottom: 14,
    borderRadius: 8,
    border: "1px solid #bee5eb",
    background: "#d1ecf1",
    color: "#0c5460",
    fontSize: 13,
  },
  button: {
    marginTop: 10,
    background:
      "linear-gradient(135deg, rgba(154,66,7,0.88), rgba(185,87,22,0.95))",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: 999,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    boxShadow: "0 8px 18px rgba(154,66,7,0.35)",
    transition: "transform 0.08s ease, box-shadow 0.08s ease, opacity 0.1s",
  },
  buttonDisabled: {
    cursor: "default",
    opacity: 0.8,
    boxShadow: "none",
    transform: "none",
  },
  toggleWrapper: {
    marginTop: 16,
    fontSize: 13,
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
        await login(identifier, password);
      } else {
        await signup({ username, email, password });
      }

      navigate("/");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Try again.";
      setError(msg);
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
        minHeight: "80vh",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 480 }}>
        <main style={{ width: "100%", display: "flex", justifyContent: "center" }}>
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
                      onBlur={() => handleBlur("username")}
                      style={{
                        ...styles.input,
                        ...(touched.username && !username
                          ? styles.inputError
                          : {}),
                      }}
                      required
                    />
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => handleBlur("email")}
                      style={{
                        ...styles.input,
                        ...(touched.email && !email ? styles.inputError : {}),
                      }}
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
                    onBlur={() => handleBlur("identifier")}
                    style={{
                      ...styles.input,
                      ...(touched.identifier && !identifier
                        ? styles.inputError
                        : {}),
                    }}
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
                  onBlur={() => handleBlur("password")}
                  style={{
                    ...styles.input,
                    ...(touched.password &&
                    (passwordTooShort || !password)
                      ? styles.inputError
                      : {}),
                  }}
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
        </main>
      </div>
    </div>
  );
}
