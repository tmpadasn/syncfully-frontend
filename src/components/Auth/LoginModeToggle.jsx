/**
 * LoginModeToggle Component
 * Allows users to toggle between login and signup modes.
 * Displays context-aware text and an accessible button to switch modes.
 *
 * Props:
 *   - isLogin (boolean): Current authentication mode (true for login, false for signup)
 *   - onToggle (function): Callback fired when user clicks to switch modes
 *
 * Accessibility:
 *   - Uses semantic button role with keyboard support (Enter/Space keys)
 *   - Includes ARIA labels that update based on current mode
 *   - Maintains focus management for keyboard navigation
 */
export default function LoginModeToggle({ isLogin, onToggle }) {
  // Render toggle container with mode-specific messaging
  return (
    <div style={{ marginTop: 20, fontSize: 14, textAlign: "center", color: "#5d4c4c" }}>
      {/* Mode-specific prompt message */}
      {isLogin ? "New here?" : "Already have an account?"}

      {/* Clickable toggle link with keyboard support */}
      <span
        onClick={onToggle}
        style={{ marginLeft: 4, fontWeight: 600, color: "#9a4207c8", cursor: "pointer", textDecoration: "underline", textDecorationThickness: 1 }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          // Support both Enter and Space keys for accessibility
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        aria-label={isLogin ? "Switch to sign up" : "Switch to login"}
      >
        {/* CTA text that changes based on current mode */}
        {isLogin ? "Create an account" : "Log in instead"}
      </span>
    </div>
  );
}
