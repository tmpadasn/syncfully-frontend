import api from './client';

// Search for items (works, users, etc.)
export const searchItems = async (query, filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (query) params.append('query', query); // Backend expects 'query' not 'q'
    
    console.log('🔍 searchItems: Input filters:', filters);
    
    // Map frontend filter names to backend search API parameter names
    const paramMapping = {
      'type': 'work-type',     // Frontend 'type' becomes 'work-type'
      'itemType': 'item-type', // Frontend 'itemType' becomes 'item-type'
      'genre': 'genre',        // Keep as is
      'year': 'year',          // Keep as is
      'rating': 'rating'       // Keep as is
    };
    
    // Add filters with correct parameter names for search API
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key] !== '' && filters[key] !== 'Any') {
        const backendParam = paramMapping[key] || key;
        params.append(backendParam, filters[key]);
        console.log(`🔍 searchItems: Added filter ${backendParam}=${filters[key]}`);
      }
    });
    
    // Don't automatically set item-type to 'work' if itemType filter is specified
    if (!filters.itemType) {
      params.append('item-type', 'work'); // Default to works only if no itemType specified
    }
    
    const queryString = params.toString();
    const url = queryString ? `/search?${queryString}` : '/search';
    
    console.log('📡 searchItems: API call to:', url);
    
    const res = await api.get(url);
    if (!res || !res.data) {
      console.log('❌ searchItems: No response data');
      return { results: [] };
    }
    
    console.log('📦 searchItems: Raw response:', res.data);
    
    // Handle backend response format: { success: true, data: { works: [], users: [] } }
    if (res.data.success && res.data.data) {
      const { works = [], users = [] } = res.data.data;
      const results = [...works, ...users];
      console.log('✅ searchItems: Extracted results:', results.length);
      return { results };
    }
    
    // Fallback for other response formats
    if (Array.isArray(res.data)) {
      console.log('✅ searchItems: Using array response:', res.data.length);
      return { results: res.data };
    }
    if (res.data.results) {
      console.log('✅ searchItems: Using results property:', res.data.results.length);
      return res.data;
    }
    if (res.data.items) {
      console.log('✅ searchItems: Using items property:', res.data.items.length);
      return { results: res.data.items };
    }
    
    console.log('⚠️ searchItems: No recognized data format, returning empty');
    return { results: [] };
  } catch (error) {
    console.error('❌ searchItems failed:', error);
    return { results: [] };
  }
};

// Search specifically for works
export const searchWorks = async (query, filters = {}) => {
  try {
    const searchFilters = { ...filters, type: 'work' };
    return await searchItems(query, searchFilters);
  } catch (error) {
    console.error('searchWorks failed:', error);
    return { results: [] };
  }
};

// Search specifically for users
export const searchUsers = async (query, filters = {}) => {
  try {
    const searchFilters = { ...filters, type: 'user' };
    return await searchItems(query, searchFilters);
  } catch (error) {
    console.error('searchUsers failed:', error);
    return { results: [] };
  }
};