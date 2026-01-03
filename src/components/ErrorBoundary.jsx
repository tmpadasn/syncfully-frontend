import React from 'react';
import logger from '../utils/logger';
import { IS_DEVELOPMENT } from '../config/constants';

/* ===================== UI STYLES ===================== */
const styles = {
  /* ===================== ERROR CONTAINER ===================== */
  errorContainer: {
    padding: '40px 20px',
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
  },

  /* ===================== ERROR BOX ===================== */
  errorBox: {
    background: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '8px',
    padding: '30px',
    marginBottom: '20px',
  },

  /* ===================== ERROR HEADING ===================== */
  errorHeading: {
    color: '#856404',
    marginBottom: '16px',
  },

  /* ===================== ERROR MESSAGE ===================== */
  errorMessage: {
    color: '#856404',
    marginBottom: '20px',
  },

  /* ===================== BUTTON CONTAINER ===================== */
  buttonContainer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  /* ===================== PRIMARY BUTTON ===================== */
  primaryButton: {
    padding: '10px 20px',
    background: '#9a4207',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },

  /* ===================== SECONDARY BUTTON ===================== */
  secondaryButton: {
    padding: '10px 20px',
    background: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },

  /* ===================== ERROR DETAILS SECTION ===================== */
  detailsSection: {
    textAlign: 'left',
    marginTop: '20px',
  },

  /* ===================== ERROR DETAILS SUMMARY ===================== */
  detailsSummary: {
    cursor: 'pointer',
    fontWeight: 'bold',
    marginBottom: '10px',
  },

  /* ===================== ERROR STACK TRACE ===================== */
  stackTrace: {
    background: '#f5f5f5',
    padding: '15px',
    borderRadius: '6px',
    overflow: 'auto',
    fontSize: '12px',
  },
};
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    logger.error('ErrorBoundary caught an error:', error, errorInfo);

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
        <div style={styles.errorContainer}>
          <div style={styles.errorBox}>
            <h2 style={styles.errorHeading}>
              ⚠️ Something went wrong
            </h2>
            <p style={styles.errorMessage}>
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>

            <div style={styles.buttonContainer}>
              <button
                onClick={this.handleReset}
                style={styles.primaryButton}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#7a3406')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#9a4207')}
              >
                Try Again
              </button>

              <button
                onClick={() => window.location.href = '/'}
                style={styles.secondaryButton}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#5a6268')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#6c757d')}
              >
                Go to Home
              </button>
            </div>
          </div>

          {/* Show error details in development mode */}
          {IS_DEVELOPMENT && this.state.error && (
            <details style={styles.detailsSection}>
              <summary style={styles.detailsSummary}>
                Error Details (Development Only)
              </summary>
              <pre style={styles.stackTrace}>
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
