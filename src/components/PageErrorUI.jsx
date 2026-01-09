import React from 'react';
import { IS_DEVELOPMENT } from '../config/constants';
import { ErrorButton } from './ErrorButtonStyles';

/**
 * PageErrorUI - Full-page error display
 * Shows sympathetic error message with multiple action buttons and dev error details
 *
 */
const PageErrorUI = ({ error, errorInfo, onReset }) => {

  return (
    // ========== PAGE LAYOUT ==========
    // Main page container with inner wrapper for centering
    <div className="page-container">
      <div className="page-inner">
        {/* ========== WRAPPER CONTAINER ========== */}
        {/* Centered wrapper with padding and max-width */}
        <div style={{
          padding: '60px 16px',
          textAlign: 'center',
          maxWidth: '700px',
          margin: '0 auto',
        }}>
          {/* ========== ERROR BOX ========== */}
          {/* Red gradient error box with shadow */}
          <div style={{
            background: 'linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%)',
            border: '2px solid #d32f2f',
            borderRadius: 12,
            padding: 40,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}>
            {/* Error emoji */}
            <div style={{ fontSize: '48px', marginBottom: 16 }}>
              😕
            </div>
            {/* Main error heading */}
            <h1 style={{ color: '#d32f2f', marginBottom: 16, fontSize: '28px' }}>
              Oops! This page crashed
            </h1>
            {/* Detailed error description */}
            <p style={{
              color: '#666',
              marginBottom: 30,
              fontSize: '16px',
              lineHeight: '1.6',
            }}>
              Something unexpected happened while loading this page.
              <br />
              Don't worry – your data is safe, and you can try one of the
              options below.
            </p>
            {/* ========== ACTION BUTTONS ========== */}
            {/* Flex container for three action buttons */}
            <div style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: 16,
            }}>
              {/* Reload Page button - resets error boundary */}
              <ErrorButton
                label="🔄 Reload Page"
                onClick={onReset}
                bgColor="#9a4207"
                bgColorHover="#7a3406"
                variant="primary"
              />
              {/* Go Home button - navigates to root */}
              <ErrorButton
                label="🏠 Go Home"
                onClick={() => (window.location.href = '/')}
                bgColor="#6c757d"
                bgColorHover="#5a6268"
                variant="secondary"
              />
              {/* Go Back button - navigates to previous page */}
              <ErrorButton
                label="← Go Back"
                onClick={() => window.history.back()}
                bgColor="white"
                bgColorHover="#f5f5f5"
                variant="tertiary"
              />
            </div>
            {/* ========== DEVELOPMENT ERROR DETAILS ========== */}
            {/* Expandable details section shown only in development mode */}
            {IS_DEVELOPMENT && error && (
              <details style={{ marginTop: 30, textAlign: 'left' }}>
                {/* Summary toggle for error details */}
                <summary style={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: '#d32f2f',
                  marginBottom: 12,
                  fontSize: '14px',
                }}>
                  🐛 Error Details (Development Mode)
                </summary>
                {/* Dark pre-formatted code block with error message and stack */}
                <pre style={{
                  background: '#2d2d2d',
                  color: '#f8f8f2',
                  padding: 16,
                  borderRadius: 8,
                  overflow: 'auto',
                  fontSize: '12px',
                  lineHeight: '1.5',
                }}>
                  <strong style={{ color: '#ff6b6b' }}>Error:</strong>
                  {'\n'}
                  {error.toString()}
                  {'\n\n'}
                  <strong style={{ color: '#ff6b6b' }}>Component Stack:</strong>
                  {errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
          {/* ========== FOOTER TEXT ========== */}
          {/* Support contact message */}
          <p style={{
            marginTop: 30,
            color: '#999',
            fontSize: '14px',
          }}>
            If this problem persists, please contact support or try clearing
            your browser cache.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageErrorUI;
