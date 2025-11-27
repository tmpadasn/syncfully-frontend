import api from './client';
import logger from '../utils/logger';

// Get popular works
export const getPopularWorks = async () => {
  try {
    const res = await api.get('/works/popular');
    // Backend returns: {success: true, data: {...}, message: "..."}
    if (!res || !res.data) return { works: [] };
    
    // Extract data property from backend response
    const responseData = res.data.data || res.data;
    
    if (Array.isArray(responseData)) return { works: responseData };
    if (responseData.works && Array.isArray(responseData.works)) return { works: responseData.works };
    return { works: [] };
  } catch (error) {
    logger.error('Error fetching popular works:', error);
    return { works: [] };
  }
};

// Get all works with optional filters
export const getAllWorks = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const queryString = params.toString();
    const url = queryString ? `/works?${queryString}` : '/works';
    const res = await api.get(url);
    
    // Backend returns: {success: true, data: {...}, message: "..."}
    if (!res || !res.data) return { works: [] };
    
    // Extract data property from backend response
    const responseData = res.data.data || res.data;
    
    if (Array.isArray(responseData)) return { works: responseData };
    if (responseData.works && Array.isArray(responseData.works)) return { works: responseData.works };
    return { works: [] };
  } catch (error) {
    logger.error('Error fetching all works:', error);
    return { works: [] };
  }
};

// Create a new work
export const createWork = async (workData) => {
  try {
    const res = await api.post('/works', workData);
    return res.data;
  } catch (error) {
    logger.error('Error creating work:', error);
    throw error;
  }
};

// Update work
export const updateWork = async (workId, workData) => {
  try {
    const res = await api.put(`/works/${encodeURIComponent(workId)}`, workData);
    return res.data;
  } catch (error) {
    logger.error('Error updating work:', error);
    throw error;
  }
};

// Delete work
export const deleteWork = async (workId) => {
  try {
    const res = await api.delete(`/works/${encodeURIComponent(workId)}`);
    return res.data;
  } catch (error) {
    logger.error('Error deleting work:', error);
    throw error;
  }
};

export const getWork = async (workId) => {
  if (!workId) return null;
  try {
    const res = await api.get(`/works/${encodeURIComponent(workId)}`);
    // Backend now returns: {success: true, data: {...work...}, message: "..."}
    if (!res || !res.data) return null;
    
    // Extract data property from backend response
    const responseData = res.data.data || res.data;
    
    // Backend returns the work object directly now, not wrapped in array
    if (responseData && typeof responseData === 'object' && responseData.workId) {
      return responseData;
    }
    
    // Fallback for old format (wrapped in works array)
    if (responseData.works && Array.isArray(responseData.works) && responseData.works[0]) {
      return responseData.works[0];
    }
    
    return responseData;
  } catch (error) {
    logger.error('Error fetching work:', error);
    return null;
  }
};

export const getWorkRatings = async (workId) => {
  if (!workId) return { ratings: [] };
  try {
    const res = await api.get(`/works/${encodeURIComponent(workId)}/ratings`);
    if (!res || !res.data) return { ratings: [] };
    // normalize possible shapes
    if (Array.isArray(res.data)) return { ratings: res.data };
    if (Array.isArray(res.data.ratings)) return { ratings: res.data.ratings };
    return res.data;
  } catch (error) {
    logger.error('Error fetching work ratings:', error);
    return { ratings: [] };
  }
};

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

export const getSimilarWorks = async (workId) => {
  if (!workId) return [];
  try {
    const res = await api.get(`/works/${encodeURIComponent(workId)}/similar`);
    if (!res || !res.data) return [];
    
    // Backend returns: {success: true, data: {works: [...]}, message: "..."}
    // Extract data property first, then works property
    const responseData = res.data.data || res.data;
    
    if (Array.isArray(responseData)) return responseData;
    if (responseData.works && Array.isArray(responseData.works)) return responseData.works;
    if (responseData.items && Array.isArray(responseData.items)) return responseData.items;
    return [];
  } catch (error) {
    logger.error('Error fetching similar works:', error);
    return [];
  }
};



