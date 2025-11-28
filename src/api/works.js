import api, { extractResponseData } from './client';
import logger from '../utils/logger';

/**
 * Get popular works
 */
export const getPopularWorks = async () => {
  try {
    const res = await api.get('/works/popular');
    const data = extractResponseData(res);
    if (Array.isArray(data)) return { works: data };
    if (data?.works && Array.isArray(data.works)) return { works: data.works };
    return { works: [] };
  } catch (error) {
    logger.error('Error fetching popular works:', error);
    return { works: [] };
  }
};

/**
 * Get all works with optional filters
 */
export const getAllWorks = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const url = params.toString() ? `/works?${params}` : '/works';
    const res = await api.get(url);
    const data = extractResponseData(res);
    
    if (Array.isArray(data)) return { works: data };
    if (data?.works && Array.isArray(data.works)) return { works: data.works };
    return { works: [] };
  } catch (error) {
    logger.error('Error fetching all works:', error);
    return { works: [] };
  }
};

/**
 * Create a new work
 */
export const createWork = async (workData) => {
  try {
    const res = await api.post('/works', workData);
    return res.data;
  } catch (error) {
    logger.error('Error creating work:', error);
    throw error;
  }
};

/**
 * Update work
 */
export const updateWork = async (workId, workData) => {
  try {
    const res = await api.put(`/works/${encodeURIComponent(workId)}`, workData);
    return res.data;
  } catch (error) {
    logger.error('Error updating work:', error);
    throw error;
  }
};

/**
 * Delete work
 */
export const deleteWork = async (workId) => {
  try {
    const res = await api.delete(`/works/${encodeURIComponent(workId)}`);
    return res.data;
  } catch (error) {
    logger.error('Error deleting work:', error);
    throw error;
  }
};

/**
 * Get single work by ID
 */
export const getWork = async (workId) => {
  if (!workId) return null;
  try {
    const res = await api.get(`/works/${encodeURIComponent(workId)}`);
    const data = extractResponseData(res);
    
    if (data?.workId) return data;
    if (data?.works?.[0]) return data.works[0];
    return data;
  } catch (error) {
    logger.error('Error fetching work:', error);
    return null;
  }
};

/**
 * Get work ratings
 */
export const getWorkRatings = async (workId) => {
  if (!workId) return { ratings: [] };
  try {
    const res = await api.get(`/works/${encodeURIComponent(workId)}/ratings`);
    const data = extractResponseData(res);
    
    if (Array.isArray(data)) return { ratings: data };
    if (data?.ratings && Array.isArray(data.ratings)) return { ratings: data.ratings };
    return data || { ratings: [] };
  } catch (error) {
    logger.error('Error fetching work ratings:', error);
    return { ratings: [] };
  }
};

/**
 * Post work rating
 */
export const postWorkRating = async (workId, payload) => {
  if (!workId) throw new Error('workId required');
  try {
    const res = await api.post(`/works/${encodeURIComponent(workId)}/ratings`, payload);
    return res.data;
  } catch (error) {
    logger.error('Error posting work rating:', error);
    throw error;
  }
};

/**
 * Get similar works
 */
export const getSimilarWorks = async (workId) => {
  if (!workId) return [];
  try {
    const res = await api.get(`/works/${encodeURIComponent(workId)}/similar`);
    const data = extractResponseData(res);
    
    if (Array.isArray(data)) return data;
    if (data?.works && Array.isArray(data.works)) return data.works;
    if (data?.items && Array.isArray(data.items)) return data.items;
    return [];
  } catch (error) {
    logger.error('Error fetching similar works:', error);
    return [];
  }
};



