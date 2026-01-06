// SearchResults - displays works/users matching search query with filtering and shelf operations
import { useEffect, useState, useCallback, useLocation, useNavigate, addWorkToShelf,
         removeWorkFromShelf, getOrCreateFavouritesShelf, getUserShelves, FilterBar, WorkGridSkeleton,
         ResultHeader, WorkCard, UserCard, AddToShelfBanner, SearchResultsHeader, WorksSection, UsersSection,
         SearchResultsLayout, NoResultsMessage, useNavigationWithClearFilters, useAuth, useFavourites,
         useAddToShelfWorks, logger, fetchSearchResults, getPageTitle } from '../imports/searchResultsImports';

// Helper: Toggle work in/out of shelf
const toggleWorkInShelf = async (workId, isInShelf, shelfId) =>
  isInShelf ? removeWorkFromShelf(shelfId, workId) : addWorkToShelf(shelfId, workId);

// Helper: Get or create user's favourites shelf
const getFavouritesShelf = async (userId, favouritesShelfId, shelves) => {
  if (favouritesShelfId) return favouritesShelfId;
  const { shelfId } = await getOrCreateFavouritesShelf(userId, shelves);
  return shelfId;
};

export default function SearchResults() {
  // Router and auth hooks
  const { search } = useLocation();
  const navigate = useNavigate();
  const { navigateAndClearFilters } = useNavigationWithClearFilters();
  const { user } = useAuth();

  // Parse URL query and filter parameters
  const params = new URLSearchParams(search);
  const { q: query = '', type: typeFilter = '', year: yearFilter = '', genre: genreFilter = '', rating: ratingFilter = '', addToShelf: addToShelfId = '', shelfName = '' } = Object.fromEntries(params);

  // Results and UI state
  const [results, setResults] = useState({ works: [], users: [] });
  const [loading, setLoading] = useState(true);
  const [addingWork, setAddingWork] = useState(null);
  const [favouritingWork, setFavouritingWork] = useState(null);

  // Shelf and favourite tracking hooks
  const { favouritedWorks, favouritesShelfId, isMountedRef, toggleFavourite } = useFavourites(user);
  const { addedWorks } = useAddToShelfWorks(addToShelfId);

  // Fetch search results with applied filters
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

  useEffect(() => { loadResults(); }, [loadResults]);

  const handleAddToShelf = async (workId) => {
    // Add/remove work from target shelf
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

  const handleAddToFavourites = async (workId) => {
    // Add/remove work from favourites shelf with optimistic update
    if (!user) return;
    const workIdStr = String(workId);
    setFavouritingWork(workId);
    toggleFavourite(workId); // Optimistic update for instant UI feedback
    try {
      const shelvesData = await getUserShelves(user.userId);
      const shelves = Array.isArray(shelvesData) ? shelvesData : (shelvesData.data?.shelves || shelvesData.shelves || []);
      const shelfId = await getFavouritesShelf(user.userId, favouritesShelfId, shelves);
      await toggleWorkInShelf(workId, favouritedWorks.has(workIdStr), shelfId);
      setTimeout(() => setFavouritingWork(null), 500);
    } catch (error) {
      logger.error('Failed to toggle favourite:', error);
      toggleFavourite(workId); // Revert on error
      setFavouritingWork(null);
    }
  };

  const closeBanner = () => {
    // Remove shelf banner from URL params
    const newParams = new URLSearchParams(search);
    newParams.delete('addToShelf');
    newParams.delete('shelfName');
    navigate(`/search?${newParams.toString()}`, { replace: true });
  };

  // Render work card with state handlers
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

  const pageTitle = getPageTitle(loading, query, { type: typeFilter, genre: genreFilter, year: yearFilter, rating: ratingFilter });

  return (
    <SearchResultsLayout>
      <div className="search-results-header">
        <SearchResultsHeader title={pageTitle} />
      </div>
      {/* Filter Bar */}
      <div className="search-results-filter">
        <FilterBar onFilterChange={loadResults} pathForNavigation="/search" queryKey="q" includeGenreFilter includeRatingFilter />
      </div>
      {/* Content Area */}
      <div className="search-results-content">
        {loading && !results.works.length && !results.users.length ? (
          <div className="search-results-loading">
            <WorkGridSkeleton count={12} />
          </div>
        ) : (
          <>
            {/* Results Sections */}
            {results.works.length > 0 && (
              <WorksSection works={results.works} renderWorkCard={renderWorkCard} />
            )}
            {results.users.length > 0 && (
              <UsersSection users={results.users} renderUserCard={renderUserCard} />
            )}
            {!results.works.length && !results.users.length && !loading && (
              <NoResultsMessage />
            )}
          </>
        )}
      </div>
      {/* Shelf addition banner */}
      {addToShelfId && (
        <div className="search-results-banner">
          <AddToShelfBanner shelfName={shelfName} onClose={closeBanner} onBack={() => navigate('/shelves')} />
        </div>
      )}
    </SearchResultsLayout>
  );
}
