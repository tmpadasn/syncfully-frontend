import api, { extractResponseData } from './client';
import logger from '../utils/logger';

/**
 * Get all users
 */
export const getAllUsers = async () => {
  try {
    const res = await api.get('/users');
    return extractResponseData(res);
  } catch (error) {
    logger.error('Error fetching all users:', error);
    throw error;
  }
};

/**
 * Create a new user
 */
export const createUser = async (userData) => {
  try {
    const res = await api.post('/users', userData);
    return res.data;
  } catch (error) {
    logger.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  try {
    const res = await api.get(`/users/${userId}`);
    return extractResponseData(res);
  } catch (error) {
    logger.error('Error fetching user by ID:', error);
    throw error;
  }
};

/**
 * Update user
 */
export const updateUser = async (userId, userData) => {
  try {
    const res = await api.put(`/users/${userId}`, userData);
    return extractResponseData(res);
  } catch (error) {
    logger.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Delete user
 */
export const deleteUser = async (userId) => {
  try {
    const res = await api.delete(`/users/${userId}`);
    return res.data;
  } catch (error) {
    logger.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Get user's ratings
 */
export const getUserRatings = async (userId) => {
  try {
    const res = await api.get(`/users/${userId}/ratings`);
    return extractResponseData(res);
  } catch (error) {
    logger.error('Error fetching user ratings:', error);
    return { ratings: [] };
  }
};

/**
 * Add user rating for a work
 */
export const addUserRating = async (userId, ratingData) => {
  try {
    const res = await api.post(`/users/${userId}/ratings`, ratingData);
    return res.data;
  } catch (error) {
    logger.error('Error adding user rating:', error);
    throw error;
  }
};

/**
 * Get user recommendations
 */
export const getUserRecommendations = async (userId) => {
  try {
    const res = await api.get(`/users/${userId}/recommendations`);
    return extractResponseData(res);
  } catch (error) {
    logger.error('Error fetching user recommendations:', error);
    return { recommendations: [] };
  }
};

/**
 * Get user followers
 */
export const getUserFollowers = async (userId) => {
  try {
    const res = await api.get(`/users/${userId}/followers`);
    return extractResponseData(res);
  } catch (error) {
    logger.error('Error fetching user followers:', error);
    return { followers: [] };
  }
};

/**
 * Get users that user is following
 */
export const getUserFollowing = async (userId) => {
  try {
    const res = await api.get(`/users/${userId}/following`);
    return extractResponseData(res);
  } catch (error) {
    logger.error('Error fetching user following:', error);
    return { following: [] };
  }
};

/**
 * Follow a user
 */
export const followUser = async (userId, targetUserId) => {
  try {
    const res = await api.post(`/users/${userId}/following/${targetUserId}`);
    return res.data;
  } catch (error) {
    logger.error('Error following user:', error);
    throw error;
  }
};

/**
 * Unfollow a user
 */
export const unfollowUser = async (userId, targetUserId) => {
  try {
    const res = await api.delete(`/users/${userId}/following/${targetUserId}`);
    return res.data;
  } catch (error) {
    logger.error('Error unfollowing user:', error);
    throw error;
  }
};