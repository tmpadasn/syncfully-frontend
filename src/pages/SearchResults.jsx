/*
 Search results page.
 Shows works and users that match the search query.
 Supports adding works to shelves and quick actions.
*/
import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import { getAllWorks } from '../api/works';
import { searchItems } from '../api/search';
import { addWorkToShelf, removeWorkFromShelf, getOrCreateFavouritesShelf, getUserShelves, getShelfWorks } from '../api/shelves';
import FilterBar from '../components/FilterBar';
import useNavigationWithClearFilters from '../hooks/useNavigationWithClearFilters';
import useAuth from '../hooks/useAuth';
import { FiPlus, FiCheck, FiX, FiArrowLeft, FiHeart } from 'react-icons/fi';
import { WorkGridSkeleton } from '../components/Skeleton';
import logger from '../utils/logger';
import {
  normalizeWorkEntity,
  mergeUniqueWorks,
  applyWorkFilters,
  extractShelvesFromResponse,
  extractWorksFromResponse,
  extractWorkIdsFromShelf,
} from '../utils/normalize';

// Small reusable header for result items (title + subtitle/meta)
function ResultHeader({ title, subtitle, meta, onClick }) {
  return (
    <>
      <h3
        onClick={onClick}
        style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'inline-block',
          width: 'fit-content'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
        onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
      >
        {title}
      </h3>
      <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
        <p style={{ margin: 0, color: '#666', fontSize: 14 }}>{subtitle}</p>
        <span style={{ margin: 0, color: '#888', fontSize: 12 }}>{meta}</span>
      </div>
    </>
  );
}

// ResultHeader shows a compact title and meta info.
// Click the title to go to the item.

/* ===================== SEARCH RESULTS FUNCTION ===================== */

// Search results page component.
// Merges server search results with client-side filters and shelf state.
export default function SearchResults() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { navigateAndClearFilters } = useNavigationWithClearFilters();
  const { user } = useAuth();
  const isMountedRef = useRef(true);

  /* ===================== UI STYLES ===================== */
  const styles = {
    /* ===================== PAGE LAYOUT ===================== */
    pageContainer: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    },
    pageInner: {
      flex: 1,
    },
    pageMain: {
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
      padding: '20px 16px',
    },

    /* ===================== BANNER SECTION ===================== */
    bannerContainer: {
      position: 'fixed',
      right: 20,
      top: 100,
      width: 320,
      background: '#9a4207',
      padding: '16px',
      zIndex: 1000,
      boxSizing: 'border-box',
      borderRadius: 10,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    bannerContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      color: 'white',
    },
    bannerHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    bannerTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 15,
      fontWeight: '600',
    },
    bannerCloseBtn: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      padding: 6,
      borderRadius: 6,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s ease',
    },

    /* ===================== PAGE TITLE SECTION ===================== */
    titleContainer: {
      marginBottom: 24,
    },
    titleBox: {
      padding: '12px 16px',
      backgroundColor: '#f8f5f0',
      borderLeft: '4px solid #d4b895',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    titleText: {
      fontSize: 13,
      fontWeight: 600,
      color: '#666',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },

    /* ===================== LOADING & EMPTY STATE ===================== */
    loadingContainer: {
      marginTop: 24,
    },
    emptyMessage: {
      textAlign: 'center',
    },
    noResults: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    },

    /* ===================== RESULTS SECTIONS ===================== */
    resultsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    },
    worksSection: {
      marginBottom: 40,
    },
    usersSection: {
      marginBottom: 40,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 600,
      color: '#392c2cff',
      marginBottom: 16,
      paddingBottom: 8,
      borderBottom: '2px solid #bfaea0',
      letterSpacing: 0.5,
    },
    itemsGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    },

    /* ===================== WORK ITEM ===================== */
    workItem: {
      width: '100%',
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      position: 'relative',
    },
    coverImage: {
      width: 120,
      height: 170,
      borderRadius: 8,
      overflow: 'hidden',
      flexShrink: 0,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#f2f2f2',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    coverImageInner: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },

    /* ===================== ACTION BUTTONS ===================== */
    heartButton: (isProcessing) => ({
      position: 'absolute',
      top: 8,
      right: 8,
      width: 32,
      height: 32,
      borderRadius: '50%',
      border: 'none',
      background: '#9a4207c8',
      color: 'white',
      cursor: isProcessing ? 'default' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      transition: 'all 0.2s ease',
      zIndex: 10,
      opacity: isProcessing ? 0.6 : 1,
    }),
    checkButton: (isProcessing) => ({
      position: 'absolute',
      top: 8,
      right: 52,
      width: 32,
      height: 32,
      borderRadius: '50%',
      border: 'none',
      background: '#4caf50',
      color: 'white',
      cursor: isProcessing ? 'default' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      transition: 'all 0.2s ease',
      zIndex: 10,
      opacity: isProcessing ? 0.6 : 1,
    }),

    /* ===================== WORK INFO ===================== */
    workInfo: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    },
    workTitle: {
      margin: 0,
      fontSize: 16,
      fontWeight: 700,
      cursor: 'pointer',
      color: '#392c2c',
    },
    workMeta: {
      display: 'flex',
      gap: 16,
      alignItems: 'center',
    },
    workCreator: {
      margin: 0,
      color: '#666',
      fontSize: 14,
    },
    workYear: {
      margin: 0,
      color: '#888',
      fontSize: 12,
    },
    workDescription: {
      margin: 0,
      color: '#555',
      fontSize: 13,
      lineHeight: 1.5,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    ratingInfo: {
      fontSize: 13,
      color: '#666',
      fontWeight: 500,
    },

    /* ===================== USER ITEM ===================== */
    userItem: {
      display: 'flex',
      gap: 16,
      alignItems: 'center',
    },
    userAvatar: {
      width: 80,
      height: 80,
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f2f2f2',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      flexShrink: 0,
    },
    userAvatarImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    userInfo: {
      flex: 1,
      padding: '8px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    },
    userName: {
      margin: 0,
      fontSize: 16,
      fontWeight: 600,
      cursor: 'pointer',
      display: 'inline-block',
      width: 'fit-content',
    },
    userDetails: {
      display: 'flex',
      gap: 16,
      alignItems: 'baseline',
    },
    userEmail: {
      margin: 0,
      color: '#666',
      fontSize: 14,
    },
    userRatings: {
      margin: 0,
      color: '#888',
      fontSize: 12,
    },
    userLabel: {
      margin: 0,
      color: '#888',
      fontSize: 13,
    },

    /* ===================== DIVIDERS ===================== */
    divider: {
      marginTop: 22,
      borderBottom: '2px solid #9a420776',
      paddingBottom: 6,
      marginBottom: 12,
    },
  };

  // Main search logic loads either a search result or a full catalog
  // depending on query parameters. Results merge and are filtered.
  
  const params = new URLSearchParams(search);
  const query = params.get('q') || '';
  const typeFilter = params.get('type') || '';        // TYPE filter (movie, book, music, user, etc.)
  const yearFilter = params.get('year') || '';
  const genreFilter = params.get('genre') || '';
  const ratingFilter = params.get('rating') || '';

  // Shelf context for adding works
  const addToShelfId = params.get('addToShelf') || '';
  const shelfName = params.get('shelfName') || '';

  const [results, setResults] = useState({ works: [], users: [] });
  const [loading, setLoading] = useState(true);
  const [addedWorks, setAddedWorks] = useState(new Set());
  const [addingWork, setAddingWork] = useState(null);
  const [favouritedWorks, setFavouritedWorks] = useState(new Set());
  const [favouritingWork, setFavouritingWork] = useState(null);
  const [favouritesShelfId, setFavouritesShelfId] = useState(null);

  // Load user's Favourites shelf and check which works are already in it
  const loadFavourites = useCallback(async () => {
    if (!user || !isMountedRef.current) return;

    try {
      // Get user's shelves
      const shelvesData = await getUserShelves(user.userId);
      if (!isMountedRef.current) return;

      // Extract the shelves array from the response
      const shelves = extractShelvesFromResponse(shelvesData);

      // Find or create Favourites shelf
      const favourites = await getOrCreateFavouritesShelf(user.userId, shelves);
      if (!isMountedRef.current) return;

      setFavouritesShelfId(favourites.shelfId);

      // Get works in Favourites shelf
      const favouritesWorksData = await getShelfWorks(favourites.shelfId);
      if (!isMountedRef.current) return;

      // Extract works array from API response
      const favouritesWorks = extractWorksFromResponse(favouritesWorksData);

      // Create a set of work IDs that are in Favourites
      const workIds = extractWorkIdsFromShelf(favouritesWorks);

      if (isMountedRef.current) {
        setFavouritedWorks(workIds);
      }
    } catch (error) {
      logger.error('Failed to load favourites:', error);
    }
  }, [user]);

  // Load the user's favourites on mount (uses mounted flag)
  useEffect(() => {
    isMountedRef.current = true;
    loadFavourites();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadFavourites]);

  // Load shelf contents for "add to shelf" mode
  const loadShelfContents = useCallback(async () => {
    if (!addToShelfId || !isMountedRef.current) {
      setAddedWorks(new Set());
      return;
    }

    try {
      const shelfWorksResponse = await getShelfWorks(addToShelfId);
      if (!isMountedRef.current) return;

      let worksArray = [];

      if (Array.isArray(shelfWorksResponse)) {
        worksArray = shelfWorksResponse;
      } else if (Array.isArray(shelfWorksResponse?.data?.works)) {
        worksArray = shelfWorksResponse.data.works;
      } else if (Array.isArray(shelfWorksResponse?.works)) {
        worksArray = shelfWorksResponse.works;
      } else if (Array.isArray(shelfWorksResponse?.data)) {
        worksArray = shelfWorksResponse.data;
      } else if (Array.isArray(shelfWorksResponse?.data?.shelf?.works)) {
        worksArray = shelfWorksResponse.data.shelf.works;
      }

      const workIds = worksArray
        .map(work => {
          if (!work) return null;
          if (typeof work === 'string' || typeof work === 'number') {
            return String(work);
          }

          const nestedWork = typeof work.work === 'object' ? work.work : null;
          const nestedId = nestedWork
            ? (nestedWork.id || nestedWork.workId || nestedWork._id || nestedWork.entityId)
            : null;
          const directId = work.workId || work.id || work._id || work.entityId;
          const finalId = directId || nestedId;
          return finalId ? String(finalId) : null;
        })
        .filter(Boolean);

      if (isMountedRef.current) {
        setAddedWorks(new Set(workIds));
      }
    } catch (error) {
      logger.error('Failed to load works already in shelf:', error);
      if (isMountedRef.current) {
        setAddedWorks(new Set());
      }
    }
  }, [addToShelfId]);

  useEffect(() => {
    loadShelfContents();
  }, [loadShelfContents]);

  // Generate dynamic page title based on filters
  const getPageTitle = () => {
    if (loading) return 'Searching...';
    if (query) return `RESULTS FOR "${query}"`;

    // Build title based on active filters
    const parts = [];
    if (typeFilter && typeFilter !== 'user') parts.push(typeFilter.toUpperCase());
    if (typeFilter === 'user') parts.push('USERS');
    if (genreFilter) parts.push(genreFilter.toUpperCase());
    if (yearFilter) parts.push(yearFilter + '+');
    if (ratingFilter) parts.push(`${ratingFilter}★+`);

    if (parts.length > 0) {
      return 'FILTERS:                ' + parts.join('                |                ');
    }

    return 'BROWSE ALL';
  };

  // Memoized fetch results function
  // Fetches data, applies client-side filters, and normalizes results.
  // Designed to avoid duplicate backend calls by using memoization.
  const fetchResults = useCallback(async () => {
    if (!isMountedRef.current) return;

    // Reset results immediately to prevent flash of old content
    setResults({ works: [], users: [] });
    setLoading(true);
    const searchTerm = query.trim();

      try {
        // Prepare filters for backend - ensure consistent parameter names
        const filters = {};

        // Handle TYPE filter - "user" is a special case for itemType, others are work types
        if (typeFilter && typeFilter !== 'Any' && typeFilter !== '') {
          if (typeFilter === 'user') {
            // When TYPE is "user", use itemType filter instead of work-type
            filters.itemType = 'user';
          } else {
            // For movie, book, music, etc., use as work-type filter
            filters.type = typeFilter;
          }
        }

        // itemTypeFilter is no longer used since we merged it into TYPE
        if (yearFilter && yearFilter !== 'Any' && yearFilter !== '') filters.year = yearFilter;
        if (genreFilter && genreFilter !== 'Any' && genreFilter !== '') filters.genre = genreFilter;
        if (ratingFilter && ratingFilter !== 'Any' && ratingFilter !== '') filters.rating = ratingFilter;

        // Always use search API to support both works and users
        const shouldUseAllWorksEndpoint = !searchTerm && filters.itemType !== 'user';
        let mappedWorks = [];
        let mappedUsers = [];

        if (shouldUseAllWorksEndpoint) {
          const worksResponse = await getAllWorks({
            type: filters.type,
            genre: filters.genre,
            year: filters.year,
            rating: filters.rating
          });

          let worksArray = [];
          if (Array.isArray(worksResponse?.works)) worksArray = worksResponse.works;
          else if (Array.isArray(worksResponse?.data?.works)) worksArray = worksResponse.data.works;
          else if (Array.isArray(worksResponse?.data)) worksArray = worksResponse.data;
          else if (Array.isArray(worksResponse)) worksArray = worksResponse;

          mappedWorks = worksArray
            .map(normalizeWorkEntity)
            .filter(Boolean);
        } else {
          const data = await searchItems(searchTerm, filters);

          let works = [];
          if (data.results) {
            works = data.results;
          } else if (data.works || data.users) {
            if (filters.itemType === 'user') {
              works = data.users || [];
            } else if (filters.type) {
              works = data.works || [];
            } else {
              works = [...(data.works || []), ...(data.users || [])];
            }
          }

          const validItems = works.filter(item => item && (item.title || item.username || item.name) && (item.id || item.workId || item.userId));
          mappedWorks = (filters.itemType === 'user') ? [] : validItems
            .filter(item => !(item.userId || item.username) || item.title)
            .map(normalizeWorkEntity)
            .filter(Boolean);

          const shouldShowUsers = !filters.type &&
                                  !filters.year &&
                                  !filters.genre &&
                                  !filters.rating &&
                                  filters.itemType !== 'user';

          mappedUsers = shouldShowUsers ?
            validItems
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
              }))
            : (filters.itemType === 'user' ? validItems
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
              })) : []);
        }

  if (!shouldUseAllWorksEndpoint && !searchTerm && filters.itemType !== 'user') {

          const worksResponse = await getAllWorks({
            type: filters.type,
            genre: filters.genre,
            year: filters.year,
            rating: filters.rating
          });

          let worksArray = [];
          if (Array.isArray(worksResponse?.works)) worksArray = worksResponse.works;
          else if (Array.isArray(worksResponse?.data?.works)) worksArray = worksResponse.data.works;
          else if (Array.isArray(worksResponse?.data)) worksArray = worksResponse.data;
          else if (Array.isArray(worksResponse)) worksArray = worksResponse;

          const normalizedFromAll = worksArray
            .map(normalizeWorkEntity)
            .filter(Boolean);

          mappedWorks = mergeUniqueWorks(mappedWorks, normalizedFromAll);
        }

        const clientFilteredWorks = applyWorkFilters(mappedWorks, {
          type: filters.type || '',
          genre: filters.genre || '',
          rating: filters.rating || '',
          year: filters.year || ''
        });

        setResults({ works: clientFilteredWorks, users: mappedUsers });
      } catch (error) {
      logger.error('Failed to fetch results:', error);
      if (isMountedRef.current) {
        setResults({ works: [], users: [] });
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [query, typeFilter, yearFilter, genreFilter, ratingFilter]);

  // Fetch search results when filters or query change
  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleAddToShelf = async (workId) => {
    if (!addToShelfId) return;
    const workIdStr = String(workId);
    const isInShelf = addedWorks.has(workIdStr);

    setAddingWork(workIdStr);
    try {
      if (isInShelf) {
        await removeWorkFromShelf(addToShelfId, workId);
        setAddedWorks(prev => {
          const updated = new Set(prev);
          updated.delete(workIdStr);
          return updated;
        });
      } else {
        await addWorkToShelf(addToShelfId, workId);
        setAddedWorks(prev => new Set([...prev, workIdStr]));
      }
      setTimeout(() => setAddingWork(null), 500);
    } catch (error) {
      logger.error('Failed to toggle work in shelf:', error);
      setAddingWork(null);
    }
  };

  const handleAddToFavourites = async (workId) => {
    if (!user) {
      return;
    }

    const workIdStr = String(workId);
    const isCurrentlyFavourited = favouritedWorks.has(workIdStr);

    setFavouritingWork(workId);

    try {
      let shelfId = favouritesShelfId;

      // If we don't have the shelf ID yet, get or create it
      if (!shelfId) {
        const shelvesData = await getUserShelves(user.userId);

        // Extract the shelves array from the response: {success: true, data: {shelves: [...]}}
        const shelves = Array.isArray(shelvesData)
          ? shelvesData
          : (shelvesData.data?.shelves || shelvesData.shelves || []);

        const favourites = await getOrCreateFavouritesShelf(user.userId, shelves);
        shelfId = favourites.shelfId;
        setFavouritesShelfId(shelfId);
      }

      if (isCurrentlyFavourited) {
        // Remove from favourites
        await removeWorkFromShelf(shelfId, workId);

        setFavouritedWorks(prev => {
          const newSet = new Set([...prev]);
          newSet.delete(workIdStr);
          return newSet;
        });
      } else {
        // Add to favourites
        await addWorkToShelf(shelfId, workId);

        setFavouritedWorks(prev => {
          const newSet = new Set([...prev, workIdStr]);
          return newSet;
        });
      }

      setTimeout(() => {
        setFavouritingWork(null);
      }, 500);
    } catch (error) {
      logger.error('Failed to toggle favourite:', error);
      setFavouritingWork(null);
    }
  };

  const closeBanner = () => {
    // Remove shelf params from URL
    const newParams = new URLSearchParams(search);
    newParams.delete('addToShelf');
    newParams.delete('shelfName');
    navigate(`/search?${newParams.toString()}`, { replace: true });
  };

  const goBackToShelves = () => {
    navigate('/shelves');
  };

  // RETURN SEARCH RESULTS PAGE LAYOUT
  return (
    <>
      <FilterBar />

      {/* Fixed banner for adding to shelf on the right */}
      {addToShelfId && shelfName && (
        <div style={styles.bannerContainer}>
          <div style={styles.bannerContent}>
            <div style={styles.bannerHeader}>
              <div style={styles.bannerTitle}>
                <FiPlus size={18} />
                <span>Adding to shelf</span>
              </div>
              <button
                onClick={closeBanner}
                style={styles.bannerCloseBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <FiX size={18} />
              </button>
            </div>
            <div style={{
              fontSize: 14,
              fontWeight: '500',
              padding: '8px 0',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              "{shelfName}"
            </div>
            <button
              onClick={goBackToShelves}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '10px 14px',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 14,
                fontWeight: '600',
                transition: 'background 0.2s ease',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <FiArrowLeft size={18} />
              Back to Shelves
            </button>
          </div>
        </div>
      )}

      <div className="page-container">
        <div className="page-inner">
          <main className="page-main">
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 16px', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 0 }}>
                <div style={{ width: '100%', padding: '0 16px', boxSizing: 'border-box' }}>
                  <div style={{
                    marginTop: 16,
                    marginBottom: 24,
                    padding: '12px 16px',
                    backgroundColor: '#f8f5f0',
                    borderLeft: '4px solid #d4b895',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <span style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#666',
                      letterSpacing: 0.5,
                      textTransform: 'uppercase'
                    }}>
                      {getPageTitle()}
                    </span>
                  </div>
                </div>
              </div>

              {loading && (
                <div style={{ marginTop: 24 }}>
                  <WorkGridSkeleton count={12} columns="repeat(auto-fill, minmax(180px, 1fr))" />
                </div>
              )}

              {!loading && results.works.length === 0 && results.users.length === 0 && (
                <div>
                  <p style={{ textAlign: 'center' }}>No results found{query ? ` for "${query}"` : ' with current filters'}.</p>
                </div>
              )}

              {!loading && (results.works.length > 0 || results.users.length > 0) && (
                <>
                  {/* Works Section */}
                  {results.works.length > 0 && (
                    <div style={{ marginBottom: 40 }}>
                      <h2 style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: '#392c2cff',
                        marginBottom: 16,
                        paddingBottom: 8,
                        borderBottom: '2px solid #bfaea0',
                        letterSpacing: 0.5
                      }}>
                        WORKS ({results.works.length})
                      </h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {results.works.map((entity, idx) => {
                          // Check if this work is favourited
                          const workIdStr = String(entity.entityId);
                          const isInShelf = addedWorks.has(workIdStr);
                          const isProcessingWork = addingWork === workIdStr;

                          return (
                          <div key={entity.entityId}>
                            <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative' }}>

                              {/* Heart button for Favourites - always shown */}
                              {user && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToFavourites(entity.entityId);
                                  }}
                                  disabled={favouritingWork === entity.entityId}
                                  style={{
                                    position: 'absolute',
                                    top: 8,
                                    right: addToShelfId ? 52 : 8,
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: '#9a4207c8',
                                    color: 'white',
                                    cursor: favouritingWork === entity.entityId ? 'default' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                    transition: 'all 0.2s ease',
                                    zIndex: 10,
                                    opacity: favouritingWork === entity.entityId ? 0.6 : 1
                                  }}
                                  onMouseEnter={(e) => {
                                    if (favouritingWork !== entity.entityId) {
                                      e.currentTarget.style.transform = 'scale(1.1)';
                                      e.currentTarget.style.background = '#7d3506';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.background = '#9a4207c8';
                                  }}
                                >
                                  <FiHeart
                                    size={16}
                                    fill={favouritedWorks.has(String(entity.entityId)) ? 'white' : 'none'}
                                  />
                                </button>
                              )}

                              {/* Plus button for adding to shelf - only shown when in add mode */}
                              {addToShelfId && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToShelf(entity.entityId);
                                  }}
                                  disabled={isProcessingWork}
                                  style={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: isInShelf ? '#4caf50' : '#9a4207c8',
                                    color: 'white',
                                    cursor: isProcessingWork ? 'default' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                    transition: 'all 0.2s ease',
                                    zIndex: 10,
                                    opacity: isProcessingWork ? 0.6 : 1
                                  }}
                                  onMouseEnter={(e) => {
                                    if (isProcessingWork) return;
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                    e.currentTarget.style.background = isInShelf ? '#3d8b40' : '#7d3506';
                                  }}
                                  onMouseLeave={(e) => {
                                    if (isProcessingWork) return;
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.background = isInShelf ? '#4caf50' : '#9a4207c8';
                                  }}
                                >
                                  {isInShelf ? <FiCheck size={18} /> : <FiPlus size={18} />}
                                </button>
                              )}

                              <div
                                onClick={() => navigateAndClearFilters(`/works/${entity.entityId}`)}
                                style={{
                                  flexShrink: 0,
                                  cursor: 'pointer',
                                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-4px)';
                                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                <div style={{
                                  width: 96,
                                  height: 140,
                                  overflow: 'hidden',
                                  borderRadius: 4,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: '#f2f2f2'
                                }}>
                                  <img src={entity.coverUrl} alt={entity.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                              </div>
                              <div style={{ flex: 1, padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <ResultHeader
                                  title={entity.title}
                                  subtitle={entity.subtitle}
                                  meta={`★ ${entity.rating.toFixed(1)}`}
                                  onClick={() => navigateAndClearFilters(`/works/${entity.entityId}`)}
                                />
                                <p style={{ margin: 0, color: '#888', fontSize: 13 }}>{entity.meta}</p>
                                {entity.description && (
                                  <p style={{ margin: 0, color: '#555', fontSize: 13, lineHeight: 1.4, marginTop: 4 }}>{entity.description}</p>
                                )}
                              </div>
                            </div>
                            {idx < results.works.length - 1 && (
                              <div style={{
                                marginTop: 22,
                                borderBottom: '2px solid #9a420776',
                                paddingBottom: 6,
                                marginBottom: 12
                              }} />
                            )}
                          </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Users Section */}
                  {results.users.length > 0 && (
                    <div>
                      <h2 style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: '#392c2cff',
                        marginBottom: 16,
                        paddingBottom: 8,
                        borderBottom: '2px solid #bfaea0',
                        letterSpacing: 0.5
                      }}>
                        USERS ({results.users.length})
                      </h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {results.users.map((entity, idx) => (
                          <div key={entity.entityId}>
                            <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                              <div
                                onClick={() => navigate(`/profile/${entity.entityId}`, { state: { prevSearch: search } })}
                                style={{
                                  flexShrink: 0,
                                  cursor: 'pointer'
                                }}
                              >
                                <div
                                  style={{
                                    width: 96,
                                    height: 96,
                                    overflow: 'hidden',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: '#f2f2f2',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                  }}
                                >
                                  <img src={entity.coverUrl} alt={entity.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                              </div>
                              <div style={{ flex: 1, padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <ResultHeader
                                  title={entity.title}
                                  subtitle={entity.subtitle}
                                  meta={entity.meta}
                                  onClick={() => navigate(`/profile/${entity.entityId}`, { state: { prevSearch: search } })}
                                />
                                <p style={{ margin: 0, color: '#888', fontSize: 13 }}>User Account</p>
                              </div>
                            </div>
                            {idx < results.users.length - 1 && (
                              <div style={{
                                marginTop: 22,
                                borderBottom: '2px solid #9a420776',
                                paddingBottom: 6,
                                marginBottom: 12
                              }} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
