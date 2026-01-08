/**
 * FormInput Component
 * Reusable, accessible input field with built-in validation, error handling, and styling.
 * Provides consistent UI across login/signup forms with visual feedback.
 *
 * Props:
 *   - id (string): Unique identifier for the input element and accessibility
 *   - label (string): Display label for the input field
 *   - type (string): Input type (text, email, password, etc.) - defaults to 'text'
 *   - value (string): Current input value
 *   - onChange (function): Callback when input value changes
 *   - onBlur (function): Callback when input loses focus
 *   - onFocus (function, optional): Callback when input gains focus
 *   - touched (boolean): Whether field has been interacted with (for validation display)
 *   - error (string|null): Error message to display if validation fails
 *   - required (boolean): Whether field is required - defaults to true
 *   - autoComplete (string): HTML autocomplete attribute value
 *   - ariaInvalid (boolean): Accessibility indicator of validation state
 *   - ariaDescribedBy (string): ID of error message element for screen readers
 *
 * Features:
 *   - Conditional error styling (border/background color change on error)
 *   - Focus ring effect for visual feedback
 *   - Full ARIA support for accessibility compliance
 *   - Responsive error display (only shown after field is touched)
 */
export default function FormInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  onFocus,
  touched,
  error,
  required = true,
  autoComplete,
  ariaInvalid,
  ariaDescribedBy,
}) {
  // Input styling with conditional error state styling
  const inputStyle = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 9,
    border: "1.5px solid #e0d5cc",
    fontSize: 15,
    outline: "none",
    background: "#fdfbf8",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxSizing: "border-box",
    // Apply error styling (red border, light red background) when field is touched and has error
    ...(touched && error ? { borderColor: "#e5534b", background: "#fff5f5" } : {}),
  };

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Field label - styled with uppercase text and reduced opacity */}
      <label htmlFor={id} style={{ display: "block", fontSize: 12, color: "#4a3f3f", fontWeight: 800, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1, opacity: 0.75 }}>
        {label}
      </label>

      {/* Input element with focus ring effect and validation handling */}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={(e) => {
          onBlur();
          // Remove focus ring when input loses focus
          e.target.style.boxShadow = "none";
        }}
        onFocus={(e) => {
          onFocus && onFocus();
          // Add subtle focus ring (brown theme color) on input focus
          Object.assign(e.target.style, { boxShadow: "0 0 0 3px rgba(154, 66, 7, 0.1)" });
        }}
        style={inputStyle}
        required={required}
        autoComplete={autoComplete}
        aria-required={required}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
      />

      {/* Error message - only displayed when field is touched and has validation error */}
      {touched && error && (
        <div id={ariaDescribedBy} style={{ fontSize: 12, color: "#a43939", marginTop: 6 }} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
