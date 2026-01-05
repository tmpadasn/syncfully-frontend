import React from 'react';

/* HoverBar: small wrapper that applies hover transform and shadow to a block.
   Use when several places need identical hover affordances to avoid duplication. */
export default function HoverBar({ children, style = {}, className, ...rest }) {
  const baseStyle = {
    transition: 'all 0.18s ease',
  };

  /* Hover affordance rationale: subtle translate and shadow enhance discoverability
     without altering layout, keeping interactions visually consistent. */

  return (
    <div
      className={className}
      style={{ ...baseStyle, ...style }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(8px)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(154, 66, 7, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(154, 66, 7, 0.15)';
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
