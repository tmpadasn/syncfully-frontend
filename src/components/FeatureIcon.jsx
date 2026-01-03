import React from 'react';

// Small presentational component for the round icon used in feature cards.
// Props:
// - label: text shown below the icon
// - children: svg icon element
// - size: diameter in px (default 60)
export default function FeatureIcon({ label, children, size = 60 }) {
  const circleStyle = {
    fontSize: 36,
    marginBottom: 12,
    width: size,
    height: size,
    margin: '0 auto 12px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff'
  };

  return (
    <div style={{ textAlign: 'center', maxWidth: 200 }}>
      <div style={circleStyle}>{children}</div>
      {label && (
        <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{label}</div>
      )}
    </div>
  );
}
