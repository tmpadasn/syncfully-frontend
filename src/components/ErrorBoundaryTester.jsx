import { useState } from 'react';

/* ErrorBoundaryTester: developer utility that intentionally throws an error to validate error-boundary behavior. */
/* Use only during development to verify logging and recovery UI. */

/* ===================== UI STYLES ===================== */
const styles = {
  /* ===================== TESTER CONTAINER ===================== */
  container: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: '#ff4444',
    color: 'white',
    padding: '15px 20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: 10000,
    border: '2px solid white',
  },

  /* ===================== TESTER HEADER ===================== */
  header: {
    marginBottom: '8px',
    fontWeight: 'bold',
    fontSize: '12px',
  },

  /* ===================== TRIGGER BUTTON ===================== */
  button: {
    background: 'white',
    color: '#ff4444',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '13px',
    width: '100%',
  },

  /* ===================== FOOTER TEXT ===================== */
  footer: {
    fontSize: '10px',
    marginTop: '8px',
    opacity: 0.9,
  },
};

// This component will throw an error when triggered
function BrokenComponent() {
  throw new Error('💥 Test error triggered! Error boundary is working correctly.');
}

export default function ErrorBoundaryTester() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    return <BrokenComponent />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        🧪 ERROR BOUNDARY TESTER
      </div>
      <button
        onClick={() => setShouldError(true)}
        style={styles.button}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
      >
        💥 Trigger Error
      </button>
      <div style={styles.footer}>
        Click to test error boundary
      </div>
    </div>
  );
}
