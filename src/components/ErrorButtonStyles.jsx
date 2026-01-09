import React from 'react';

/**
 * ErrorButtonStyles - Reusable ErrorButton component with integrated styling
 * Centralizes button component and styling for consistent UI across error components
 */

// ========== ERROR BUTTON COMPONENT ==========
// Interactive button with hover effects and color transitions
// Includes style definitions for different button variants
//
// Props:
//   - label: Button text content
//   - onClick: Click handler function
//   - bgColor: Background color
//   - bgColorHover: Background color on hover
//   - variant: Button style variant ('primary', 'secondary', 'tertiary')
const ErrorButton = ({
  label,
  onClick,
  bgColor,
  bgColorHover,
  variant = 'primary'
}) => {
  // ========== BUTTON STYLES BY VARIANT ==========
  // Define complete styles for each button variant
  const getButtonStyle = (variant) => {
    const baseStyle = {
      padding: '12px 24px',
      border: 'none',
      borderRadius: 8,
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          background: '#9a4207',
          color: 'white',
        };
      case 'secondary':
        return {
          ...baseStyle,
          background: '#6c757d',
          color: 'white',
        };
      case 'tertiary':
        return {
          ...baseStyle,
          border: '2px solid #ddd',
          background: 'white',
          color: '#333',
        };
      default:
        return baseStyle;
    }
  };

  // ========== HOVER HANDLERS ==========
  // Dynamic background and transform effects on mouse enter/leave
  const handleMouseEnter = (e) => {
    e.currentTarget.style.background = bgColorHover;
    e.currentTarget.style.transform = 'translateY(-2px)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.background = bgColor;
    e.currentTarget.style.transform = 'translateY(0)';
  };

  return (
    <button
      style={getButtonStyle(variant)}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {label}
    </button>
  );
};

// ========== EXPORTS ==========
// Export ErrorButton component for use in error UI components
export { ErrorButton };

export default ErrorButton;
