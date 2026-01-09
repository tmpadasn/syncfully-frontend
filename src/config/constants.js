/**
 * Application-wide Constants
 * Centralized hardcoded values, magic strings, and configuration
 */

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
export const API_TIMEOUT = 15000;

// Default Assets & URLs
export const DEFAULT_PROFILE_PICTURE = process.env.REACT_APP_DEFAULT_PROFILE_URL || 'http://localhost:3000/uploads/profiles/profile_picture.jpg';
export const DEFAULT_AVATAR_URL = process.env.REACT_APP_DEFAULT_AVATAR_URL || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';

// Local Storage Keys
export const STORAGE_KEY_AUTH_USER = 'authUser';
export const STORAGE_KEY_JUST_LOGGED_IN = 'justLoggedIn';

// Error Codes
export const ERROR_CODE_USER_NOT_FOUND = 'USER_NOT_FOUND';
export const ERROR_CODE_BAD_CREDENTIALS = 'BAD_CREDENTIALS';

// Error Messages & Keywords
export const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'The user does not exist, please create an account',
  BAD_CREDENTIALS: 'The credentials dont match',
  AUTH_FAILED: 'Authentication failed.',
};

export const ERROR_KEYWORDS = {
  USER_NOT_FOUND: ['does not exist', 'no user', 'not found', 'not exist'],
  BAD_CREDENTIALS: ['credentials', 'password', 'incorrect', 'wrong'],
};

// HTTP Configuration
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Work Categories
export const WORK_TYPES = {
  MOVIE: 'movie',
  MUSIC: 'music',
  BOOK: 'book',
  GAME: 'game',
  GRAPHIC_NOVEL: 'graphic_novel',
};

// Display Limits
export const HOME_CAROUSEL_LIMIT = 10;

// Environment Flags
export const IS_DEBUG_ENABLED = process.env.REACT_APP_ENABLE_DEBUG_LOGS === 'true';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
