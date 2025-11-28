import { IS_DEBUG_ENABLED } from '../config/constants';
/**
 * Centralized logging utility
 * Respects REACT_APP_ENABLE_DEBUG_LOGS environment variable
 * In production, logs are disabled by default
 */

const logger = {
  // Log informational messages (only in debug mode)
  log: (...args) => {
    if (IS_DEBUG_ENABLED) {
      console.log(...args);
    }
  },

  // Log warning messages (only in debug mode)
  warn: (...args) => {
    if (IS_DEBUG_ENABLED) {
      console.warn(...args);
    }
  },

  // Log error messages (always enabled for production debugging)
  error: (...args) => {
    console.error(...args);
  },

  // Log debug information with emoji prefix (only in debug mode)
  debug: (emoji, ...args) => {
    if (IS_DEBUG_ENABLED) {
      console.log(emoji, ...args);
    }
  },

  // Group logs together (only in debug mode)
  group: (label, callback) => {
    if (IS_DEBUG_ENABLED) {
      console.group(label);
      callback();
      console.groupEnd();
    }
  },

  // Log API calls (only in debug mode)
  api: (method, url, data) => {
    if (IS_DEBUG_ENABLED) {
      console.log(`🔄 API ${method.toUpperCase()}: ${url}`, data || '');
    }
  },

  // Log navigation events (only in debug mode)
  nav: (message, ...args) => {
    if (IS_DEBUG_ENABLED) {
      console.log(`🔍 Navigation: ${message}`, ...args);
    }
  }
};

export default logger;
