import { getAllWorks } from '../api/works';
import { searchItems } from '../api/search';
import {
  normalizeWorkEntity,
  mergeUniqueWorks,
  applyWorkFilters,
} from './normalize';

/**
 * Extract works array from various API response shapes
 */
export function extractWorksArray(response) {
  let worksArray = [];
  if (Array.isArray(response?.works)) worksArray = response.works;
  else if (Array.isArray(response?.data?.works)) worksArray = response.data.works;
  else if (Array.isArray(response?.data)) worksArray = response.data;
  else if (Array.isArray(response)) worksArray = response;
  return worksArray;
}

/**
 * Prepare filter parameters for API calls
 */
export function prepareFilters(filters) {
  const prepared = {};

  if (filters.type && filters.type !== 'Any' && filters.type !== '') {
    if (filters.type === 'user') {
      prepared.itemType = 'user';
    } else {
      prepared.type = filters.type;
    }
  }

  if (filters.year && filters.year !== 'Any' && filters.year !== '') prepared.year = filters.year;
  if (filters.genre && filters.genre !== 'Any' && filters.genre !== '') prepared.genre = filters.genre;
  if (filters.rating && filters.rating !== 'Any' && filters.rating !== '') prepared.rating = filters.rating;

  return prepared;
}

/**
 * Normalize and map user items to display format
 */
export function normalizeUsers(items) {
  return items
    .filter(item => (item.userId || item.username) && !item.title)
    .map(item => ({
      entityId: item.userId || item.id,
      kind: 'user',
      title: item.username || item.name,
      coverUrl: item.profilePictureUrl || item.avatarUrl || '/profile_picture.jpg',
      subtitle: item.email || 'User',
      meta: `Ratings: ${item.ratedWorksCount !== undefined ? item.ratedWorksCount : (item.ratedWorks ? Object.keys(item.ratedWorks).length : 0)}`,
      description: item.bio || 'User profile',
      rating: 0
    }));
}

/**
 * Determine if we should use the getAllWorks endpoint
 */
export function shouldUseAllWorksEndpoint(searchTerm, filters) {
  return !searchTerm && filters.itemType !== 'user';
}

/**
 * Fetch and process search results
 */
export async function fetchSearchResults(searchTerm, filters) {
  const prepared = prepareFilters(filters);
  let mappedWorks = [];
  let mappedUsers = [];

  const shouldUseAll = shouldUseAllWorksEndpoint(searchTerm, prepared);

  if (shouldUseAll) {
    // Use getAllWorks endpoint
    const worksResponse = await getAllWorks({
      type: prepared.type,
      genre: prepared.genre,
      year: prepared.year,
      rating: prepared.rating
    });

    const worksArray = extractWorksArray(worksResponse);
    mappedWorks = worksArray
      .map(normalizeWorkEntity)
      .filter(Boolean);
  } else {
    // Use searchItems endpoint
    const data = await searchItems(searchTerm, prepared);

    let works = [];
    if (data.results) {
      works = data.results;
    } else if (data.works || data.users) {
      if (prepared.itemType === 'user') {
        works = data.users || [];
      } else if (prepared.type) {
        works = data.works || [];
      } else {
        works = [...(data.works || []), ...(data.users || [])];
      }
    }

    const validItems = works.filter(item => item && (item.title || item.username || item.name) && (item.id || item.workId || item.userId));

    mappedWorks = (prepared.itemType === 'user') ? [] : validItems
      .filter(item => !(item.userId || item.username) || item.title)
      .map(normalizeWorkEntity)
      .filter(Boolean);

    const shouldShowUsers = !prepared.type &&
                            !prepared.year &&
                            !prepared.genre &&
                            !prepared.rating &&
                            prepared.itemType !== 'user';

    mappedUsers = shouldShowUsers ? normalizeUsers(validItems) : (prepared.itemType === 'user' ? normalizeUsers(validItems) : []);
  }

  // Merge with getAllWorks if needed
  if (!shouldUseAll && !searchTerm && prepared.itemType !== 'user') {
    const worksResponse = await getAllWorks({
      type: prepared.type,
      genre: prepared.genre,
      year: prepared.year,
      rating: prepared.rating
    });

    const worksArray = extractWorksArray(worksResponse);
    const normalizedFromAll = worksArray
      .map(normalizeWorkEntity)
      .filter(Boolean);

    mappedWorks = mergeUniqueWorks(mappedWorks, normalizedFromAll);
  }

  // Apply client-side filters
  const clientFilteredWorks = applyWorkFilters(mappedWorks, prepared);

  return { works: clientFilteredWorks, users: mappedUsers };
}

/**
 * Generate page title based on filters
 */
export function getPageTitle(loading, query, filters) {
  if (loading) return 'Searching...';
  if (query) return `RESULTS FOR "${query}"`;

  const parts = [];
  if (filters.type && filters.type !== 'user') parts.push(filters.type.toUpperCase());
  if (filters.type === 'user') parts.push('USERS');
  if (filters.genre) parts.push(filters.genre.toUpperCase());
  if (filters.year) parts.push(filters.year + '+');
  if (filters.rating) parts.push(`${filters.rating}★+`);
  if (parts.length > 0) { return 'FILTERS:' + parts.join('|'); }

  return 'BROWSE ALL';
}
