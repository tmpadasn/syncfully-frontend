import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiLogIn, FiZap, FiGrid, FiLogOut } from "react-icons/fi";
import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const defaultAvatar =
  "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";

export default function Header() {
  const { user, isGuest, logout } = useAuth();
  const profilePath = isGuest ? '/login' : '/account';

  const location = useLocation();
  const navigate = useNavigate();

  // Search term state
  const [term, setTerm] = useState('');

  useEffect(() => {
    if (location.pathname.startsWith('/search')) {
      const params = new URLSearchParams(location.search);
      const urlQuery = params.get('q') || '';
      setTerm(urlQuery);
    } else {
      setTerm('');
    }
  }, [location.pathname, location.search]);

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

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      background: '#9a4207c8',
      color: '#392c2cff'
    }}>

      {/* Left Logo */}
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          color: '#392c2cff',
          textDecoration: 'none',
          fontWeight: 600,
          marginLeft: 10
        }}
      >
        <img src="/syncFully_logo.png" alt="SyncFully" style={{ width: 40, height: 40 }} />
        <span style={{ marginLeft: 10, fontSize: 28 }}>
          <span style={{ fontWeight: 'bold' }}>Sync</span>
          <span style={{ fontStyle: 'italic' }}>Fully</span>
        </span>
      </Link>

      {/* Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          padding: '6px 16px',
          borderRadius: 15,
          gap: 8,
          width: 400,
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
        }}
      >
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && doSearch()}
          placeholder="Search works or users"
          style={{
            border: 'none',
            outline: 'none',
            flex: 1,
            fontSize: 14
          }}
        />
        <FiSearch size={22} color='#392c2cff' style={{ cursor: 'pointer' }} onClick={doSearch} />
      </div>

      {/* Right icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>

        <Link
          to={profilePath}
          style={{ 
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
          }}
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
        >
          {isGuest ? (
            <FiLogIn size={34}/>
          ) : (
            <>
              <img
                src={user?.profilePictureUrl || defaultAvatar}
                alt="avatar"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
              />
              <span style={{ 
                fontWeight: 600,
                fontSize: '15px',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
              }}>
                {user.username}
              </span>
            </>
          )}
        </Link>

        {!isGuest && (
          <Link 
            to="/shelves" 
            style={{ 
              color: '#392c2cff', 
              display: 'flex', 
              alignItems: 'center',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <FiGrid size={34} title="My Shelves" />
          </Link>
        )}

        <Link 
          to="/recommendations" 
          style={{ 
            color: '#392c2cff', 
            display: 'flex', 
            alignItems: 'center',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <FiZap size={34} title="Recommendations" />
        </Link>

        {!isGuest && (
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            style={{
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
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
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
          >
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        )}
      </div>
    </header>
  );
}
