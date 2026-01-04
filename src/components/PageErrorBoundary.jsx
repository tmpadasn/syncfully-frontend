import React from 'react';
import logger from '../utils/logger';
import { IS_DEVELOPMENT } from '../config/constants';

/* PageErrorBoundary: catches uncaught errors at the page level and renders a
  recovery UI while recording diagnostic details. This containment prevents
  a single page failure from rendering the entire SPA unusable. */

/* ===================== UI STYLES ===================== */
const styles = {
  /* ===================== ERROR WRAPPER ===================== */
  errorWrapper: {
    padding: '60px 20px',
    textAlign: 'center',
    maxWidth: '700px',
    margin: '0 auto',
  },

  /* ===================== ERROR BOX ===================== */
  errorBox: {
    background: 'linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%)',
    border: '2px solid #ff6b6b',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },

  /* ===================== ERROR EMOJI ===================== */
  errorEmoji: {
    fontSize: '48px',
    marginBottom: '16px',
  },

  /* ===================== ERROR HEADING ===================== */
  errorHeading: {
    color: '#d32f2f',
    marginBottom: '16px',
    fontSize: '28px',
  },

  /* ===================== ERROR DESCRIPTION ===================== */
  errorDescription: {
    color: '#666',
    marginBottom: '30px',
    fontSize: '16px',
    lineHeight: '1.6',
  },

  /* ===================== BUTTON CONTAINER ===================== */
  buttonContainer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },

  /* ===================== PRIMARY BUTTON ===================== */
  primaryButton: {
    padding: '12px 24px',
    background: '#9a4207',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },

  /* ===================== SECONDARY BUTTON ===================== */
  secondaryButton: {
    padding: '12px 24px',
    background: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },

  /* ===================== TERTIARY BUTTON ===================== */
  tertiaryButton: {
    padding: '12px 24px',
    background: 'white',
    color: '#333',
    border: '2px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },

  /* ===================== ERROR DETAILS SECTION ===================== */
  detailsSection: {
    marginTop: '30px',
    textAlign: 'left',
  },

  /* ===================== ERROR DETAILS SUMMARY ===================== */
  detailsSummary: {
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: '10px',
    fontSize: '14px',
  },

  /* ===================== ERROR STACK TRACE ===================== */
  stackTrace: {
    background: '#2d2d2d',
    color: '#f8f8f2',
    padding: '20px',
    borderRadius: '8px',
    overflow: 'auto',
    fontSize: '12px',
    lineHeight: '1.5',
    textAlign: 'left',
  },

  /* ===================== STACK LABEL ===================== */
  stackLabel: {
    color: '#ff6b6b',
  },

  /* ===================== FOOTER TEXT ===================== */
  footerText: {
    marginTop: '30px',
    color: '#999',
    fontSize: '14px',
  },
};
class PageErrorBoundaryClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Page Error Boundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo
    });
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
      return (
        <div className="page-container">
          <div className="page-inner">
            <div style={styles.errorWrapper}>
              <div style={styles.errorBox}>
                <div style={styles.errorEmoji}>😕</div>

                <h1 style={styles.errorHeading}>
                  Oops! This page crashed
                </h1>

                <p style={styles.errorDescription}>
                  Something unexpected happened while loading this page.
                  <br />
                  Don't worry – your data is safe, and you can try one of the options below.
                </p>

                /* Recovery actions: provide immediate ways to recover from page-level failures. */
                /* Buttons reset error state or navigate to safe views to restore a usable application state. */
                <div style={styles.buttonContainer}>
                  <button
                    onClick={this.handleReset}
                    style={styles.primaryButton}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#7a3406';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#9a4207';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    🔄 Reload Page
                  </button>

                  <button
                    onClick={() => window.location.href = '/'}
                    style={styles.secondaryButton}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#5a6268';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#6c757d';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    🏠 Go Home
                  </button>

                  <button
                    onClick={() => window.history.back()}
                    style={styles.tertiaryButton}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#9a4207';
                      e.currentTarget.style.color = '#9a4207';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#ddd';
                      e.currentTarget.style.color = '#333';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    ← Go Back
                  </button>
                </div>

                {/* Development mode error details */}
                {IS_DEVELOPMENT && this.state.error && (
                  <details style={styles.detailsSection}>
                    <summary style={styles.detailsSummary}>
                      🐛 Error Details (Development Mode)
                    </summary>
                    <pre style={styles.stackTrace}>
                      <strong style={styles.stackLabel}>Error:</strong>
                      {'\n'}
                      {this.state.error.toString()}
                      {'\n\n'}
                      <strong style={styles.stackLabel}>Component Stack:</strong>
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}
              </div>

              <p style={styles.footerText}>
                If this problem persists, please contact support or try clearing your browser cache.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper to allow using with hooks if needed
export default function PageErrorBoundary({ children }) {
  return <PageErrorBoundaryClass>{children}</PageErrorBoundaryClass>;
}
