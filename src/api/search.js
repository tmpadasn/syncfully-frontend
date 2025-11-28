import api, { extractResponseData } from './client';
import logger from '../utils/logger';

// Backend parameter mapping for search API
const FILTER_PARAM_MAP = {
  type: 'work-type',
  itemType: 'item-type',
  genre: 'genre',
  year: 'year',
  rating: 'rating'
};

/**
 * Build query string from filters
 */
const buildFilterParams = (filters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== '' && value !== 'Any') {
      const backendParam = FILTER_PARAM_MAP[key] || key;
      params.append(backendParam, value);
    }
  });
  return params;
};

/**
 * Search for items (works, users, etc.)
 */
export const searchItems = async (query, filters = {}) => {
  try {
    const params = buildFilterParams(filters);
    if (query) params.append('query', query);
    
    const url = params.toString() ? `/search?${params}` : '/search';
    const res = await api.get(url);
    const data = extractResponseData(res);
    
    const works = data?.works || [];
    const users = data?.users || [];
    const results = [...works, ...users];
    
    return { results };
  } catch (error) {
    logger.error('Error searching items:', error);
    return { results: [] };
  }
};

/**
 * Search specifically for works
 */
export const searchWorks = async (query, filters = {}) => {
  try {
    return await searchItems(query, { ...filters, itemType: 'work' });
  } catch (error) {
    logger.error('Error searching works:', error);
    return { results: [] };
  }
};

/**
 * Search specifically for users
 */
export const searchUsers = async (query, filters = {}) => {
  try {
    return await searchItems(query, { ...filters, itemType: 'user' });
  } catch (error) {
    logger.error('Error searching users:', error);
    return { results: [] };
  }
};