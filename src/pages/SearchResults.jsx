import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getAllWorks } from '../api/works';
import { searchItems } from '../api/search';
import { addWorkToShelf, removeWorkFromShelf, getOrCreateFavouritesShelf, getUserShelves, getShelfWorks } from '../api/shelves';
import FilterBar from '../components/FilterBar';
import useNavigationWithClearFilters from '../hooks/useNavigationWithClearFilters';
import useAuth from '../hooks/useAuth';
import { FiPlus, FiCheck, FiX, FiArrowLeft, FiHeart } from 'react-icons/fi';

export default function SearchResults() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { navigateAndClearFilters } = useNavigationWithClearFilters();
  const { user } = useAuth();
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
  useEffect(() => {
    const loadFavourites = async () => {
      if (!user) return;
      
      try {
        console.log('🔄 Loading favourites for user:', user.userId);
        
        // Get user's shelves
        const shelvesData = await getUserShelves(user.userId);
        console.log('📚 User shelves data:', shelvesData);
        
        // Extract the shelves array from the response: {success: true, data: {shelves: [...]}}
        const shelves = Array.isArray(shelvesData) 
          ? shelvesData 
          : (shelvesData.data?.shelves || shelvesData.shelves || []);
        console.log('📚 Shelves array:', shelves);
        console.log('📚 Shelves count:', shelves.length);
        if (shelves.length > 0) {
          console.log('📚 Shelf names:', shelves.map(s => s.name));
        }
        
        // Find or create Favourites shelf
        const favourites = await getOrCreateFavouritesShelf(user.userId, shelves);
        console.log('⭐ Favourites shelf after getOrCreate:', favourites);
        console.log('⭐ Favourites shelf:', favourites);
        setFavouritesShelfId(favourites.shelfId);
        
        // Get works in Favourites shelf
        const favouritesWorksData = await getShelfWorks(favourites.shelfId);
        console.log('📦 Raw favourites works data:', favouritesWorksData);
        
        // Extract works array from API response: {success: true, data: {works: [...]}}
        let favouritesWorks = [];
        if (favouritesWorksData.data && favouritesWorksData.data.works) {
          favouritesWorks = favouritesWorksData.data.works;
        } else if (favouritesWorksData.works) {
          favouritesWorks = favouritesWorksData.works;
        } else if (Array.isArray(favouritesWorksData)) {
          favouritesWorks = favouritesWorksData;
        }
        console.log('✨ Favourites works array:', favouritesWorks);
        
        // Create a set of work IDs that are in Favourites
        // Handles both populated work objects and primitive IDs from mock data
        const extractedIds = favouritesWorks.map(w => {
          if (w === null || w === undefined) {
            return null;
          }

          if (typeof w === 'string' || typeof w === 'number') {
            console.log('Work in Favourites (primitive ID):', w);
            return String(w);
          }

          const nestedWork = typeof w.work === 'object' ? w.work : null;
          const nestedWorkId = nestedWork ? (nestedWork.id || nestedWork._id) : null;
          const id = w.id || w.workId || w._id || w.entityId || nestedWorkId;
          console.log('Work in Favourites (object):', w.title || w.name || 'Unknown title', 'Extracted ID:', id);
          return id ? String(id) : null;
        }).filter(Boolean);

        const workIds = new Set(extractedIds);
        console.log('💾 Favourited work IDs (as strings):', Array.from(workIds));
        setFavouritedWorks(workIds);
      } catch (error) {
        console.error('❌ Failed to load favourites:', error);
      }
    };
    
    loadFavourites();
  }, [user]);

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

  useEffect(() => {
    const fetchResults = async () => {
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
        
        console.log('🔍 SearchResults: Applied filters:', {
          searchTerm,
          typeFilter,
          yearFilter, 
          genreFilter,
          ratingFilter,
          finalFilters: filters
        });
        
        console.log('🔍 SearchResults: Raw URL params:', {
          type: params.get('type'),
          year: params.get('year'),
          genre: params.get('genre'),
          rating: params.get('rating')
        });

        // Always use search API to support both works and users
        console.log('📡 SearchResults: Making API call with:', { searchTerm, filters });
        
        let data;
        // Always use searchItems API (works with or without search term)
        data = await searchItems(searchTerm, filters);
        console.log('📦 SearchResults: Search API response:', data);
        
        // Extract results based on API response format
        let works = [];
        // Search API returns { results: [...] } or { works: [...], users: [...] }
        if (data.results) {
          works = data.results;
        } else if (data.works || data.users) {
          // Combine works and users based on itemType filter (which comes from typeFilter="user")
          if (filters.itemType === 'user') {
            works = data.users || []; // Users will be handled differently in mapping
          } else {
            // Show both works and users when no itemType filter, or just works if work-type specified
            if (filters.type) {
              // If a specific work type is selected (movie, book, etc.), show only works
              works = data.works || [];
            } else {
              // No filters or only non-type filters, show both
              works = [...(data.works || []), ...(data.users || [])];
            }
          }
        }
        
        console.log('📦 SearchResults: Extracted works:', works.length);
        
        // Separate works and users, then map each
        const validItems = works.filter(item => item && (item.title || item.username || item.name) && (item.id || item.workId || item.userId));
        
        // Only process works if we're showing works
        const mappedWorks = (filters.itemType === 'user') ? [] : validItems
          .filter(item => !(item.userId || item.username) || item.title) // Items with title are works
          .map(item => ({
            entityId: String(item.id || item.workId),
            kind: 'work',
            title: item.title,
            coverUrl: item.coverUrl || '/album_covers/default.jpg',
            subtitle: item.creator || 'Unknown Creator',
            meta: `${item.year || 'Unknown Year'} • ${item.type || 'Unknown Type'} • ${Array.isArray(item.genres) ? item.genres.join(', ') : (item.genre || 'Unknown Genre')}`,
            description: item.description || '',
            rating: item.averageRating || item.rating || 0
          }));
        
        // Only process users if we're not filtering by a specific work type
        // Also hide users when year, genre, or rating filters are active (these only apply to works)
        const shouldShowUsers = !filters.type && 
                                !filters.year && 
                                !filters.genre && 
                                !filters.rating && 
                                filters.itemType !== 'user';
        
        const mappedUsers = shouldShowUsers ? 
          validItems
            .filter(item => (item.userId || item.username) && !item.title) // Users don't have title
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
            .filter(item => (item.userId || item.username) && !item.title) // Users don't have title
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
        
        console.log('✅ SearchResults: Filtered results:', {
          totalWorks: mappedWorks.length,
          totalUsers: mappedUsers.length,
          appliedFilters: filters,
          searchTerm
        });
        
        // Debug: Log the first few work IDs from search results
        if (mappedWorks.length > 0) {
          console.log('🔍 Sample work IDs from search results:', mappedWorks.slice(0, 3).map(w => ({
            title: w.title,
            entityId: w.entityId,
            type: typeof w.entityId
          })));
        }
        
        setResults({ works: mappedWorks, users: mappedUsers });
      } catch (error) {
        console.error('Failed to fetch results:', error);
        setResults({ works: [], users: [] });
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [query, typeFilter, yearFilter, genreFilter, ratingFilter]);

  const handleAddToShelf = async (workId) => {
    if (!addToShelfId) return;
    
    setAddingWork(workId);
    try {
      await addWorkToShelf(addToShelfId, workId);
      setAddedWorks(prev => new Set([...prev, workId]));
      setTimeout(() => setAddingWork(null), 500);
    } catch (error) {
      console.error('Failed to add work to shelf:', error);
      setAddingWork(null);
    }
  };

  const handleAddToFavourites = async (workId) => {
    if (!user) {
      console.log('⏭️ Skipping - no user');
      return;
    }
    
    const workIdStr = String(workId);
    const isCurrentlyFavourited = favouritedWorks.has(workIdStr);
    
    console.log('💗 Toggling favourite for work:', workId, 'Currently favourited:', isCurrentlyFavourited);
    setFavouritingWork(workId);
    
    try {
      let shelfId = favouritesShelfId;
      
      // If we don't have the shelf ID yet, get or create it
      if (!shelfId) {
        console.log('🔍 No shelf ID, creating/fetching Favourites shelf');
        const shelvesData = await getUserShelves(user.userId);
        console.log('📚 Fetched shelves data:', shelvesData);
        
        // Extract the shelves array from the response: {success: true, data: {shelves: [...]}}
        const shelves = Array.isArray(shelvesData) 
          ? shelvesData 
          : (shelvesData.data?.shelves || shelvesData.shelves || []);
        console.log('📚 Shelves array:', shelves);
        
        const favourites = await getOrCreateFavouritesShelf(user.userId, shelves);
        shelfId = favourites.shelfId;
        setFavouritesShelfId(shelfId);
        console.log('✅ Got shelf ID:', shelfId);
      }
      
      if (isCurrentlyFavourited) {
        // Remove from favourites
        console.log('➖ Removing work', workId, 'from shelf', shelfId);
        await removeWorkFromShelf(shelfId, workId);
        console.log('✅ Work removed successfully!');
        
        setFavouritedWorks(prev => {
          const newSet = new Set([...prev]);
          newSet.delete(workIdStr);
          console.log('💾 Updated favourited works (removed):', Array.from(newSet));
          return newSet;
        });
      } else {
        // Add to favourites
        console.log('➕ Adding work', workId, 'to shelf', shelfId);
        await addWorkToShelf(shelfId, workId);
        console.log('✅ Work added successfully!');
        
        setFavouritedWorks(prev => {
          const newSet = new Set([...prev, workIdStr]);
          console.log('💾 Updated favourited works (added):', Array.from(newSet));
          return newSet;
        });
      }
      
      setTimeout(() => {
        setFavouritingWork(null);
        console.log('✨ Animation complete');
      }, 500);
    } catch (error) {
      console.error('❌ Failed to toggle favourite:', error);
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

  return (
    <>
      <FilterBar />
      
      <div className="page-container">
        <div className="page-inner">
          {/* Banner for adding to shelf */}
          {addToShelfId && shelfName && (
            <div
              style={{
                background: '#9a4207',
                padding: '12px 16px',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxSizing: 'border-box',
                borderRadius: 10,
                marginTop: 8
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  color: 'white'
                }}
              >
            <button
              onClick={goBackToShelves}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '8px 14px',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 14,
                fontWeight: '600',
                transition: 'background 0.2s ease'
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
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: 15,
              fontWeight: '600'
            }}>
              <FiPlus size={18} />
              <span>Adding works to "{shelfName}"</span>
            </div>
            <button
              onClick={closeBanner}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: 8,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <FiX size={20} />
            </button>
              </div>
            </div>
          )}
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

              {loading && <p style={{ textAlign: 'center' }}>Loading results…</p>}

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
                          // Debug: Check if this work is favourited
                          const isFavourited = favouritedWorks.has(String(entity.entityId));
                          if (idx === 0) {
                            console.log('🔍 First work check:', {
                              entityId: entity.entityId,
                              entityIdType: typeof entity.entityId,
                              favouritedWorks: Array.from(favouritedWorks),
                              isFavourited: isFavourited
                            });
                          }
                          
                          return (
                          <div key={entity.entityId}>
                            <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative' }}>
                              
                              {/* Heart button for Favourites - always shown */}
                              {user && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('❤️ Heart clicked for work:', entity.entityId);
                                    console.log('Current favourited works:', Array.from(favouritedWorks));
                                    console.log('Is favourited?', favouritedWorks.has(String(entity.entityId)));
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
                                  disabled={addedWorks.has(entity.entityId) || addingWork === entity.entityId}
                                  style={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: addedWorks.has(entity.entityId) ? '#4caf50' : '#9a4207c8',
                                    color: 'white',
                                    cursor: addedWorks.has(entity.entityId) || addingWork === entity.entityId ? 'default' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                    transition: 'all 0.2s ease',
                                    zIndex: 10,
                                    opacity: addingWork === entity.entityId ? 0.6 : 1
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!addedWorks.has(entity.entityId) && addingWork !== entity.entityId) {
                                      e.currentTarget.style.transform = 'scale(1.1)';
                                      e.currentTarget.style.background = '#7d3506';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!addedWorks.has(entity.entityId)) {
                                      e.currentTarget.style.transform = 'scale(1)';
                                      e.currentTarget.style.background = '#9a4207c8';
                                    }
                                  }}
                                >
                                  {addedWorks.has(entity.entityId) ? <FiCheck size={18} /> : <FiPlus size={18} />}
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
                                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{entity.title}</h3>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
                                  <p style={{ margin: 0, color: '#666', fontSize: 14 }}>{entity.subtitle}</p>
                                  <span style={{ margin: 0, color: '#888', fontSize: 12 }}>★ {entity.rating.toFixed(1)}</span>
                                </div>
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
                                  height: 96, 
                                  overflow: 'hidden', 
                                  borderRadius: '50%', 
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
                                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{entity.title}</h3>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
                                  <p style={{ margin: 0, color: '#666', fontSize: 14 }}>{entity.subtitle}</p>
                                  <span style={{ margin: 0, color: '#888', fontSize: 12 }}>{entity.meta}</span>
                                </div>
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
