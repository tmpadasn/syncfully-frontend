import { useState } from 'react';

/**
 * ErrorBoundaryTester - A component for testing error boundaries
 * 
 * To use this component:
 * 1. Import it in any page: import ErrorBoundaryTester from '../components/ErrorBoundaryTester';
 * 2. Add it to the page: <ErrorBoundaryTester />
 * 3. Click "Trigger Error" to test the error boundary
 * 4. Remove it when done testing
 */

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
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#ff4444',
      color: 'white',
      padding: '15px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 10000,
      border: '2px solid white'
    }}>
      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '12px' }}>
        🧪 ERROR BOUNDARY TESTER
      </div>
      <button
        onClick={() => setShouldError(true)}
        style={{
          background: 'white',
          color: '#ff4444',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '13px',
          width: '100%'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
      >
        💥 Trigger Error
      </button>
      <div style={{ fontSize: '10px', marginTop: '8px', opacity: 0.9 }}>
        Click to test error boundary
      </div>
    </div>
  );
}
