import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getAllWorks } from '../api/works';
import { searchItems } from '../api/search';
import { addWorkToShelf } from '../api/shelves';
import FilterBar from '../components/FilterBar';
import useNavigationWithClearFilters from '../hooks/useNavigationWithClearFilters';
import { FiPlus, FiCheck, FiX, FiArrowLeft } from 'react-icons/fi';

export default function SearchResults() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { navigateAndClearFilters } = useNavigationWithClearFilters();
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
            entityId: item.id || item.workId,
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
                        {results.works.map((entity, idx) => (
                          <div key={entity.entityId}>
                            <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative' }}>
                              
                              {/* Plus button for adding to shelf */}
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
                        ))}
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
