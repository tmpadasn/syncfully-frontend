import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logger from '../utils/logger';

/**
 * Custom hook that provides navigation with automatic filter clearing
 * when leaving the search page
 */
export const useNavigationWithClearFilters = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-clear search parameters if we're not on a search page but have search params
  useEffect(() => {
    const isSearchPage = location.pathname.includes('/search');
    const hasSearchParams = location.search.includes('q=') || 
                           location.search.includes('type=') || 
                           location.search.includes('year=') || 
                           location.search.includes('genre=') || 
                           location.search.includes('rating=') || 
                           location.search.includes('itemType=');
    
    if (!isSearchPage && hasSearchParams) {
      logger.nav('Auto-clearing search parameters on non-search page');
      // Clear search parameters by navigating to the same path without them
      navigate(location.pathname, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  const navigateAndClearFilters = (path, options = {}) => {
    // Check if we're currently on the search page and navigating away
    const isLeavingSearchPage = location.pathname.includes('/search') && !path.includes('/search');
    
    if (isLeavingSearchPage) {
      logger.nav('Clearing search filters when leaving search page to:', path);
      // Navigate without preserving search parameters
      navigate(path, { replace: true, ...options });
    } else {
      // Normal navigation
      navigate(path, options);
    }
  };

  return {
    navigateAndClearFilters,
    location,
    navigate
  };
};

export default useNavigationWithClearFilters;