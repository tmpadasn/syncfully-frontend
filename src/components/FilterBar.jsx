import { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import { getAllWorks } from '../api/works';

export default function FilterBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  
  // Dynamic filter options from backend
  const [filterOptions, setFilterOptions] = useState({
    types: [],
    years: [],
    genres: [],
    ratings: ['5','4','3','2','1'] // Standard rating scale
  });
  const [optionsLoaded, setOptionsLoaded] = useState(false);
  
  // Load filter options from backend on component mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        console.log('🔍 FilterBar: Loading filter options from backend...');
        const worksData = await getAllWorks();
        const works = worksData?.works || worksData?.data || [];
        
        console.log('🔍 FilterBar: Backend works data:', works.length, 'items');
        
        if (works.length > 0) {
          // Extract unique types from backend data
          const types = [...new Set(
            works.map(work => work.type)
              .filter(Boolean)
          )].sort();
          
          console.log('🔍 FilterBar: Raw backend types:', types);
          console.log('🔍 FilterBar: Sample work:', works[0]);
          
          // Extract unique years from backend data
          const years = [...new Set(
            works.map(work => work.year)
              .filter(year => year && !isNaN(year))
              .map(year => String(year))
          )].sort((a, b) => Number(b) - Number(a)); // Most recent first
          
          // Extract unique genres from backend data
          const genres = [...new Set(
            works.flatMap(work => {
              if (Array.isArray(work.genres)) {
                return work.genres;
              } else if (work.genre) {
                // Split on common separators and clean up
                return work.genre.split(/[,;]/).map(g => g.trim());
              }
              return [];
            })
            .filter(Boolean)
          )].sort();
          
          console.log('🔍 FilterBar: Raw backend genres:', genres);
          
          console.log('🔍 FilterBar: Extracted from backend:', {
            types: types.length,
            years: years.length, 
            genres: genres.length
          });
          
          setFilterOptions({
            types: types,
            years: years,
            genres: genres,
            ratings: ['5','4','3','2','1'] // Standard rating scale
          });
          
          console.log('✅ FilterBar: Using backend filter options exclusively');
        } else {
          console.warn('⚠️ FilterBar: No works found in backend, using empty arrays');
          // Use empty arrays when no backend data
          setFilterOptions({
            types: [],
            years: [],
            genres: [],
            ratings: ['5','4','3','2','1']
          });
        }
      } catch (error) {
        console.error('❌ FilterBar: Failed to load filter options from backend:', error);
        console.log('❌ FilterBar: Using empty arrays due to backend error');
        // Use empty arrays on error - no fallback to mock data
        setFilterOptions({
          types: [],
          years: [],
          genres: [],
          ratings: ['5','4','3','2','1']
        });
      } finally {
        setOptionsLoaded(true);
        console.log('✅ FilterBar: Filter options loading completed');
      }
    };
    
    loadFilterOptions();
  }, []);

  function updateParam(key, value) {
    console.log(`🔍 FilterBar: Updating ${key} to:`, value);
    if (!value) params.delete(key);
    else params.set(key, value);

    console.log(`🔍 FilterBar: New URL params:`, params.toString());
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
        <div style={container}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <MenuControl
              label="TYPE"
              currentValue={params.get('type') || ''}
              options={[
                { label: 'ALL', value: '' },
                ...filterOptions.types.map(t => ({ 
                  label: t.toUpperCase(), 
                  value: t // Keep original backend value (movie, book, etc.)
                })),
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
                  label: y.toUpperCase(), 
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
                  value: g // Keep original backend value
                })),
              ]}
              onSelect={v => updateParam('genre', v)}
              disabled={!optionsLoaded}
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
      </div>
    </div>
  );
}

function MenuControl({ label, options, onSelect, currentValue = '', disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  // Find the currently selected option to display its label
  const selectedOption = options.find(opt => opt.value === currentValue);
  // Show category name when no filter is selected (empty currentValue) or when "ALL" is selected
  const displayLabel = (selectedOption && currentValue !== '') ? selectedOption.label : label;
  const isSelected = currentValue && currentValue !== '';

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
      <div 
        style={{
          ...labelStyle,
          backgroundColor: open ? '#f5f5f5' : 'transparent',
        }}
        onClick={() => !disabled && setOpen(s => !s)}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.target.style.backgroundColor = '#f5f5f5';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !open) {
            e.target.style.backgroundColor = 'transparent';
          }
        }}
      >
        {disabled ? 'LOADING...' : displayLabel}
        {!disabled && <FiChevronDown style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />}
      </div>
      {open && !disabled && (
        <div style={menuStyle} role="menu">
          {options.map(opt => (
            <div
              key={opt.label + opt.value}
              style={optStyle}
              onClick={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
              role="menuitem"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
