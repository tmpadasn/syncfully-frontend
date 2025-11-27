import { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiChevronDown, FiBook, FiMusic, FiFilm } from 'react-icons/fi';
import { getAllWorks } from '../api/works';
import logger from '../utils/logger';

export default function FilterBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  
  // Dynamic filter options from backend
  const [filterOptions, setFilterOptions] = useState({
    types: [],
    years: [],
    genres: [],
    genresByType: {}, // Map of genre -> type (book, music, movie)
    ratings: ['5','4','3','2','1'] // Standard rating scale
  });
  const [optionsLoaded, setOptionsLoaded] = useState(false);
  
  // Load filter options from backend on component mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const worksData = await getAllWorks();
        const works = worksData?.works || worksData?.data || [];
        
        if (works.length > 0) {
          // Extract unique types from backend data
          const types = [...new Set(
            works.map(work => work.type)
              .filter(Boolean)
          )].sort();
          
          // Generate year range from 1850 to current year
          const currentYear = new Date().getFullYear();
          const years = [];
          for (let year = currentYear; year >= 1850; year--) {
            years.push(String(year));
          }
          
          // Extract unique genres from backend data
          const genresByType = {}; // Map genre -> type
          const genresSet = new Set();
          
          works.forEach(work => {
            const workType = work.type; // book, music, movie
            let workGenres = [];
            
            if (Array.isArray(work.genres)) {
              workGenres = work.genres;
            } else if (work.genre) {
              workGenres = work.genre.split(/[,;]/).map(g => g.trim());
            }
            
            workGenres.forEach(genre => {
              if (genre) {
                genresSet.add(genre);
                // Map this genre to its type
                if (!genresByType[genre]) {
                  genresByType[genre] = workType;
                }
              }
            });
          });
          
          const genres = Array.from(genresSet).sort();
          
          setFilterOptions({
            types: types,
            years: years,
            genres: genres,
            genresByType: genresByType,
            ratings: ['5','4','3','2','1'] // Standard rating scale
          });
        } else {
          logger.warn('⚠️ FilterBar: No works found in backend, using empty arrays');
          // Use empty arrays when no backend data
          setFilterOptions({
            types: [],
            years: [],
            genres: [],
            genresByType: {},
            ratings: ['5','4','3','2','1']
          });
        }
      } catch (error) {
        logger.error('❌ FilterBar: Failed to load filter options from backend:', error);
        // Use empty arrays on error - no fallback to mock data
        setFilterOptions({
          types: [],
          years: [],
          genres: [],
          genresByType: {},
          ratings: ['5','4','3','2','1']
        });
      } finally {
        setOptionsLoaded(true);
      }
    };
    
    loadFilterOptions();
  }, []);

  function updateParam(key, value) {
    if (!value) params.delete(key);
    else params.set(key, value);

    navigate(
      { pathname: location.pathname, search: params.toString() },
      { replace: true }
    );
  }

  const outer = {
    display: 'flex',
    justifyContent: 'center',
    padding: '12px 0',
    background: 'var(--bg)', // Match page background
    width: '100%',
    boxSizing: 'border-box',
  };

  const bar = {
    width: '100%',
    maxWidth: '1100px', // Match page max-width
    boxSizing: 'border-box',
    margin: '0 auto',
    padding: '12px 20px',
    borderTop: '2px solid #bfaea0', // Match section-title border color
    borderBottom: '2px solid #bfaea0',
    backgroundColor: '#fff', // Match card background
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', // Match work-card shadow
  };

  const container = {
    display: 'flex',
    gap: 24, // Better spacing between filter options
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  };

  return (
    <div style={outer}>
      <div style={bar}>
        {!optionsLoaded ? (
          <div style={{ 
            ...container, 
            justifyContent: 'center',
            color: '#8a6f5f',
            fontSize: 14,
            fontStyle: 'italic'
          }}>
            Loading filters...
          </div>
        ) : (
        <div style={container}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <MenuControl
              label="TYPE"
              currentValue={params.get('type') || ''}
              options={[
                { label: 'ALL', value: '' },
                { label: 'USERS', value: 'user' }, // Add Users as a special type
                ...filterOptions.types.map(t => {
                  let displayLabel = t.toUpperCase();
                  // Pluralize labels for better readability
                  if (t === 'book') displayLabel = 'BOOKS';
                  else if (t === 'movie') displayLabel = 'MOVIES';
                  // music stays as MUSIC
                  return { 
                    label: displayLabel, 
                    value: t // Keep original backend value (movie, book, etc.)
                  };
                }),
              ]}
              onSelect={v => updateParam('type', v)}
              disabled={!optionsLoaded}
            />
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <MenuControl
              label="YEAR"
              currentValue={params.get('year') || ''}
              options={[
                { label: 'ALL', value: '' },
                ...filterOptions.years.map(y => ({ 
                  label: `${y}+`, 
                  value: y 
                })),
              ]}
              onSelect={v => updateParam('year', v)}
              disabled={!optionsLoaded}
            />
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <MenuControl
              label="GENRE"
              currentValue={params.get('genre') || ''}
              options={[
                { label: 'ALL', value: '' },
                ...filterOptions.genres.map(g => ({ 
                  label: g.toUpperCase(), 
                  value: g, // Keep original backend value
                  type: filterOptions.genresByType[g] // Add type for icon
                })),
              ]}
              onSelect={v => updateParam('genre', v)}
              disabled={!optionsLoaded}
              showIcons={true} // Enable icons for genre
            />
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <MenuControl
              label="RATING"
              currentValue={params.get('rating') || ''}
              options={[
                { label: 'ALL', value: '' },
                ...filterOptions.ratings.map(r => ({
                  label: `${r}★+`.toUpperCase(),
                  value: r,
                })),
              ]}
              onSelect={v => updateParam('rating', v)}
              disabled={!optionsLoaded}
            />
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

function MenuControl({ label, options, onSelect, currentValue = '', disabled = false, showIcons = false }) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const ref = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  // Keyboard navigation for dropdown
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      const flatOptions = !showIcons 
        ? options 
        : options; // In case of grouped options, we still navigate through all

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          setOpen(false);
          buttonRef.current?.focus();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => (prev < flatOptions.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => (prev > 0 ? prev - 1 : flatOptions.length - 1));
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < flatOptions.length) {
            onSelect(flatOptions[focusedIndex].value);
            setOpen(false);
            buttonRef.current?.focus();
          }
          break;
        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setFocusedIndex(flatOptions.length - 1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, focusedIndex, options, onSelect, showIcons]);

  // Reset focused index when opening
  useEffect(() => {
    if (open) {
      setFocusedIndex(-1);
    }
  }, [open]);

  // Find the currently selected option to display its label
  const selectedOption = options.find(opt => opt.value === currentValue);
  // Show category name when no filter is selected (empty currentValue) or when "ALL" is selected
  const displayLabel = (selectedOption && currentValue !== '') ? selectedOption.label : label;
  const isSelected = currentValue && currentValue !== '';
  
  // Helper to get icon for a type
  const getIcon = (type) => {
    switch(type) {
      case 'book':
        return <FiBook size={14} style={{ opacity: 0.6, flexShrink: 0, width: '14px', height: '14px' }} />;
      case 'music':
        return <FiMusic size={14} style={{ opacity: 0.6, flexShrink: 0, width: '14px', height: '14px' }} />;
      case 'movie':
        return <FiFilm size={14} style={{ opacity: 0.6, flexShrink: 0, width: '14px', height: '14px' }} />;
      default:
        return null;
    }
  };
  
  // Group options by type if showIcons is true
  const groupedOptions = showIcons ? (() => {
    const groups = { book: [], music: [], movie: [], other: [] };
    
    options.forEach(opt => {
      if (opt.value === '') {
        // ALL option stays at top
        return;
      }
      const type = opt.type || 'other';
      if (groups[type]) {
        groups[type].push(opt);
      } else {
        groups.other.push(opt);
      }
    });
    
    return groups;
  })() : null;

  const labelStyle = {
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '8px 16px',
    textAlign: 'center',
    cursor: disabled ? 'default' : 'pointer',
    letterSpacing: 0.5,
    opacity: disabled ? 0.6 : 1,
    color: isSelected ? '#d4b895' : '#392c2cff', // Highlight selected filters
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    minWidth: '80px',
    backgroundColor: isSelected ? '#f8f5f0' : 'transparent', // Background for selected
    border: isSelected ? '1px solid #d4b895' : '1px solid transparent', // Border for selected
  };

  const menuStyle = {
    position: 'absolute',
    top: 44, // Adjust for new label height
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#fff',
    boxShadow: '0 6px 20px rgba(0,0,0,0.12)', // Match hover shadow
    borderRadius: 8,
    padding: 8,
    zIndex: 40,
    minWidth: 160,
    border: '1px solid #bfaea0', // Match accent color
    maxHeight: '400px', // Limit height for scrolling
    overflowY: 'auto', // Enable vertical scrolling
  };

  const optStyle = {
    padding: '8px 12px',
    cursor: 'pointer',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 400,
    textTransform: 'uppercase',
    color: '#392c2cff', // Match text color
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  };

  const wrapper = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    position: 'relative',
  };

  return (
    <div style={wrapper} ref={ref}>
      <button
        ref={buttonRef}
        type="button"
        style={{
          ...labelStyle,
          backgroundColor: open ? '#f5f5f5' : (isSelected ? '#f8f5f0' : 'transparent'),
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        onClick={() => !disabled && setOpen(s => !s)}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.target.style.backgroundColor = '#f5f5f5';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !open) {
            e.target.style.backgroundColor = isSelected ? '#f8f5f0' : 'transparent';
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label} filter${isSelected ? `, currently set to ${displayLabel}` : ''}`}
        disabled={disabled}
      >
        {disabled ? 'LOADING...' : displayLabel}
        {!disabled && <FiChevronDown style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} aria-hidden="true" />}
      </button>
      {open && !disabled && (
        <div 
          ref={menuRef}
          style={menuStyle} 
          role="listbox"
          aria-label={`${label} options`}
        >
          {!showIcons ? (
            // Regular options without grouping
            options.map((opt, idx) => (
              <div
                key={opt.label + opt.value}
                style={{
                  ...optStyle,
                  backgroundColor: focusedIndex === idx ? '#f5f5f5' : 'transparent',
                }}
                onClick={() => {
                  onSelect(opt.value);
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f5f5f5';
                  setFocusedIndex(idx);
                }}
                onMouseLeave={(e) => {
                  if (focusedIndex !== idx) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
                role="option"
                aria-selected={opt.value === currentValue}
              >
                {opt.label}
              </div>
            ))
          ) : (
            // Grouped options with icons
            <>
              {/* ALL option */}
              {options.filter(opt => opt.value === '').map((opt, idx) => (
                <div
                  key={opt.label + opt.value}
                  style={{
                    ...optStyle, 
                    marginBottom: 8, 
                    borderBottom: '1px solid #e0e0e0', 
                    paddingBottom: 8,
                    backgroundColor: focusedIndex === idx ? '#f5f5f5' : 'transparent',
                  }}
                  onClick={() => {
                    onSelect(opt.value);
                    setOpen(false);
                    buttonRef.current?.focus();
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                    setFocusedIndex(idx);
                  }}
                  onMouseLeave={(e) => {
                    if (focusedIndex !== idx) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  role="option"
                  aria-selected={opt.value === currentValue}
                >
                  {opt.label}
                </div>
              ))}
              
              {/* Book genres */}
              {groupedOptions.book.length > 0 && (
                <>
                  <div style={{ 
                    padding: '4px 12px', 
                    fontSize: 11, 
                    fontWeight: 600, 
                    color: '#999',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginTop: 4
                  }}>
                    Books
                  </div>
                  {groupedOptions.book.map(opt => (
                    <div
                      key={opt.label + opt.value}
                      style={{...optStyle, display: 'flex', alignItems: 'center', gap: 8}}
                      onClick={() => {
                        onSelect(opt.value);
                        setOpen(false);
                        buttonRef.current?.focus();
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      role="option"
                      aria-selected={opt.value === currentValue}
                    >
                      {getIcon('book')}
                      <span>{opt.label}</span>
                    </div>
                  ))}
                </>
              )}
              
              {/* Music genres */}
              {groupedOptions.music.length > 0 && (
                <>
                  <div style={{ 
                    padding: '4px 12px', 
                    fontSize: 11, 
                    fontWeight: 600, 
                    color: '#999',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginTop: 8
                  }}>
                    Music
                  </div>
                  {groupedOptions.music.map(opt => (
                    <div
                      key={opt.label + opt.value}
                      style={{...optStyle, display: 'flex', alignItems: 'center', gap: 8}}
                      onClick={() => {
                        onSelect(opt.value);
                        setOpen(false);
                        buttonRef.current?.focus();
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      role="option"
                      aria-selected={opt.value === currentValue}
                    >
                      {getIcon('music')}
                      <span>{opt.label}</span>
                    </div>
                  ))}
                </>
              )}
              
              {/* Movie genres */}
              {groupedOptions.movie.length > 0 && (
                <>
                  <div style={{ 
                    padding: '4px 12px', 
                    fontSize: 11, 
                    fontWeight: 600, 
                    color: '#999',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginTop: 8
                  }}>
                    Movies
                  </div>
                  {groupedOptions.movie.map(opt => (
                    <div
                      key={opt.label + opt.value}
                      style={{...optStyle, display: 'flex', alignItems: 'center', gap: 8}}
                      onClick={() => {
                        onSelect(opt.value);
                        setOpen(false);
                        buttonRef.current?.focus();
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      role="option"
                      aria-selected={opt.value === currentValue}
                    >
                      {getIcon('movie')}
                      <span>{opt.label}</span>
                    </div>
                  ))}
                </>
              )}
              
              {/* Other genres (if any) */}
              {groupedOptions.other.length > 0 && (
                <>
                  <div style={{ 
                    padding: '4px 12px', 
                    fontSize: 11, 
                    fontWeight: 600, 
                    color: '#999',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginTop: 8
                  }}>
                    Other
                  </div>
                  {groupedOptions.other.map(opt => (
                    <div
                      key={opt.label + opt.value}
                      style={optStyle}
                      onClick={() => {
                        onSelect(opt.value);
                        setOpen(false);
                        buttonRef.current?.focus();
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      role="option"
                      aria-selected={opt.value === currentValue}
                    >
                      {opt.label}
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
