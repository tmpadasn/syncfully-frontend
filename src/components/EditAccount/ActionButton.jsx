/**
 * ActionButton Component
 * Reusable button with hover state and dynamic styling
 */

export default function ActionButton({
  label,
  onClick,
  disabled,
  hover,
  setHover,
  color,
  marginTop = 0
}) {
  // Determine if button should show hover state
  const isHovering = hover && !disabled;

  return (
    // Button element with dynamic styles based on props
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%',
        padding: '16px 20px',
        borderRadius: 10,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 16,
        fontWeight: 800,
        letterSpacing: '.5px',
        color: '#fff',
        background: color,
        // Dynamic shadow based on hover state and button color
        boxShadow: isHovering
          ? `0 6px 16px ${color === "#9a4207" ? "rgba(154, 66, 7, 0.3)" : "rgba(0, 0, 0, 0.2)"}`
          : '0 4px 12px rgba(0,0,0,0.15)',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box',
        marginTop,
        opacity: disabled ? 0.6 : 1,
        // Lift button on hover with subtle animation
        transform: isHovering ? "translateY(-2px)" : "translateY(0)"
      }}
    >
      {label}
    </button>
  );
}
