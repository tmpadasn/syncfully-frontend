/**
 * Centralized logging utility
 * Respects REACT_APP_ENABLE_DEBUG_LOGS environment variable
 * In production, logs are disabled by default
 */

const isDebugEnabled = process.env.REACT_APP_ENABLE_DEBUG_LOGS === 'true';

const logger = {
  /**
   * Log informational messages (only in debug mode)
   */
  log: (...args) => {
    if (isDebugEnabled) {
      console.log(...args);
    }
  },

  /**
   * Log warning messages (only in debug mode)
   */
  warn: (...args) => {
    if (isDebugEnabled) {
      console.warn(...args);
    }
  },

  /**
   * Log error messages (always enabled for production debugging)
   */
  error: (...args) => {
    console.error(...args);
  },

  /**
   * Log debug information with emoji prefix (only in debug mode)
   */
  debug: (emoji, ...args) => {
    if (isDebugEnabled) {
      console.log(emoji, ...args);
    }
  },

  /**
   * Group logs together (only in debug mode)
   */
  group: (label, callback) => {
    if (isDebugEnabled) {
      console.group(label);
      callback();
      console.groupEnd();
    }
  },

  /**
   * Log API calls (only in debug mode)
   */
  api: (method, url, data) => {
    if (isDebugEnabled) {
      console.log(`🔄 API ${method.toUpperCase()}: ${url}`, data || '');
    }
  },

  /**
   * Log navigation events (only in debug mode)
   */
  nav: (message, ...args) => {
    if (isDebugEnabled) {
      console.log(`🔍 Navigation: ${message}`, ...args);
    }
  }
};

export default logger;
