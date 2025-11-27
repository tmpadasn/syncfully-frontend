/**
 * Centralized data normalization utilities
 * Handles data transformation and standardization across the application
 */

import { DEFAULT_AVATAR_URL } from '../config/constants';
import logger from './logger';

/* ===================== WORK NORMALIZATION ===================== */

/**
 * Normalize a single work object from various API response formats
 * @param {Object} work - Raw work data from API
 * @returns {Object|null} Normalized work object
 */
export const normalizeWork = (work) => {
  if (!work) return null;

  const workId = work.id || work.workId || work._id;
  if (!workId) return null;

  return {
    workId: workId,
    title: work.title || work.name || 'Untitled Work',
    creator: work.creator || work.author || work.artist || 'Unknown Creator',
    coverUrl: work.coverUrl || work.cover || '/album_covers/default.jpg',
    type: work.type || work.workType || work.category || 'unknown',
    rating: Number(work.averageRating || work.rating || work.avgRating || work.score || 0),
    year: work.year || work.releaseYear || work.publishedYear || null,
    genres: normalizeGenres(work.genres || work.genre),
    description: work.description || '',
    foundAt: work.foundAt || work.externalLink || null,
  };
};

/**
 * Normalize an array of works
 * @param {Array} works - Array of raw work data
 * @returns {Array} Array of normalized works
 */
export const normalizeWorks = (works) => {
  if (!Array.isArray(works)) return [];
  return works.map(normalizeWork).filter(Boolean);
};

/**
 * Normalize work data with additional metadata for display
 * @param {Object} work - Raw work data
 * @returns {Object|null} Work with formatted metadata
 */
export const normalizeWorkWithMeta = (work) => {
  const normalized = normalizeWork(work);
  if (!normalized) return null;

  const genresArray = Array.isArray(normalized.genres) 
    ? normalized.genres 
    : [];

  return {
    ...normalized,
    genre: genresArray.join(', ') || 'Unknown Genre',
    meta: `${normalized.year || 'Unknown Year'} • ${normalized.type || 'Unknown Type'} • ${genresArray.join(', ') || 'Unknown Genre'}`,
    subtitle: normalized.creator,
  };
};

/**
 * Normalize work for search results with entity structure
 * @param {Object} item - Raw work data
 * @returns {Object|null} Normalized work entity
 */
export const normalizeWorkEntity = (item) => {
  if (!item) return null;

  const entityId = item.entityId || item.id || item.workId || item._id;
  if (!entityId) return null;

  const genresArray = normalizeGenres(item.genres || item.genre);
  const yearValue = item.year || item.releaseYear || item.publishedYear;
  const workType = item.type || item.workType || item.category;
  const ratingValue = Number(item.averageRating || item.rating || item.avgRating || item.score || 0);

  return {
    entityId: String(entityId),
    kind: 'work',
    title: item.title || item.name || 'Untitled Work',
    coverUrl: item.coverUrl || item.cover || '/album_covers/default.jpg',
    subtitle: item.creator || item.author || item.artist || 'Unknown Creator',
    meta: `${yearValue || 'Unknown Year'} • ${workType || 'Unknown Type'} • ${genresArray.length > 0 ? genresArray.join(', ') : 'Unknown Genre'}`,
    description: item.description || '',
    rating: Number.isNaN(ratingValue) ? 0 : ratingValue,
    workType: workType ? String(workType).toLowerCase() : 'unknown',
    year: yearValue ? Number(yearValue) : null,
    genres: genresArray.map(g => g.toLowerCase()),
    raw: item,
  };
};

/* ===================== GENRE NORMALIZATION ===================== */

/**
 * Normalize genres to a consistent array format
 * @param {Array|string} genres - Genres as array or comma-separated string
 * @returns {Array} Array of genre strings
 */
export const normalizeGenres = (genres) => {
  if (Array.isArray(genres)) {
    return genres.filter(Boolean);
  }
  if (typeof genres === 'string' && genres.trim()) {
    return genres.split(/[,;]/).map(g => g.trim()).filter(Boolean);
  }
  return [];
};

/* ===================== API RESPONSE NORMALIZATION ===================== */

/**
 * Extract works array from various API response formats
 * @param {Object|Array} response - API response
 * @returns {Array} Array of raw works
 */
export const extractWorksFromResponse = (response) => {
  if (!response) return [];
  
  // Already an array
  if (Array.isArray(response)) return response;
  
  // Check common nested structures
  const data = response.data || response;
  
  if (Array.isArray(data)) return data;
  if (data.works && Array.isArray(data.works)) return data.works;
  if (data.items && Array.isArray(data.items)) return data.items;
  
  return [];
};

/**
 * Extract ratings array from various API response formats
 * @param {Object|Array} response - API response
 * @returns {Array} Array of ratings
 */
export const extractRatingsFromResponse = (response) => {
  if (!response) return [];
  
  if (Array.isArray(response)) return response;
  
  const data = response.data || response;
  
  if (Array.isArray(data)) return data;
  if (data.ratings && Array.isArray(data.ratings)) return data.ratings;
  
  return [];
};

/**
 * Extract shelves array from various API response formats
 * @param {Object|Array} response - API response
 * @returns {Array} Array of shelves
 */
export const extractShelvesFromResponse = (response) => {
  if (!response) return [];
  
  if (Array.isArray(response)) return response;
  
  const data = response.data || response;
  
  if (Array.isArray(data)) return data;
  if (data.shelves && Array.isArray(data.shelves)) return data.shelves;
  
  return [];
};

/**
 * Extract a single work from various API response formats
 * @param {Object} response - API response
 * @returns {Object|null} Single work object
 */
export const extractWorkFromResponse = (response) => {
  if (!response) return null;

  let data = response.data || response;

  // Check for work in various nested structures
  if (data.works && Array.isArray(data.works) && data.works[0]) {
    return data.works[0];
  }
  if (data.work) {
    return data.work;
  }
  
  // Check if data itself is a work object (has workId or id)
  if (data.workId || data.id) {
    return data;
  }

  return null;
};

/* ===================== USER NORMALIZATION ===================== */

/**
 * Normalize user data from API
 * @param {Object} user - Raw user data
 * @returns {Object|null} Normalized user object
 */
export const normalizeUser = (user) => {
  if (!user) return null;

  const userId = user.userId || user.id || user._id;
  if (!userId) return null;

  return {
    userId: userId,
    username: user.username || user.name || 'Unknown User',
    email: user.email || '',
    profilePictureUrl: user.profilePictureUrl || user.avatar || DEFAULT_AVATAR_URL,
    bio: user.bio || user.description || '',
    ratedWorks: user.ratedWorks || 0,
  };
};

/**
 * Normalize an array of users
 * @param {Array} users - Array of raw user data
 * @returns {Array} Array of normalized users
 */
export const normalizeUsers = (users) => {
  if (!Array.isArray(users)) return [];
  return users.map(normalizeUser).filter(Boolean);
};

/* ===================== RATING NORMALIZATION ===================== */

/**
 * Normalize a single rating object
 * @param {Object} rating - Raw rating data
 * @returns {Object|null} Normalized rating
 */
export const normalizeRating = (rating) => {
  if (!rating) return null;

  return {
    ratingId: rating.ratingId || rating.id || rating._id,
    userId: rating.userId || rating.user?.userId,
    workId: rating.workId || rating.work?.workId,
    score: Number(rating.score || rating.rating || 0),
    comment: rating.comment || rating.review || '',
    ratedAt: rating.ratedAt || rating.createdAt || new Date().toISOString(),
  };
};

/**
 * Normalize ratings object (key-value pairs) to array
 * @param {Object} ratingsData - Ratings object with workId as keys
 * @returns {Array} Array of normalized ratings
 */
export const normalizeRatingsObject = (ratingsData) => {
  if (!ratingsData || typeof ratingsData !== 'object') return [];

  return Object.entries(ratingsData).map(([workId, rating]) => ({
    workId: parseInt(workId),
    score: rating.score || rating.rating || 0,
    comment: rating.comment || rating.review || '',
    ratedAt: rating.ratedAt ? new Date(rating.ratedAt) : new Date(),
  }));
};

/* ===================== SHELF NORMALIZATION ===================== */

/**
 * Normalize shelf data from API
 * @param {Object} shelf - Raw shelf data
 * @returns {Object|null} Normalized shelf object
 */
export const normalizeShelf = (shelf) => {
  if (!shelf) return null;

  const shelfId = shelf.shelfId || shelf.id || shelf._id;
  if (!shelfId) return null;

  return {
    shelfId: shelfId,
    name: shelf.name || 'Untitled Shelf',
    description: shelf.description || '',
    userId: shelf.userId || shelf.user?.userId,
    works: Array.isArray(shelf.works) ? shelf.works : [],
    createdAt: shelf.createdAt || new Date().toISOString(),
  };
};

/* ===================== COLLECTION UTILITIES ===================== */

/**
 * Extract work IDs from a shelf's works array
 * Handles both populated work objects and primitive IDs
 * @param {Array} works - Array of works or IDs
 * @returns {Set} Set of work IDs as strings
 */
export const extractWorkIdsFromShelf = (works) => {
  if (!Array.isArray(works)) return new Set();

  const ids = works.map(w => {
    if (w === null || w === undefined) return null;

    // Handle primitive IDs
    if (typeof w === 'string' || typeof w === 'number') {
      return String(w);
    }

    // Handle nested work objects
    const nestedWork = typeof w.work === 'object' ? w.work : null;
    const nestedWorkId = nestedWork ? (nestedWork.id || nestedWork._id) : null;
    const id = w.id || w.workId || w._id || w.entityId || nestedWorkId;
    
    return id ? String(id) : null;
  }).filter(Boolean);

  return new Set(ids);
};

/**
 * Merge unique works from multiple arrays
 * @param {Array} primary - Primary array of works
 * @param {Array} secondary - Secondary array of works
 * @returns {Array} Merged array with unique works
 */
export const mergeUniqueWorks = (primary, secondary) => {
  const seen = new Set(primary.map(work => work.entityId || work.workId || work.id));
  const merged = [...primary];
  
  secondary.forEach(work => {
    const id = work.entityId || work.workId || work.id;
    if (work && id && !seen.has(id)) {
      seen.add(id);
      merged.push(work);
    }
  });
  
  return merged;
};

/**
 * Shuffle array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Get random items from array
 * @param {Array} array - Source array
 * @param {number} count - Number of items to get
 * @returns {Array} Random items
 */
export const getRandomItems = (array, count) => {
  if (!Array.isArray(array) || array.length === 0) return [];
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, count);
};

/* ===================== FILTER UTILITIES ===================== */

/**
 * Apply client-side filters to works array
 * @param {Array} works - Array of normalized works
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered works
 */
export const applyWorkFilters = (works, filters) => {
  if (!Array.isArray(works)) return [];

  const { type, genre, year, rating } = filters;
  
  const genreFilterValue = genre ? String(genre).toLowerCase() : '';
  const ratingFilterValue = rating ? Number(rating) : null;
  const yearFilterValue = year ? Number(year) : null;
  const typeFilterValue = type ? String(type).toLowerCase() : '';

  return works.filter(work => {
    if (!work) return false;

    // Type filter
    if (typeFilterValue && typeFilterValue !== 'user') {
      const workType = (work.workType || work.type || '').toLowerCase();
      if (!workType || workType !== typeFilterValue) {
        return false;
      }
    }

    // Genre filter
    if (genreFilterValue) {
      const workGenres = Array.isArray(work.genres) 
        ? work.genres.map(g => g.toLowerCase())
        : [];
      if (!workGenres.some(g => g === genreFilterValue)) {
        return false;
      }
    }

    // Rating filter
    if (ratingFilterValue !== null) {
      const workRating = Number(work.rating || 0);
      if (workRating < ratingFilterValue) {
        return false;
      }
    }

    // Year filter
    if (yearFilterValue !== null) {
      const workYear = Number(work.year || 0);
      if (!workYear || workYear < yearFilterValue) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Log normalization debug info
 * @param {string} context - Context label
 * @param {*} input - Input data
 * @param {*} output - Output data
 */
export const logNormalization = (context, input, output) => {
  // Debug logging disabled for production
};
