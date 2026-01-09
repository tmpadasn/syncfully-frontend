/**
 * API Index File
 *
 * Centralized export point for all API functions in the application.
 * Simplifies imports by allowing API functions to be imported from a single location.
 *
 * Usage:
 *   Instead of: import { getWork } from '../api/works'
 *   Use: import { getWork } from '../api'
 */

// ========== WORKS API ==========
export {
  getPopularWorks,
  getAllWorks,
  createWork,
  updateWork,
  deleteWork,
  getWork,
  getWorkRatings,
  postWorkRating,
  getSimilarWorks
} from './works.js';

// ========== USERS API ==========
export {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserRatings,
  addUserRating,
  getUserRecommendations,
  getUserFollowers,
  getUserFollowing,
  followUser,
  unfollowUser
} from './users.js';

// ========== SHELVES API ==========
export {
  getUserShelves,
  getShelfById,
  createShelf,
  updateShelf,
  deleteShelf,
  getShelfWorks,
  addWorkToShelf,
  removeWorkFromShelf,
  getOrCreateFavouritesShelf
} from './shelves.js';

// ========== SEARCH API ==========
export {
  searchItems
} from './search.js';

// ========== RATINGS API ==========
export {
  getAllRatings,
  getRatingById,
  updateRating,
  deleteRating
} from './ratings.js';

// ========== AUTH API ==========
export {
  login,
  signup
} from './auth.js';
