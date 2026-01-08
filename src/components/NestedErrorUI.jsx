import React from 'react';
import { ErrorButton } from './ErrorBoundary';
import { IS_DEVELOPMENT } from '../config/constants';

/**
 * NestedErrorUI - Compact component-level error display
 * Used for errors within larger components - shows brief message and recovery actions
 *
 * Props:
 *   - error: Error object
 *   - errorInfo: Error info with component stack
 *   - onReset: Callback to reset error state
 */
const NestedErrorUI = ({ error, errorInfo, onReset }) => {
  // ========== BUTTON STYLES ==========
  // Define primary button style with brown background for main action
  const primaryButtonStyle = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    background: '#9a4207',
    color: 'white',
  };

  // Define secondary button style with gray background for secondary action
  const secondaryButtonStyle = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    background: '#6c757d',
    color: 'white',
  };

  return (
    // ========== OUTER CONTAINER ==========
    // Centered container with padding and max-width for responsive design
    <div style={{
      padding: '40px 16px',
      maxWidth: '600px',
      margin: '0 auto',
      textAlign: 'center',
    }}>
      {/* ========== ERROR BOX ========== */}
      {/* Yellow warning-style box with border and padding */}
      <div style={{
        background: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: 8,
        padding: 40,
        marginBottom: 16,
      }}>
        {/* Error heading with warning emoji */}
        <h2 style={{
          color: '#856404',
          marginBottom: 16,
        }}>
          ⚠️ Something went wrong
        </h2>
        {/* Reassuring error message */}
        <p style={{
          color: '#856404',
          marginBottom: 20,
        }}>
          We encountered an unexpected error. Don't worry, your data is safe.
        </p>
        {/* ========== ACTION BUTTONS ========== */}
        {/* Flex container for Try Again and Go Home buttons */}
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {/* Try Again button - resets error boundary */}
          <ErrorButton
            label="Try Again"
            style={primaryButtonStyle}
            onClick={onReset}
            bgColor="#9a4207"
            bgColorHover="#7a3406"
          />
          {/* Go Home button - navigates to root */}
          <ErrorButton
            label="Go Home"
            style={secondaryButtonStyle}
            onClick={() => (window.location.href = '/')}
            bgColor="#6c757d"
            bgColorHover="#5a6268"
          />
        </div>
      </div>
      {/* ========== DEVELOPMENT ERROR DETAILS ========== */}
      {/* Expandable details section shown only in development mode */}
      {IS_DEVELOPMENT && error && (
        <details style={{ marginTop: 16, textAlign: 'left' }}>
          {/* Summary toggle for error details */}
          <summary style={{
            cursor: 'pointer',
            fontWeight: 'bold',
            marginBottom: 12,
          }}>
            Error Details (Dev)
          </summary>
          {/* Pre-formatted error message and component stack */}
          <pre style={{
            background: '#f5f5f5',
            padding: 16,
            borderRadius: 8,
            overflow: 'auto',
            fontSize: '12px',
          }}>
            {error.toString()}
            {'\n\n'}
            {errorInfo?.componentStack}
          </pre>
        </details>
      )}
    </div>
  );
};

export default NestedErrorUI;
