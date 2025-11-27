import React from 'react';

/**
 * Base Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Prevents the entire app from crashing when a component fails
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // You can also log to an error reporting service here
    // e.g., Sentry, LogRocket, etc.
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI can be passed as a prop
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div
          style={{
            padding: '40px 20px',
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              background: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '8px',
              padding: '30px',
              marginBottom: '20px'
            }}
          >
            <h2 style={{ color: '#856404', marginBottom: '16px' }}>
              ⚠️ Something went wrong
            </h2>
            <p style={{ color: '#856404', marginBottom: '20px' }}>
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '10px 20px',
                  background: '#9a4207',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#7a3406')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#9a4207')}
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '10px 20px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#5a6268')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#6c757d')}
              >
                Go to Home
              </button>
            </div>
          </div>

          {/* Show error details in development mode */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ textAlign: 'left', marginTop: '20px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
                Error Details (Development Only)
              </summary>
              <pre
                style={{
                  background: '#f5f5f5',
                  padding: '15px',
                  borderRadius: '6px',
                  overflow: 'auto',
                  fontSize: '12px'
                }}
              >
                {this.state.error.toString()}
                {'\n\n'}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
