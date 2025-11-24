import api from './client';

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
  } catch (e) {
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
  } catch (e) {
    return { works: [] };
  }
};

// Create a new work
export const createWork = async (workData) => {
  try {
    const res = await api.post('/works', workData);
    return res.data;
  } catch (e) {
    throw e;
  }
};

// Update work
export const updateWork = async (workId, workData) => {
  try {
    const res = await api.put(`/works/${encodeURIComponent(workId)}`, workData);
    return res.data;
  } catch (e) {
    throw e;
  }
};

// Delete work
export const deleteWork = async (workId) => {
  try {
    const res = await api.delete(`/works/${encodeURIComponent(workId)}`);
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const getWork = async (workId) => {
  if (!workId) return null;
  try {
    const res = await api.get(`/works/${encodeURIComponent(workId)}`);
    // Backend returns: {success: true, data: {...}, message: "..."}
    if (!res || !res.data) return null;
    
    // Extract data property from backend response
    const responseData = res.data.data || res.data;
    
    if (responseData.works && Array.isArray(responseData.works) && responseData.works[0]) return responseData.works[0];
    return responseData;
  } catch (e) {
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
  } catch (e) {
    console.warn('getWorkRatings failed', e);
    return { ratings: [] };
  }
};

export const postWorkRating = async (workId, payload) => {
  if (!workId) throw new Error('workId required');
  try {
    const res = await api.post(`/works/${encodeURIComponent(workId)}/ratings`, payload);
    return res.data;
  } catch (e) {
    console.warn('postWorkRating failed', e);
    throw e;
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
  } catch (e) {
    console.warn('getSimilarWorks failed', e);
    return [];
  }
};



