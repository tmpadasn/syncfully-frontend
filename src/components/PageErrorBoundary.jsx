import React from 'react';
import { useNavigate } from 'react-router-dom';
import logger from '../utils/logger';
import { IS_DEVELOPMENT } from '../config/constants';

/**
 * Page-level Error Boundary
 * Optimized for catching errors at the route/page level
 * Provides navigation options to help users recover
 */
class PageErrorBoundaryClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
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
            <div
              style={{
                padding: '60px 20px',
                textAlign: 'center',
                maxWidth: '700px',
                margin: '0 auto'
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%)',
                  border: '2px solid #ff6b6b',
                  borderRadius: '12px',
                  padding: '40px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
                
                <h1 style={{ 
                  color: '#d32f2f', 
                  marginBottom: '16px',
                  fontSize: '28px'
                }}>
                  Oops! This page crashed
                </h1>
                
                <p style={{ 
                  color: '#666', 
                  marginBottom: '30px',
                  fontSize: '16px',
                  lineHeight: '1.6'
                }}>
                  Something unexpected happened while loading this page.
                  <br />
                  Don't worry – your data is safe, and you can try one of the options below.
                </p>

                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginBottom: '20px'
                }}>
                  <button
                    onClick={this.handleReset}
                    style={{
                      padding: '12px 24px',
                      background: '#9a4207',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
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
                    style={{
                      padding: '12px 24px',
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
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
                    style={{
                      padding: '12px 24px',
                      background: 'white',
                      color: '#333',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
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
                  <details style={{ marginTop: '30px', textAlign: 'left' }}>
                    <summary style={{ 
                      cursor: 'pointer', 
                      fontWeight: 'bold', 
                      color: '#d32f2f',
                      marginBottom: '10px',
                      fontSize: '14px'
                    }}>
                      🐛 Error Details (Development Mode)
                    </summary>
                    <pre
                      style={{
                        background: '#2d2d2d',
                        color: '#f8f8f2',
                        padding: '20px',
                        borderRadius: '8px',
                        overflow: 'auto',
                        fontSize: '12px',
                        lineHeight: '1.5',
                        textAlign: 'left'
                      }}
                    >
                      <strong style={{ color: '#ff6b6b' }}>Error:</strong>
                      {'\n'}
                      {this.state.error.toString()}
                      {'\n\n'}
                      <strong style={{ color: '#ff6b6b' }}>Component Stack:</strong>
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}
              </div>

              <p style={{ 
                marginTop: '30px', 
                color: '#999', 
                fontSize: '14px' 
              }}>
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
