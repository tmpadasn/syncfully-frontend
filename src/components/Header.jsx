/* Header: primary navigation bar with search and profile affordances. */
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiLogIn, FiZap, FiGrid, FiLogOut } from "react-icons/fi";
import { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import { DEFAULT_AVATAR_URL } from '../config/constants';

/* ===================== UI STYLES ===================== */
const styles = {
  /* ===================== HEADER CONTAINER ===================== */
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    background: '#9a4207c8',
    color: '#392c2cff',
  },

  /* ===================== LOGO SECTION ===================== */
  logo: {
    display: 'flex',
    alignItems: 'center',
    color: '#392c2cff',
    textDecoration: 'none',
    fontWeight: 600,
    marginLeft: 10,
    cursor: 'pointer',
    zIndex: 10,
    position: 'relative',
  },
  logoImage: {
    width: 48,
    height: 48,
  },
  logoText: {
    marginLeft: 10,
    fontSize: 28,
  },

  /* ===================== SEARCH BAR ===================== */
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    background: '#fff',
    padding: '6px 16px',
    borderRadius: 15,
    gap: 8,
    width: 400,
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    flex: 1,
    fontSize: 14,
  },
  searchButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  },

  /* ===================== NAVIGATION ===================== */
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  profileLink: (isGuest) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: '#392c2cff',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    background: isGuest ? 'transparent' : 'rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    border: isGuest ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
  }),
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
  profileText: {
    fontWeight: 600,
    fontSize: '15px',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  },
  navIcon: {
    color: '#392c2cff',
    display: 'flex',
    alignItems: 'center',
    transition: 'transform 0.2s ease',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: 'rgba(57, 44, 44, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
};

export default function Header() {
  const { user, isGuest, logout } = useAuth();
  const profilePath = isGuest ? '/login' : '/account';

  const location = useLocation();
  const navigate = useNavigate();

  // Search term state
  const [term, setTerm] = useState('');
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (location.pathname.startsWith('/search')) {
      const params = new URLSearchParams(location.search);
      const urlQuery = params.get('q') || '';
      setTerm(urlQuery);
    } else {
      setTerm('');
    }
  }, [location.pathname, location.search]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const doSearch = () => {
    const q = (term || '').trim();
    
    // Preserve existing URL parameters (like addToShelf and shelfName)
    const currentParams = new URLSearchParams(location.search);
    
    // Update or remove the search query
    if (q) {
      currentParams.set('q', q);
    } else {
      currentParams.delete('q');
    }
    
    navigate(`/search?${currentParams.toString()}`);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setTerm(value);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounced search (300ms)
    debounceTimerRef.current = setTimeout(() => {
      const q = (value || '').trim();
      const currentParams = new URLSearchParams(location.search);
      
      if (q) {
        currentParams.set('q', q);
      } else {
        currentParams.delete('q');
      }
      
      navigate(`/search?${currentParams.toString()}`);
    }, 300);
  };

  return (
    <header 
      style={styles.header}
      role="banner"
    >

      {/* Left Logo */}
      <Link
        to="/"
        style={styles.logo}
        aria-label="SyncFully home page"
      >
        <img src="/syncFully_logo.png" alt="SyncFully" style={styles.logoImage} />
        <span style={styles.logoText}>
          <span style={{ fontWeight: 'bold' }}>Sync</span>
          <span style={{ fontStyle: 'italic' }}>Fully</span>
        </span>
      </Link>

      {/* Search Bar */}
      <div
        style={styles.searchContainer}
        role="search"
      >
        <label htmlFor="search-input" style={{ position: 'absolute', left: '-10000px' }}>
          Search works or users
        </label>
        <input
          id="search-input"
          type="search"
          value={term}
          onChange={handleSearchInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
              }
              doSearch();
            }
          }}
          placeholder="Search works or users"
          style={styles.searchInput}
          aria-label="Search works or users"
        />
        <button
          onClick={doSearch}
          style={styles.searchButton}
          aria-label="Submit search"
        >
          <FiSearch size={22} color='#392c2cff' aria-hidden="true" />
        </button>
      </div>

      {/* Right icons */}
      <nav 
        style={styles.nav}
        aria-label="Main navigation"
      >

        <Link
          to={profilePath}
          style={styles.profileLink(isGuest)}
          onMouseEnter={(e) => {
            if (!isGuest) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            } else {
              e.currentTarget.style.transform = 'scale(1.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isGuest) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            } else {
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
          aria-label={isGuest ? 'Login to your account' : `View profile for ${user.username}`}
        >
          {isGuest ? (
            <FiLogIn size={34} aria-hidden="true" />
          ) : (
            <>
              <img
                src={user?.profilePictureUrl || DEFAULT_AVATAR_URL}
                alt={`${user.username} profile picture`}
                style={styles.profileImage}
              />
              <span style={styles.profileText}>
                {user.username}
              </span>
            </>
          )}
        </Link>

        {!isGuest && (
          <Link 
            to="/shelves" 
            style={styles.navIcon}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            aria-label="View my shelves"
          >
            <FiGrid size={34} aria-hidden="true" />
          </Link>
        )}

        <Link 
          to="/recommendations" 
          style={styles.navIcon}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          aria-label="View recommendations"
        >
          <FiZap size={34} aria-hidden="true" />
        </Link>

        {!isGuest && (
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            style={styles.logoutButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(57, 44, 44, 1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(57, 44, 44, 0.8)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
            }}
            aria-label="Logout"
          >
            <FiLogOut size={18} aria-hidden="true" />
            <span>Logout</span>
          </button>
        )}
      </nav>
    </header>
  );
}
