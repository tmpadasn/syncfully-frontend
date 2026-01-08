/**
 * LoginForm Component
 * Unified form component for both login and signup functionality.
 * Handles form validation, field management, and submission based on the current mode.
 */
import FormInput from './FormInput';

// ========== INLINE ALERT MESSAGE LOGIC ==========
// Render alert message with type-specific styling and ARIA attributes
function renderAlert(alertData) {
  if (!alertData || !alertData.message) return null;

  const { type: alertType = 'error', message } = alertData;
  const alertStyles = {
    error: { padding: "16px 18px", marginBottom: 20, borderRadius: 10, border: "1px solid #f5c6cb",
             background: "#f8d7da", color: "#721c24" },
    success: { padding: "16px 18px", marginBottom: 20, borderRadius: 10, border: "1px solid #81c784",
               background: "#e8f5e9", color: "#2e7d32" },
  };

  return (
    <div
      style={{
        ...alertStyles[alertType],
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.5,
        textAlign: "center",
      }}
      role={alertType === 'error' ? 'alert' : 'status'}
      aria-live={alertType === 'error' ? 'assertive' : 'polite'}
    >
      {message}
    </div>
  );
}

export default function LoginForm({
  isLogin,
  identifier,
  setIdentifier,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  touched,
  setTouched,
  loading,
  error,
  redirectMessage,
  onSubmit,
}) {
  // Mark field as touched when user leaves it (triggers error display)
  const handleBlur = (field) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  // Check if password meets minimum length requirement (min 4 characters)
  const passwordTooShort = password && password.length < 4;

  return (
    // Form with noValidate to use custom validation logic
    <form onSubmit={onSubmit} style={{ width: "100%" }} noValidate>
      {/* Redirect notification (e.g., after account deletion) */}
      {renderAlert(redirectMessage ? { type: 'success', message: redirectMessage } : null)}

      {/* Error message display from form validation or API */}
      {renderAlert(error ? { type: 'error', message: error } : null)}

      {/* SIGNUP FIELDS: Only show username and email fields in signup mode */}
      {!isLogin && (
        <>
          {/* Username field for signup */}
          <FormInput
            id="username-input"
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => handleBlur("username")}
            touched={touched.username}
            error={!username ? "Username is required" : null}
            required
            autoComplete="username"
            ariaInvalid={touched.username && !username}
            ariaDescribedBy={touched.username && !username ? "username-error" : undefined}
          />

          {/* Email field for signup */}
          <FormInput
            id="email-input"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur("email")}
            touched={touched.email}
            error={!email ? "Email is required" : null}
            required
            autoComplete="email"
            ariaInvalid={touched.email && !email}
            ariaDescribedBy={touched.email && !email ? "email-error" : undefined}
          />
        </>
      )}
      {/* LOGIN FIELD: Only show identifier (email/username combo) field in login mode */}      {isLogin && (
        <FormInput
          id="identifier-input"
          label="Email or Username"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          onBlur={() => handleBlur("identifier")}
          touched={touched.identifier}
          error={!identifier ? "Email or username is required" : null}
          required
          autoComplete="username email"
          ariaInvalid={touched.identifier && !identifier}
          ariaDescribedBy={touched.identifier && !identifier ? "identifier-error" : undefined}
        />
      )}

      {/* PASSWORD FIELD: Shown for both login and signup modes */}
      <FormInput
        id="password-input"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => handleBlur("password")}
        touched={touched.password}
        error={passwordTooShort ? "Password too short (min 4 chars)" : !password ? "Password is required" : null}
        required
        autoComplete={isLogin ? "current-password" : "new-password"}
        ariaInvalid={touched.password && (passwordTooShort || !password)}
        ariaDescribedBy={touched.password && passwordTooShort ? "password-error" : undefined}
      />

      {/* SUBMIT BUTTON: Mode-aware button text and loading state */}
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
        // Hover effect: lift button up on hover (when not loading)
        onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
        aria-busy={loading}
      >
        {/* Mode and loading-aware button text */}
        {loading
          ? isLogin
            ? "Logging you in…"
            : "Creating account…"
          : isLogin
          ? "Log in"
          : "Sign up"}
      </button>
    </form>
  );
}
