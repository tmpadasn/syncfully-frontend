import { getAllWorks } from '../api/works';
import { searchItems } from '../api/search';
import { normalizeWorkEntity, mergeUniqueWorks, applyWorkFilters } from './normalize';

// Filter Validation
const FILTER_ANY_VALUES = ['Any', ''];
const isFilterActive = (value) => value && !FILTER_ANY_VALUES.includes(value);

// Extract works array from various API response shapes
export function extractWorksArray(response) {
  if (Array.isArray(response?.works)) return response.works;
  if (Array.isArray(response?.data?.works)) return response.data.works;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
}

// Prepare filter parameters for API calls
export function prepareFilters(filters) {
  const prepared = {};
  if (isFilterActive(filters.type)) prepared.itemType = filters.type === 'user' ? 'user' : undefined;
  if (isFilterActive(filters.type) && filters.type !== 'user') prepared.type = filters.type;
  if (isFilterActive(filters.year)) prepared.year = filters.year;
  if (isFilterActive(filters.genre)) prepared.genre = filters.genre;
  if (isFilterActive(filters.rating)) prepared.rating = filters.rating;
  return prepared;
}

// Normalize and map user items to display format
export function normalizeUsers(items) {
  const isValidUser = (item) => (item.userId || item.username) && !item.title;
  const getRatingCount = (item) => item.ratedWorksCount ?? (item.ratedWorks ? Object.keys(item.ratedWorks).length : 0);

  return items
    .filter(isValidUser)
    .map(item => ({
      entityId: item.userId || item.id,
      kind: 'user',
      title: item.username || item.name,
      coverUrl: item.profilePictureUrl || item.avatarUrl || '/profile_picture.jpg',
      subtitle: item.email || 'User',
      meta: `Ratings: ${getRatingCount(item)}`,
      description: item.bio || 'User profile',
      rating: 0
    }));
}

// Determine if we should use the getAllWorks endpoint
export function shouldUseAllWorksEndpoint(searchTerm, filters) {
  return !searchTerm && filters.itemType !== 'user';
}

// Extract works from various API response structures
function extractAndNormalizeWorks(response) {
  return extractWorksArray(response)
    .map(normalizeWorkEntity)
    .filter(Boolean);
}

// Parse search results into works and users
function parseSearchResults(data, prepared) {
  let works = [];
  if (data.results) {
    works = data.results;
  } else if (data.works || data.users) {
    if (prepared.itemType === 'user') works = data.users || [];
    else if (prepared.type) works = data.works || [];
    else works = [...(data.works || []), ...(data.users || [])];
  }
  return works.filter(item => item && (item.title || item.username || item.name) && (item.id || item.workId || item.userId));
}

// Determine if users should be displayed in results
function shouldShowUsers(prepared) {
  const hasFilters = prepared.type || prepared.year || prepared.genre || prepared.rating;
  return !hasFilters && prepared.itemType !== 'user';
}

// Fetch works from getAllWorks endpoint
async function fetchAllWorks(prepared) {
  const response = await getAllWorks({
    type: prepared.type,
    genre: prepared.genre,
    year: prepared.year,
    rating: prepared.rating
  });
  return extractAndNormalizeWorks(response);
}

// Fetch and process search results
export async function fetchSearchResults(searchTerm, filters) {
  const prepared = prepareFilters(filters);
  const shouldUseAll = shouldUseAllWorksEndpoint(searchTerm, prepared);

  // Step 1: Fetch works from appropriate endpoint
  let mappedWorks = [];
  let mappedUsers = [];

  if (shouldUseAll) {
    mappedWorks = await fetchAllWorks(prepared);
  } else {
    // Search endpoint
    const data = await searchItems(searchTerm, prepared);
    const validItems = parseSearchResults(data, prepared);

    mappedWorks = prepared.itemType === 'user' ? [] : validItems
      .filter(item => !(item.userId || item.username) || item.title)
      .map(normalizeWorkEntity)
      .filter(Boolean);

    mappedUsers = shouldShowUsers(prepared) || prepared.itemType === 'user'
      ? normalizeUsers(validItems)
      : [];

    // Step 2: Merge with getAllWorks if needed
    if (!searchTerm && prepared.itemType !== 'user') {
      const allWorks = await fetchAllWorks(prepared);
      mappedWorks = mergeUniqueWorks(mappedWorks, allWorks);
    }
  }

  // Step 3: Apply client-side filters and return
  return { works: applyWorkFilters(mappedWorks, prepared), users: mappedUsers };
}

// Generate page title based on filters
export function getPageTitle(loading, query, filters) {
  if (loading) return 'Searching...';
  if (query) return `RESULTS FOR "${query}"`;

  const parts = [];
  if (filters.type && filters.type !== 'user') parts.push(filters.type.toUpperCase());
  if (filters.type === 'user') parts.push('USERS');
  if (filters.genre) parts.push(filters.genre.toUpperCase());
  if (filters.year) parts.push(`${filters.year}+`);
  if (filters.rating) parts.push(`${filters.rating}★+`);

  return parts.length > 0 ? `FILTERS: ${parts.join(' | ')}` : 'BROWSE ALL';
}
