import React from 'react';
import logger from '../utils/logger';
import { IS_DEVELOPMENT } from '../config/constants';

/* Unified ErrorBoundary component that catches errors at any level.
 * Supports both nested component errors and page-level errors with configurable UI.
 * Props:
 *   - children: Component(s) to wrap
 *   - fallback: Custom fallback UI for nested errors (overrides UI level config)
 *   - level: 'page' (full-page UI) or 'nested' (compact UI). Defaults to 'nested'
 */

// Design tokens for consistent styling across UI levels
const COLORS = { primary: '#9a4207', primaryDark: '#7a3406', secondary: '#6c757d', error: '#d32f2f', text: '#666', light: '#999' };
const SPACING = { xs: 10, sm: 12, md: 16, lg: 20, xl: 30, xxl: 40, xxxl: 60 };
const RADII = { sm: 8, md: 12 };

const baseBtn = { padding: `${SPACING.sm}px ${SPACING.md * 1.5}px`, border: 'none', borderRadius: RADII.sm, cursor: 'pointer', fontSize: '15px', fontWeight: '600', transition: 'all 0.2s ease' };

// Styles for nested-level errors (component-scoped)
const nestedStyles = {
  errorContainer: { padding: `${SPACING.xxl}px ${SPACING.md}px`, maxWidth: '600px', margin: '0 auto', textAlign: 'center' },
  errorBox: { background: '#fff3cd', border: '1px solid #ffc107', borderRadius: RADII.sm, padding: SPACING.xxl, marginBottom: SPACING.md },
  errorHeading: { color: '#856404', marginBottom: SPACING.md },
  errorMessage: { color: '#856404', marginBottom: SPACING.lg },
  buttonContainer: { display: 'flex', gap: SPACING.sm, justifyContent: 'center', flexWrap: 'wrap' },
  primaryButton: { ...baseBtn, background: COLORS.primary, color: 'white' },
  secondaryButton: { ...baseBtn, background: COLORS.secondary, color: 'white' },
};

// Styles for page-level errors (full-page UI with more detail)
const pageStyles = {
  errorWrapper: { padding: `${SPACING.xxxl}px ${SPACING.md}px`, textAlign: 'center', maxWidth: '700px', margin: '0 auto' },
  errorBox: { background: 'linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%)', border: `2px solid ${COLORS.error}`, borderRadius: RADII.md, padding: SPACING.xxl, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  errorEmoji: { fontSize: '48px', marginBottom: SPACING.md },
  errorHeading: { color: COLORS.error, marginBottom: SPACING.md, fontSize: '28px' },
  errorDescription: { color: COLORS.text, marginBottom: SPACING.xl, fontSize: '16px', lineHeight: '1.6' },
  buttonContainer: { display: 'flex', gap: SPACING.sm, justifyContent: 'center', flexWrap: 'wrap', marginBottom: SPACING.md },
  primaryButton: { ...baseBtn, background: COLORS.primary, color: 'white' },
  secondaryButton: { ...baseBtn, background: COLORS.secondary, color: 'white' },
  tertiaryButton: { ...baseBtn, background: 'white', color: '#333', border: '2px solid #ddd' },
  detailsSection: { marginTop: SPACING.xl, textAlign: 'left' },
  detailsSummary: { cursor: 'pointer', fontWeight: 'bold', color: COLORS.error, marginBottom: SPACING.sm, fontSize: '14px' },
  stackTrace: { background: '#2d2d2d', color: '#f8f8f2', padding: SPACING.md, borderRadius: RADII.sm, overflow: 'auto', fontSize: '12px', lineHeight: '1.5' },
  stackLabel: { color: '#ff6b6b' },
  footerText: { marginTop: SPACING.xl, color: COLORS.light, fontSize: '14px' },
};

class ErrorBoundaryClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  reset = () => this.setState({ hasError: false, error: null, errorInfo: null });

  renderButton(label, style, onClick, bgColor, bgColorHover) {
    return (
      <button
        style={style}
        onClick={onClick}
        onMouseEnter={(e) => { e.currentTarget.style.background = bgColorHover; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = bgColor; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        {label}
      </button>
    );
  }

  renderNestedError() {
    // For custom fallback, return as-is
    if (this.props.fallback) return this.props.fallback;

    return (
      <div style={nestedStyles.errorContainer}>
        <div style={nestedStyles.errorBox}>
          <h2 style={nestedStyles.errorHeading}>⚠️ Something went wrong</h2>
          <p style={nestedStyles.errorMessage}>We encountered an unexpected error. Don't worry, your data is safe.</p>
          <div style={nestedStyles.buttonContainer}>
            {this.renderButton('Try Again', nestedStyles.primaryButton, this.reset, COLORS.primary, COLORS.primaryDark)}
            {this.renderButton('Go Home', nestedStyles.secondaryButton, () => window.location.href = '/', COLORS.secondary, '#5a6268')}
          </div>
        </div>
        {IS_DEVELOPMENT && this.state.error && (
          <details style={{ marginTop: SPACING.md, textAlign: 'left' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: SPACING.sm }}>Error Details (Dev)</summary>
            <pre style={{ background: '#f5f5f5', padding: SPACING.md, borderRadius: RADII.sm, overflow: 'auto', fontSize: '12px' }}>
              {this.state.error.toString()}{'\n\n'}{this.state.errorInfo?.componentStack}
            </pre>
          </details>
        )}
      </div>
    );
  }

  renderPageError() {
    return (
      <div className="page-container">
        <div className="page-inner">
          <div style={pageStyles.errorWrapper}>
            <div style={pageStyles.errorBox}>
              <div style={pageStyles.errorEmoji}>😕</div>
              <h1 style={pageStyles.errorHeading}>Oops! This page crashed</h1>
              <p style={pageStyles.errorDescription}>
                Something unexpected happened while loading this page.<br />
                Don't worry – your data is safe, and you can try one of the options below.
              </p>
              <div style={pageStyles.buttonContainer}>
                {this.renderButton('🔄 Reload Page', pageStyles.primaryButton, this.reset, COLORS.primary, COLORS.primaryDark)}
                {this.renderButton('🏠 Go Home', pageStyles.secondaryButton, () => window.location.href = '/', COLORS.secondary, '#5a6268')}
                {this.renderButton('← Go Back', pageStyles.tertiaryButton, () => window.history.back(), 'white', '#f5f5f5')}
              </div>
              {IS_DEVELOPMENT && this.state.error && (
                <details style={pageStyles.detailsSection}>
                  <summary style={pageStyles.detailsSummary}>🐛 Error Details (Development Mode)</summary>
                  <pre style={pageStyles.stackTrace}>
                    <strong style={pageStyles.stackLabel}>Error:</strong>{'\n'}
                    {this.state.error.toString()}{'\n\n'}
                    <strong style={pageStyles.stackLabel}>Component Stack:</strong>{this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
            <p style={pageStyles.footerText}>
              If this problem persists, please contact support or try clearing your browser cache.
            </p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.props.level === 'page' ? this.renderPageError() : this.renderNestedError();
    }
    return this.props.children;
  }
}

export default ErrorBoundaryClass;
