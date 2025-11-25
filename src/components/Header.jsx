import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiSettings, FiStar, FiFolder } from "react-icons/fi";
import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const defaultAvatar =
  "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";

export default function Header() {
  const { user, isGuest, logout } = useAuth();
  const profilePath = isGuest ? '/login' : '/account';

  const location = useLocation();
  const navigate = useNavigate();
  const [term, setTerm] = useState('');

  useEffect(() => {
    if (location.pathname.startsWith('/search')) {
      const params = new URLSearchParams(location.search);
      setTerm(params.get('q') || '');
    } else {
      setTerm('');
    }
  }, [location.pathname, location.search]);

  const doSearch = () => {
    const q = term.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
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
          padding: '6px 20px',
          borderRadius: 15,
          gap: 8,
          width: 400,
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

        <Link
          to={profilePath}
          style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#392c2cff' }}
        >
          {isGuest ? (
            <FiUser size={34}/>
          ) : (
            <>
              <img
                src={user?.profilePictureUrl || defaultAvatar}
                alt="avatar"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <span style={{ fontWeight: 600 }}>{user.username}</span>
            </>
          )}
        </Link>

        <FiFolder size={34} />
        <Link to="/recommendations" style={{ color: '#392c2cff' }}>
          <FiStar size={34} />
        </Link>
        <FiSettings size={34} />

        {!isGuest && (
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#392c2cff',
              fontSize: 12,
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
