import api from './client';
import logger from '../utils/logger';

// Search for items (works, users, etc.)
export const searchItems = async (query, filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    
    logger.debug('🔍', 'searchItems: Input filters:', filters);
    
    // Map frontend filter names to backend search API parameter names
    const paramMapping = {
      'type': 'work-type',
      'itemType': 'item-type',
      'genre': 'genre',
      'year': 'year',
      'rating': 'rating'
    };
    
    // Add filters with correct parameter names for search API
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key] !== '' && filters[key] !== 'Any') {
        const backendParam = paramMapping[key] || key;
        params.append(backendParam, filters[key]);
        logger.debug('🔍', `searchItems: Added filter ${backendParam}=${filters[key]}`);
      }
    });
    
    const queryString = params.toString();
    const url = queryString ? `/search?${queryString}` : '/search';
    
    logger.api('GET', url);
    
    const res = await api.get(url);
    if (!res || !res.data) {
      logger.debug('❌', 'searchItems: No response data');
      return { results: [] };
    }
    
    logger.debug('📦', 'searchItems: Raw response:', res.data);
    
    // Backend now returns standardized format: { success: true, data: { works: [], users: [], totalWorks: 0, totalUsers: 0 }, message: "..." }
    const responseData = res.data.data || res.data;
    const works = responseData.works || [];
    const users = responseData.users || [];
    const results = [...works, ...users];
    
    logger.debug('✅', 'searchItems: Extracted results:', results.length);
    return { results };
  } catch (error) {
    logger.error('Error searching items:', error);
    return { results: [] };
  }
};

// Search specifically for works
export const searchWorks = async (query, filters = {}) => {
  try {
    const searchFilters = { ...filters, itemType: 'work' };
    return await searchItems(query, searchFilters);
  } catch (error) {
    logger.error('Error searching works:', error);
    return { results: [] };
  }
};

// Search specifically for users
export const searchUsers = async (query, filters = {}) => {
  try {
    const searchFilters = { ...filters, itemType: 'user' };
    return await searchItems(query, searchFilters);
  } catch (error) {
    logger.error('Error searching users:', error);
    return { results: [] };
  }
};