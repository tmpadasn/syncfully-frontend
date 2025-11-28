import api from './client';
import logger from '../utils/logger';

/**
 * Get all ratings (admin function)
 */
export const getAllRatings = async () => {
  try {
    const res = await api.get('/ratings');
    return res.data;
  } catch (error) {
    logger.error('Error fetching all ratings:', error);
    return { ratings: [] };
  }
};

/**
 * Get rating by ID
 */
export const getRatingById = async (ratingId) => {
  try {
    const res = await api.get(`/ratings/${ratingId}`);
    return res.data;
  } catch (error) {
    logger.error('Error fetching rating by ID:', error);
    throw error;
  }
};

/**
 * Update a rating
 */
export const updateRating = async (ratingId, ratingData) => {
  try {
    const res = await api.put(`/ratings/${ratingId}`, ratingData);
    return res.data;
  } catch (error) {
    logger.error('Error updating rating:', error);
    throw error;
  }
};

/**
 * Delete a rating
 */
export const deleteRating = async (ratingId) => {
  try {
    const res = await api.delete(`/ratings/${ratingId}`);
    return res.data;
  } catch (error) {
    logger.error('Error deleting rating:', error);
    throw error;
  }
};

/**
 * Create a work rating (alternative endpoint)
 */
export const createRating = async (workId, userId, score, comment = null) => {
  try {
    const res = await api.post(`/works/${workId}/ratings`, {
      userId,
      score,
      comment
    });
    return res.data;
  } catch (error) {
    logger.error('Error creating rating:', error);
    throw error;
  }
};

/**
 * Get work average rating
 */
export const getWorkAverageRating = async (workId) => {
  try {
    const res = await api.get(`/works/${workId}/ratings/average`);
    return res.data;
  } catch (error) {
    logger.error('Error fetching work average rating:', error);
    return { average: 0, count: 0 };
  }
};