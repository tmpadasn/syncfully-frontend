import api from './client';

export const getPopularWorks = async () => {
  try {
    const res = await api.get('/works/popular');
    // normalize: backend may return { works: [...] } or an array
    if (!res || !res.data) return [];
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data.works)) return res.data.works;
    return res.data || [];
  } catch (e) {
    console.warn('getPopularWorks failed', e);
    return [];
  }
};

export const getWork = async (workId) => {
  if (!workId) return null;
  try {
    const res = await api.get(`/works/${encodeURIComponent(workId)}`);
    // normalize: some backends return { works: [...] }
    if (!res || !res.data) return null;
    if (res.data.works && Array.isArray(res.data.works) && res.data.works[0]) return res.data.works[0];
    return res.data;
  } catch (e) {
    console.warn('getWork failed', e);
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
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data.works)) return res.data.works;
    if (Array.isArray(res.data.items)) return res.data.items;
    return [];
  } catch (e) {
    console.warn('getSimilarWorks failed', e);
    return [];
  }
};



