/**
 * FormField Component
 * Reusable form input with focus states and validation feedback
 */

export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  focused,
  setFocused,
  placeholder = ""
}) {
  // Check if this field is currently focused
  const isFocused = focused === name;

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Label with uppercase styling */}
      <label style={{
        display: 'block',
        fontSize: 13,
        fontWeight: 700,
        marginBottom: 8,
        color: '#6b5b4f',
        textTransform: 'uppercase',
        letterSpacing: 0.6
      }}>
        {label}
      </label>

      {/* Input field with dynamic focus styling */}
      <input
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(name)}
        onBlur={() => setFocused(null)}
        type={type}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: 10,
          border: `2px solid ${isFocused ? '#9a4207' : '#e0d5cc'}`,
          fontSize: 15,
          background: isFocused ? '#fff' : '#fdfbf8',
          transition: 'all 0.2s ease',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
          ...(isFocused ? { boxShadow: '0 0 0 3px rgba(154, 66, 7, 0.1)' } : {})
        }}
      />

      {/* Optional helper text for password field */}
      {type === 'password' && (
        <p style={{
          fontSize: 12,
          color: '#9a8371',
          marginTop: 8,
          fontStyle: 'italic'
        }}>
          Only fill this if you want to change your password
        </p>
      )}
    </div>
  );
}
