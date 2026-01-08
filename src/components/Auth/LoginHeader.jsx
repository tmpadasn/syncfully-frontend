/**
 * LoginHeader Component
 * Displays mode-specific header content (title and description) for login and signup pages.
 * Provides clear context to users about the current authentication action.
 *
 * Props:
 *   - isLogin (boolean): Current authentication mode (true for login, false for signup)
 *
 * Content:
 *   - Dynamic title: "Welcome back" for login, "Create your account" for signup
 *   - Dynamic description: Explains benefits of logging in or signing up
 */
export default function LoginHeader({ isLogin }) {
  return (
    <>
      {/* Mode-specific heading */}
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, marginTop: 0, color: "#241818", textAlign: "center" }}>
        {isLogin ? "Welcome back" : "Create your account"}
      </h1>

      {/* Mode-specific description - explains the purpose and benefits */}
      <p style={{ fontSize: 15, color: "#5d4c4c", marginBottom: 32, marginTop: 0, lineHeight: 1.6, textAlign: "center" }}>
        {isLogin
          ? "Log in to rate works, save favorites and get recommendations."
          : "Sign up and start rating, saving and discovering."}
      </p>
    </>
  );
}
