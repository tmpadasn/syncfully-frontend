/**
 * AlertMessage Component
 * Displays contextual alerts (success/error messages) to provide user feedback.
 * Automatically applies appropriate styling and accessibility attributes based on message type.
 *
 * Props:
 *   - type (string): Message type - 'error' or 'success' - defaults to 'error'
 *   - message (string|null): Message content to display (component returns null if message is empty)
 *
 * Features:
 *   - Type-specific styling (red for errors, green for success)
 *   - Proper ARIA roles for accessibility:
 *     - Errors use role='alert' with aria-live='assertive' (high priority)
 *     - Success uses role='status' with aria-live='polite' (normal priority)
 *   - Returns null if no message provided (clean rendering)
 */
export default function AlertMessage({ type = 'error', message }) {
  // Don't render if no message provided
  if (!message) return null;

  // Define type-specific styling for visual differentiation
  const styles = {
    // Error styling: red theme for warnings/errors
    error: {
      padding: "16px 18px",
      marginBottom: 20,
      borderRadius: 10,
      border: "1px solid #f5c6cb",
      background: "#f8d7da",
      color: "#721c24",
    },
    // Success styling: green theme for confirmations/successful operations
    success: {
      padding: "16px 18px",
      marginBottom: 20,
      borderRadius: 10,
      border: "1px solid #81c784",
      background: "#e8f5e9",
      color: "#2e7d32",
    },
  };

  return (
    <div
      style={{
        ...styles[type],
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.5,
        textAlign: "center",
      }}
      // Use appropriate ARIA role: 'alert' for errors (interrupting), 'status' for success (non-interrupting)
      role={type === 'error' ? 'alert' : 'status'}
      // Set aria-live based on importance: 'assertive' for errors (read immediately), 'polite' for success (after pause)
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      {/* Message content */}
      {message}
    </div>
  );
}
