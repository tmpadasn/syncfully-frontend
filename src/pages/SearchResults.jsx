import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getAllWorks } from '../api/works';
import { searchItems } from '../api/search';
import FilterBar from '../components/FilterBar';
import useNavigationWithClearFilters from '../hooks/useNavigationWithClearFilters';

export default function SearchResults() {
  const { search } = useLocation();
  const { navigateAndClearFilters } = useNavigationWithClearFilters();
  const params = new URLSearchParams(search);
  const query = params.get('q') || '';
  const typeFilter = params.get('type') || '';        // Work type filter (movie, book, etc.)
  const itemTypeFilter = params.get('itemType') || ''; // Item type filter (work, user, etc.)
  const yearFilter = params.get('year') || '';
  const genreFilter = params.get('genre') || '';
  const ratingFilter = params.get('rating') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const searchTerm = query.trim();
      
      try {
        // Prepare filters for backend - ensure consistent parameter names
        const filters = {};
        if (typeFilter && typeFilter !== 'Any' && typeFilter !== '') filters.type = typeFilter;
        if (itemTypeFilter && itemTypeFilter !== 'Any' && itemTypeFilter !== '') filters.itemType = itemTypeFilter;
        if (yearFilter && yearFilter !== 'Any' && yearFilter !== '') filters.year = yearFilter;
        if (genreFilter && genreFilter !== 'Any' && genreFilter !== '') filters.genre = genreFilter; // Backend will convert to genres array
        if (ratingFilter && ratingFilter !== 'Any' && ratingFilter !== '') filters.rating = ratingFilter;
        
        console.log('🔍 SearchResults: Applied filters:', {
          searchTerm,
          typeFilter,
          itemTypeFilter,
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

        // Use search API if we have a search term, otherwise get all works with filters
        console.log('📡 SearchResults: Making API call with:', { searchTerm, filters });
        
        let data;
        if (searchTerm) {
          // Use search API for text search with filters
          data = await searchItems(searchTerm, filters);
          console.log('📦 SearchResults: Search API response:', data);
        } else {
          // Use works API for filter-only queries
          data = await getAllWorks(filters);
          console.log('📦 SearchResults: Works API response:', data);
        }
        
        // Extract results based on API response format
        let works = [];
        if (searchTerm) {
          // Search API returns { results: [...] } or { works: [...], users: [...] }
          if (data.results) {
            works = data.results;
          } else if (data.works || data.users) {
            // Combine works and users based on itemType filter
            if (itemTypeFilter === 'work') {
              works = data.works || [];
            } else if (itemTypeFilter === 'user') {
              works = data.users || []; // Users will be handled differently in mapping
            } else {
              // Show both works and users when no itemType filter
              works = [...(data.works || []), ...(data.users || [])];
            }
          }
        } else {
          // Works API returns { works: [...] } - only works, no users
          works = data.works || data.data || [];
        }
        
        console.log('📦 SearchResults: Extracted works:', works.length);
        
        // Map and filter valid works and users
        const mappedResults = works
          .filter(item => item && (item.title || item.name) && (item.id || item.workId || item.userId))
          .map(item => {
            // Handle both works and users
            if (item.name && item.userId) {
              // This is a user
              return {
                workId: item.userId,
                title: item.name,
                coverUrl: item.avatarUrl || '/album_covers/default.jpg',
                creator: 'User',
                year: item.joinYear || 'Unknown Year',
                type: 'user',
                description: item.bio || 'User profile',
                genre: 'User',
                rating: 0
              };
            } else {
              // This is a work
              return {
                workId: item.id || item.workId,
                title: item.title,
                coverUrl: item.coverUrl || '/album_covers/default.jpg',
                creator: item.creator || 'Unknown Creator',
                year: item.year || 'Unknown Year',
                type: item.type || 'Unknown Type',
                description: item.description || '',
                genre: Array.isArray(item.genres) ? item.genres.join(', ') : (item.genre || 'Unknown Genre'),
                rating: item.averageRating || item.rating || 0
              };
            }
          });
        
        console.log('✅ SearchResults: Filtered results:', {
          totalFound: mappedResults.length,
          appliedFilters: filters,
          searchTerm
        });
        
        setResults(mappedResults);
      } catch (error) {
        console.error('Failed to fetch results:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [query, typeFilter, itemTypeFilter, yearFilter, genreFilter, ratingFilter]);

  return (
    <>
      <FilterBar />
      <RightFilterColumn currentType={itemTypeFilter} search={search} />
      <div className="page-container">
        <div className="page-inner">
          <main className="page-main">
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 16px', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 0 }}>
                <div style={{ width: '100%', padding: '0 16px', boxSizing: 'border-box' }}>
                  {loading ? (
                    <h2 style={{ marginTop: -8, marginBottom: 6, fontSize: 16, fontWeight: 400 }}>Searching backend…</h2>
                  ) : (
                    <h3 className="section-title">{query ? `SHOWING RESULTS FOR "${query}"` : 'ALL BACKEND RESULTS'}</h3>
                  )}
                </div>
              </div>

              {loading && <p style={{ textAlign: 'center' }}>Loading results…</p>}

              {!loading && results.length === 0 && (
                <div>
                  <p style={{ textAlign: 'center' }}>No works found in backend{query ? ` for "${query}"` : ' with current filters'}.</p>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {results.map((work, idx) => (
                    <div key={work.workId}>
                      <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div
                          onClick={() => navigateAndClearFilters(`/works/${work.workId}`)}
                          style={{ flexShrink: 0, cursor: 'pointer' }}
                        >
                          <div style={{ 
                            width: 96, 
                            height: 140, 
                            overflow: 'hidden', 
                            borderRadius: 4, 
                            cursor: 'pointer', 
                            transition: 'transform 0.2s' 
                          }}
                               onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                               onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                          >
                            <img src={work.coverUrl} alt={work.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        </div>
                        <div style={{ flex: 1, padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{work.title}</h3>
                          <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
                            <p style={{ margin: 0, color: '#666', fontSize: 14 }}>{work.creator}</p>
                            <span style={{ margin: 0, color: '#888', fontSize: 12 }}>★ {work.rating.toFixed(1)}</span>
                          </div>
                          <p style={{ margin: 0, color: '#888', fontSize: 13 }}>{work.year} • {work.type} • {work.genre}</p>
                          {work.description && (
                            <p style={{ margin: 0, color: '#555', fontSize: 13, lineHeight: 1.4, marginTop: 4 }}>{work.description}</p>
                          )}
                        </div>
                      </div>
                      {idx < results.length - 1 && (
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
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

function RightFilterColumn({ currentType, search }) {
  const { navigateAndClearFilters } = useNavigationWithClearFilters();
  const navigate = useNavigate();

  const choices = [
    { key: '', label: 'All' },
    { key: 'work', label: 'Works' },    // Use 'work' to match backend item-type
    { key: 'user', label: 'Users' },    // Use 'user' to match backend item-type
    // Note: 'shelves' not supported by backend yet
  ];

  const handleSelect = (key) => {
    const params = new URLSearchParams(search || '');
    if (!key) {
      params.delete('itemType');  // Use itemType parameter for right filter
    } else {
      params.set('itemType', key);  // Use itemType parameter for right filter
    }
    
    console.log('🔍 RightFilterColumn: Selected itemType:', key);
    console.log('🔍 RightFilterColumn: New URL params:', params.toString());
    
    // Navigate to same path with updated search - this stays on search page so filters are preserved
    navigate({ search: params.toString() });
  };

  return (
    <aside
      style={{
        position: 'fixed',
        right: 20,
        top: 140,
        width: 160,
        padding: '12px 20px',
        borderTop: '2px solid #bfaea0',
        borderBottom: '2px solid #bfaea0',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        zIndex: 50,
        boxSizing: 'border-box'
      }}
      aria-label="result-type-filter"
    >
      <div style={{ textAlign: 'center', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#392c2cff', letterSpacing: 0.5 }}>
        {currentType ? currentType.toUpperCase() : 'ITEM TYPE'}
      </div>
      <div style={{ height: 2, width: '60%', background: '#bfaea0', margin: '6px auto 12px', borderRadius: 2 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {choices.map((c) => {
          const selected = (currentType || '') === (c.key || '');
          return (
            <button
              key={c.key || 'all'}
              onClick={() => handleSelect(c.key)}
              style={{
                width: '100%',
                padding: '8px 12px',
                textAlign: 'center',
                background: 'transparent',
                border: 'none',
                color: selected ? '#d4b895' : '#392c2cff',
                fontWeight: selected ? 600 : 400,
                fontSize: '13px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: 6,
                backgroundColor: selected ? '#f8f5f0' : 'transparent',
                border: selected ? '1px solid #d4b895' : '1px solid transparent',
                transition: 'all 0.2s ease',
                letterSpacing: 0.5
              }}
              onMouseEnter={(e) => {
                if (!selected) {
                  e.target.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (!selected) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
              aria-pressed={selected}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
