/**
 * SearchResults Page
 *
 * Main search results page component - displays works and users matching search query
 * Supports filtering (type, year, genre, rating) and shelf operations
 *
 * Architecture:
 *   - Centralizes all imports via searchResultsImports.js
 *   - Uses helper functions for reusable logic
 *   - Delegates rendering to sub-components (WorkCard, UserCard, etc.)
 *   - Manages state for search results and shelf operations
 *
 * Key Features:
 *   - Real-time search with filter support
 *   - Add works to shelves with visual feedback
 *   - Mark works as favourites
 *   - Error handling and loading states
 *   - Responsive grid layout
 */

import { useEffect, useState, useCallback, useLocation, useNavigate } from '../imports/searchResultsImports';
import { addWorkToShelf, removeWorkFromShelf, getOrCreateFavouritesShelf, getUserShelves, FilterBar } from '../imports/searchResultsImports';
import { useNavigationWithClearFilters, useAuth, WorkGridSkeleton, logger } from '../imports/searchResultsImports';
import { useFavourites, useAddToShelfWorks, ResultHeader, WorkCard, UserCard } from '../imports/searchResultsImports';
import { AddToShelfBanner, SearchResultsHeader, WorksSection, UsersSection } from '../imports/searchResultsImports';
import { searchResultsStyles, fetchSearchResults, getPageTitle } from '../imports/searchResultsImports';

// Helper function: Toggle work in shelf
const toggleWorkInShelf = async (workId, isInShelf, shelfId) => {
  return isInShelf
    ? removeWorkFromShelf(shelfId, workId)
    : addWorkToShelf(shelfId, workId);
};

// Helper function: Get or create favourites shelf
const getFavouritesShelf = async (userId, favouritesShelfId, shelves) => {
  if (favouritesShelfId) return favouritesShelfId;
  const response = await getOrCreateFavouritesShelf(userId, shelves);
  return response.shelfId;
};

// Main Search Results Page Component
export default function SearchResults() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { navigateAndClearFilters } = useNavigationWithClearFilters();
  const { user } = useAuth();

  // URL parameters: query and filters
  const params = new URLSearchParams(search);
  const { q: query = '', type: typeFilter = '', year: yearFilter = '', genre: genreFilter = '', rating: ratingFilter = '', addToShelf: addToShelfId = '', shelfName = '' } = Object.fromEntries(params);

  // State: search results and UI
  const [results, setResults] = useState({ works: [], users: [] });
  const [loading, setLoading] = useState(true);
  const [addingWork, setAddingWork] = useState(null);
  const [favouritingWork, setFavouritingWork] = useState(null);

  // Custom hooks: manage shelf and favourite data
  const { favouritedWorks, favouritesShelfId, isMountedRef, toggleFavourite } = useFavourites(user);
  const { addedWorks } = useAddToShelfWorks(addToShelfId);

  // Load search results
  const loadResults = useCallback(async () => {
    if (!isMountedRef.current) return;
    setResults({ works: [], users: [] });
    setLoading(true);
    try {
      const filters = { type: typeFilter, year: yearFilter, genre: genreFilter, rating: ratingFilter };
      const { works, users } = await fetchSearchResults(query.trim(), filters);
      if (isMountedRef.current) setResults({ works, users });
    } catch (error) {
      logger.error('Failed to fetch results:', error);
      if (isMountedRef.current) setResults({ works: [], users: [] });
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [query, typeFilter, yearFilter, genreFilter, ratingFilter, isMountedRef]);

  // Fetch results on mount and when query/filters change
  useEffect(() => { loadResults(); }, [loadResults]);

  // Add or remove work from shelf
  const handleAddToShelf = async (workId) => {
    if (!addToShelfId) return;
    const workIdStr = String(workId);
    setAddingWork(workIdStr);
    try {
      await toggleWorkInShelf(workId, addedWorks.has(workIdStr), addToShelfId);
      setTimeout(() => setAddingWork(null), 500);
    } catch (error) {
      logger.error('Failed to toggle work in shelf:', error);
      setAddingWork(null);
    }
  };

  // Add or remove work from favourites
  const handleAddToFavourites = async (workId) => {
    if (!user) return;
    const workIdStr = String(workId);
    setFavouritingWork(workId);
    // Optimistic update: toggle favourite immediately for instant UI feedback
    toggleFavourite(workId);
    try {
      const shelvesData = await getUserShelves(user.userId);
      const shelves = Array.isArray(shelvesData) ? shelvesData : (shelvesData.data?.shelves || shelvesData.shelves || []);
      const shelfId = await getFavouritesShelf(user.userId, favouritesShelfId, shelves);
      await toggleWorkInShelf(workId, favouritedWorks.has(workIdStr), shelfId);
      setTimeout(() => setFavouritingWork(null), 500);
    } catch (error) {
      logger.error('Failed to toggle favourite:', error);
      // Revert optimistic update on error
      toggleFavourite(workId);
      setFavouritingWork(null);
    }
  };

  // Close shelf banner
  const closeBanner = () => {
    const newParams = new URLSearchParams(search);
    newParams.delete('addToShelf');
    newParams.delete('shelfName');
    navigate(`/search?${newParams.toString()}`, { replace: true });
  };

  // Render work card with current state
  const renderWorkCard = (entity, idx, total) => (
    <WorkCard
      key={entity.entityId}
      entity={entity}
      isInShelf={addedWorks.has(String(entity.entityId))}
      isProcessingWork={addingWork === String(entity.entityId)}
      isFavourited={favouritedWorks.has(String(entity.entityId))}
      isFavouriting={favouritingWork === entity.entityId}
      addToShelfId={addToShelfId}
      onAddToShelf={handleAddToShelf}
      onAddToFavourites={handleAddToFavourites}
      onWorkClick={() => navigateAndClearFilters(`/works/${entity.entityId}`)}
      ResultHeader={ResultHeader}
      isLast={idx === total - 1}
    />
  );

  // Render user card with click handler
  const renderUserCard = (entity, idx, total) => (
    <UserCard
      key={entity.entityId}
      entity={entity}
      onUserClick={() => navigate(`/profile/${entity.entityId}`, { state: { prevSearch: search } })}
      ResultHeader={ResultHeader}
      isLast={idx === total - 1}
    />
  );

  // Page title
  const pageTitle = getPageTitle(loading, query, { type: typeFilter, genre: genreFilter, year: yearFilter, rating: ratingFilter });

  // Render
  return (
    <div className="page-container">
      <div className="page-inner">
        <main className="page-main">
          <SearchResultsHeader title={pageTitle} styles={searchResultsStyles} />
          <FilterBar onFilterChange={loadResults} pathForNavigation="/search" queryKey="q" includeGenreFilter includeRatingFilter />
          {loading && !results.works.length && !results.users.length ? (
            <WorkGridSkeleton count={12} />
          ) : (
            <>
              {results.works.length > 0 && <WorksSection works={results.works} styles={searchResultsStyles} renderWorkCard={renderWorkCard} />}
              {results.users.length > 0 && <UsersSection users={results.users} styles={searchResultsStyles} renderUserCard={renderUserCard} />}
              {!results.works.length && !results.users.length && !loading && (
                <div style={searchResultsStyles.noResults}><p>No results found for your search.</p></div>
              )}
            </>
          )}
          {addToShelfId && <AddToShelfBanner shelfName={shelfName} onClose={closeBanner} onBack={() => navigate('/shelves')} />}
        </main>
      </div>
    </div>
  );
}
