/**
 * Application-wide constants
 * Centralizes hardcoded values, magic strings, and configuration
 */

// ============================================================================
// API Configuration
// ============================================================================

/**
 * Base API URL - configured via environment variable
 * Falls back to localhost in development if not set
 */
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * API request timeout in milliseconds
 */
export const API_TIMEOUT = 15000;

// ============================================================================
// Default Assets & URLs
// ============================================================================

/**
 * Default profile picture URL from backend
 * Can be overridden via environment variable
 */
export const DEFAULT_PROFILE_PICTURE = process.env.REACT_APP_DEFAULT_PROFILE_URL || 
  'http://localhost:3000/uploads/profiles/profile_picture.jpg';

/**
 * Default avatar URL from external source (Wikipedia)
 * Used as fallback when backend profile picture is unavailable
 */
export const DEFAULT_AVATAR_URL = process.env.REACT_APP_DEFAULT_AVATAR_URL || 
  'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';

// ============================================================================
// Local Storage Keys
// ============================================================================

/**
 * Key for storing authenticated user data in localStorage
 */
export const STORAGE_KEY_AUTH_USER = 'authUser';

/**
 * Key for tracking login state in sessionStorage
 */
export const STORAGE_KEY_JUST_LOGGED_IN = 'justLoggedIn';

// ============================================================================
// Error Codes
// ============================================================================

/**
 * Error code when user is not found
 */
export const ERROR_CODE_USER_NOT_FOUND = 'USER_NOT_FOUND';

/**
 * Error code for invalid credentials
 */
export const ERROR_CODE_BAD_CREDENTIALS = 'BAD_CREDENTIALS';

// ============================================================================
// Error Messages
// ============================================================================

/**
 * User-friendly error messages
 */
export const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'The user does not exist, please create an account',
  BAD_CREDENTIALS: 'The credentials dont match',
  AUTH_FAILED: 'Authentication failed.',
};

/**
 * Keywords that indicate specific error types from backend messages
 */
export const ERROR_KEYWORDS = {
  USER_NOT_FOUND: ['does not exist', 'no user', 'not found', 'not exist'],
  BAD_CREDENTIALS: ['credentials', 'password', 'incorrect', 'wrong'],
};

// ============================================================================
// HTTP Configuration
// ============================================================================

/**
 * Default HTTP headers for API requests
 */
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// ============================================================================
// Work Categories
// ============================================================================

/**
 * Work type categories
 */
export const WORK_TYPES = {
  MOVIE: 'movie',
  MUSIC: 'music',
  BOOK: 'book',
  GAME: 'game',
};

// ============================================================================
// Shelf Names
// ============================================================================

/**
 * Special shelf names
 */
export const SHELF_NAMES = {
  FAVOURITES: 'favourites',
};

// ============================================================================
// Display Limits
// ============================================================================

/**
 * Number of works to display in home page carousels
 */
export const HOME_CAROUSEL_LIMIT = 10;

// ============================================================================
// Environment Flags
// ============================================================================

/**
 * Whether debug logging is enabled
 */
export const IS_DEBUG_ENABLED = process.env.REACT_APP_ENABLE_DEBUG_LOGS === 'true';

/**
 * Whether running in development mode
 */
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
