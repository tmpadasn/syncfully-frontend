/**
 * LoginForm Component
 * Unified form component for both login and signup functionality.
 * Handles form validation, field management, and submission based on the current mode.
 *
 * Props:
 *   - isLogin (boolean): Current authentication mode (true for login, false for signup)
 *   - identifier (string): Email/username value for login mode
 *   - setIdentifier (function): Updates identifier state
 *   - username (string): Username value for signup mode
 *   - setUsername (function): Updates username state
 *   - email (string): Email value for signup mode
 *   - setEmail (function): Updates email state
 *   - password (string): Password value (both modes)
 *   - setPassword (function): Updates password state
 *   - touched (object): Tracks which fields have been interacted with (for validation display)
 *   - setTouched (function): Updates touched state
 *   - loading (boolean): Whether form is in submitting state (disables submit button)
 *   - onSubmit (function): Callback when form is submitted
 *
 * Validation Rules:
 *   - Login: identifier and password required
 *   - Signup: username, email (valid format), and password (min 4 chars) required
 *   - Password validation is continuous (validates as user types)
 *   - Other field validation shows on blur (touched state)
 *
 * Features:
 *   - Mode-specific field rendering (different fields for login vs signup)
 *   - Real-time password length validation
 *   - Touch-based error display (errors only show after field interaction)
 *   - Loading state button (disabled during submission)
 *   - Full form validation before submission
 */
import FormInput from './FormInput';

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
