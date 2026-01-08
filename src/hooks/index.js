/**
 * Hooks Index File
 *
 * Centralized export point for all custom hooks in the application.
 * Simplifies imports by allowing hooks to be imported from a single location.
 *
 * Usage:
 *   Instead of: import useAuth from '../hooks/useAuth'
 *   Use: import { useAuth } from '../hooks'
 */

// Account and Authentication
export { default as useAuth } from './useAuth.js';
export { default as useAccountData } from './useAccountData.js';

// Favourites Management
export { useFavourites } from './useFavourites.js';

// Shelves Management
export { default as useShelves } from './useShelves.js';
export { useShelfState } from './useShelfState.js';
export { useShelfHandlers } from './useShelfHandlers.js';
export { useLoadShelfWorks } from './useLoadShelfWorks.js';
export { useShelfOperations } from './useShelfOperations.js';

// Add to Shelf Modal
export { useAddToShelfWorks } from './useAddToShelfWorks.js';
export { useAddToShelfState, useModalAccessibility } from './useAddToShelfBtn.js';

// Navigation
export { default as useNavigationWithClearFilters, useNavigationWithClearFilters as useNavigationWithClearFiltersNamed } from './useNavigationWithClearFilters.js';

// Search
export { useSearchSync } from './useSearchSync.js';

// Page Data
export { useHomePageData } from './useHomePageData.js';

// Scroll Management
export { default as useHorizontalScroll } from './useHorizontalScroll.js';
