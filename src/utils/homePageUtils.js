/**
 * homePageUtils.js
 *
 * Utility functions for Home page data processing
 * Extracted from Home.jsx to enable reuse and testing in isolation
 *
 * Functions:
 * - processPopularWorks: Normalizes popular works API response
 * - processFollowingData: Fetches and processes friend activity data
 * - getRandomWorks: Filters and shuffles works by type
 */

import logger from '../utils/logger';
import {
  extractWorksFromResponse,
  normalizeWork,
  normalizeWorks,
  normalizeRatingsObject,
  shuffleArray,
} from '../utils/normalize';
import { DEFAULT_AVATAR_URL } from '../config/constants';

/**
 * Process popular works response into normalized array
 * @param {Object} data - API response containing popular works
 * @returns {Array} Normalized array of work objects with id, title, coverUrl, etc.
 */
export const processPopularWorks = (data) => {
  const works = extractWorksFromResponse(data);
  return normalizeWorks(works);
};

/**
 * Fetch and process following users' recent ratings
 * Retrieves each followed user's ratings and combines them using round-robin mixing
 * Returns array of friend cards with liked album info for carousel display
 *
 * Uses isMountedRef to prevent state updates after component unmounts
 *
 * @param {Array} following - Array of followed user objects with userId/id
 * @param {Array} allWorks - All available works for matching against ratings
 * @param {Object} isMountedRef - useRef tracking component mount status (prevents memory leaks)
 * @returns {Promise<Array>} Array of friend card objects with: id, followerId, name, avatar, likedAlbum
 */
export const processFollowingData = async (following, allWorks, isMountedRef) => {
  const followingWithActivity = [];

  if (!following || following.length === 0) return [];

  const followingRatings = [];

  for (const followedUser of following) {
    if (!isMountedRef.current) break;

    try {
      const { getUserRatings } = await import('../api/users');
      const ratingsResponse = await getUserRatings(followedUser.userId || followedUser.id);

      if (!isMountedRef.current) break;

      const ratingsData = ratingsResponse?.data || ratingsResponse || {};
      const entries = normalizeRatingsObject(ratingsData);
      if (entries.length === 0) continue;

      const sortedRatings = entries.sort((a, b) => b.ratedAt - a.ratedAt);

      const userWorks = [];
      for (let i = 0; i < Math.min(5, sortedRatings.length); i++) {
        const rating = sortedRatings[i];
        const ratedWork = allWorks.find(w => (w.id || w.workId) === rating.workId);

        if (ratedWork) {
          const normalizedWork = normalizeWork(ratedWork);
          userWorks.push({
            id: `${followedUser.userId || followedUser.id}-${i}`,
            followerId: followedUser.userId || followedUser.id,
            name: followedUser.username,
            avatar: followedUser.profilePictureUrl || DEFAULT_AVATAR_URL,
            likedAlbum: {
              title: normalizedWork.title,
              coverUrl: normalizedWork.coverUrl,
              workId: normalizedWork.workId
            }
          });
        }
      }

      if (userWorks.length > 0) {
        followingRatings.push(userWorks);
      }
    } catch (error) {
      logger.error('Failed to fetch ratings for followed user:', followedUser.userId || followedUser.id, error);
    }
  }

  let maxWorks = Math.max(...followingRatings.map(f => f.length));
  for (let i = 0; i < maxWorks; i++) {
    for (let j = 0; j < followingRatings.length; j++) {
      if (i < followingRatings[j].length) {
        followingWithActivity.push(followingRatings[j][i]);
      }
    }
  }

  return followingWithActivity;
};

/**
 * Get random works filtered by type and shuffled
 * Used to populate "recent movies" and "recent music" carousels
 *
 * @param {Array} allWorks - All available works to filter from
 * @param {String} type - Work type to filter (from WORK_TYPES constant: 'MOVIE', 'MUSIC', etc.)
 * @param {Number} limit - Maximum number of works to return (default: 10)
 * @returns {Array} Normalized array of random works of specified type, up to limit length
 */
export const getRandomWorks = (allWorks, type, limit = 10) => {
  try {
    const filteredWorks = allWorks.filter(work => work.type === type);
    const shuffled = shuffleArray(filteredWorks);
    return shuffled.slice(0, limit).map(normalizeWork).filter(Boolean);
  } catch (error) {
    logger.error('Error getting random works:', error);
    return [];
  }
};
