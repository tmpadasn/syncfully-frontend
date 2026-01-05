/**
 * SearchResults Page - Centralized Imports
 * Re-exports all dependencies used in SearchResults component
 * Provides clean import statements with single source of truth
 *
 * Structure:
 *   - React hooks and router
 *   - API functions for shelf/search operations
 *   - UI components (FilterBar, Skeleton, SearchResults sub-components)
 *   - Custom hooks for state management
 *   - Utilities (logger, helpers, styles)
 */

// React and Router
export { useEffect, useState, useCallback, useRef } from 'react';
export { useLocation, useNavigate } from 'react-router-dom';

// API calls
export { getAllWorks } from '../api/works';
export { searchItems } from '../api/search';
export {
  addWorkToShelf,
  removeWorkFromShelf,
  getOrCreateFavouritesShelf,
  getUserShelves,
  getShelfWorks,
} from '../api/shelves';

// Components
export { default as FilterBar } from '../components/FilterBar';
export { WorkGridSkeleton } from '../components/Skeleton';

// Search Results Sub-Components
export { ResultHeader } from '../components/SearchResults/ResultHeader';
export { WorkCard } from '../components/SearchResults/WorkCard';
export { UserCard } from '../components/SearchResults/UserCard';
export { AddToShelfBanner } from '../components/SearchResults/AddToShelfBanner';
export { SearchResultsHeader } from '../components/SearchResults/SearchResultsHeader';
export { WorksSection, UsersSection } from '../components/SearchResults/ResultSections';

// Custom Hooks
export { default as useNavigationWithClearFilters } from '../hooks/useNavigationWithClearFilters';
export { default as useAuth } from '../hooks/useAuth';
export { useFavourites } from '../hooks/useFavourites';
export { useAddToShelfWorks } from '../hooks/useAddToShelfWorks';

// Icons (React Icons - Feather)
export { FiPlus, FiCheck, FiX, FiArrowLeft, FiHeart } from 'react-icons/fi';

// Utilities
export { default as logger } from '../utils/logger';
export {
  normalizeWorkEntity,
  mergeUniqueWorks,
  applyWorkFilters,
  extractShelvesFromResponse,
  extractWorksFromResponse,
  extractWorkIdsFromShelf,
} from '../utils/normalize';
export { searchResultsStyles } from '../styles/searchResultsStyles';
export {
  fetchSearchResults,
  getPageTitle,
} from '../utils/searchUtils';
