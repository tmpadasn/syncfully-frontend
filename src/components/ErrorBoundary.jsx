/**
 * ErrorBoundary - Unified error handling component for nested and page-level errors.
 * Catches all unhandled errors in child components and displays appropriate recovery UI.
 * Features: Configurable UI levels, custom fallback support, development error details,
 * and smart recovery actions.
 *
 * Props:
 *   - children: Component(s) to wrap
 *   - fallback: Custom fallback UI for nested errors (overrides UI level config)
 *   - level: 'page' (full-page UI) or 'nested' (compact UI). Defaults to 'nested'
 */
import React from 'react';
import logger from '../utils/logger';
import NestedErrorUI from './NestedErrorUI';
import PageErrorUI from './PageErrorUI';

// ========== ERROR BUTTON ==========
// Interactive button with hover effects and color transitions
// Used in error UI components for consistent styling and interaction patterns
const ErrorButton = ({ label, style, onClick, bgColor, bgColorHover }) => {
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
      style={style}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {label}
    </button>
  );
};



// ========== ERROR BOUNDARY CLASS ==========
// React.Component lifecycle methods for error catching and state management
// Implements getDerivedStateFromError and componentDidCatch to catch all errors
// in child component tree
class ErrorBoundaryClass extends React.Component {
  // Initialize state: track error flag, error object, and component stack
  // for debugging
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // ========== LIFECYCLE METHODS ==========
  // React error boundary hooks for catching and handling errors
  // Update state to display error UI when child component throws
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // Log error details for monitoring and save error info to state
  // for debugging display
  componentDidCatch(error, errorInfo) {
    logger.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  // ========== STATE RESET ==========
  // Clear error state to allow user to retry or navigate
  // Reset error boundary to attempt re-rendering children
  // (user triggered via "Try Again" button)
  reset = () => this.setState({ hasError: false, error: null, errorInfo: null });

  // ========== RENDER NESTED ERROR ==========
  // Compact component-level error UI with inline details for dev mode
  // Displays warning message, recovery buttons (Try Again, Go Home),
  // and expandable error stack in development
  renderNestedError() {
    // For custom fallback, return as-is
    if (this.props.fallback) return this.props.fallback;

    return (
      <NestedErrorUI
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        onReset={this.reset}
      />
    );
  }

  // ========== RENDER PAGE ERROR ==========
  // Full-page error UI with emoji, detailed message, and comprehensive options
  // Displays sympathetic error message, three action buttons (Reload, Home, Back),
  // and expandable dev error details
  renderPageError() {
    return (
      <PageErrorUI
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        onReset={this.reset}
      />
    );
  }

  // ========== MAIN RENDER ==========
  // Choose UI level and return error or children based on error state
  // Routes to page or nested error UI based on level prop,
  // or returns children if no error
  render() {
    if (this.state.hasError) {
      return this.props.level === 'page' ? this.renderPageError() : this.renderNestedError();
    }
    return this.props.children;
  }
}

export default ErrorBoundaryClass;
export { ErrorButton };
