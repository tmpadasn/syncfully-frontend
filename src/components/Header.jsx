import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiSettings, FiStar, FiFolder } from "react-icons/fi";
import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

export default function Header() {
  const auth = useAuth();
  const user = auth && auth.user ? auth.user : null;
  const userId = user ? user.userId : null;
  const profilePath = "/account";
  const location = useLocation();
  const navigate = useNavigate();

  // Search term state
  const [term, setTerm] = useState('');

  // Sync search term with URL when on search page
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
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 20px',background:'#9a4207c8',color:'#392c2cff'}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <Link
          to="/"
          title="Home"
          aria-label="Go to home"
          onClick={(e) => {
            if (location && location.pathname === '/') {
              e.preventDefault();
              window.location.reload();
            }
          }}
          style={{display:'flex',alignItems:'center',color:'#392c2cff',textDecoration:'none',fontWeight:600, marginLeft:10}}
        >
          <img src="/syncFully_logo.png" alt="SyncFully" style={{width:40,height:40}} />
          <span style={{marginLeft:10, fontSize: 28}}>
            <span style={{fontWeight:'bold'}}>Sync</span>
            <span style={{fontStyle:'italic'}}>Fully</span>
          </span>
        </Link>
      </div>

      {/* Search bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          padding: '6px 20px',
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
          onKeyDown={(e) => { if (e.key === 'Enter') doSearch(); }}
          placeholder="Search works or users"
          style={{
            border: 'none',
            outline: 'none',
            flex: 1,
            fontSize: 14
          }}
          aria-label="Search input"
        />
        <FiSearch
          size={22}
          color='#392c2cff'
          style={{cursor:'pointer'}}
          onClick={doSearch}
          aria-label="Execute search"
        />
      </div>

      {/* Right - Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <Link to={profilePath} title={user ? user.username : 'Profile'} style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none',color:'#392c2cff'}}>
            {user && user.profilePictureUrl ? (
              <img src={user.profilePictureUrl} alt={`${user.username || 'User'} avatar`} style={{width:36,height:36,borderRadius:18,objectFit:'cover'}} />
            ) : (
              <FiUser size={34} style={{ cursor: 'pointer' }} />
            )}
            {user && user.username && user.username.toLowerCase() !== 'guest' && (
              <span style={{fontSize:14,fontWeight:600,color:'#392c2cff'}}>{user.username}</span>
            )}
          </Link>
        </div>
        <FiFolder size={34} style={{ cursor: 'pointer' }} />
        <Link
          to="/recommendations"
          title="Recommendations"
          style={{ color: '#392c2cff', display: 'inline-flex' }}
          onClick={(e) => {
            if (location && location.pathname === '/recommendations') {
              e.preventDefault();
              window.location.reload();
            }
          }}
        >
          <FiStar size={34} style={{ cursor: 'pointer' }} />
        </Link>
        <FiSettings size={34} style={{ cursor: 'pointer', marginRight: 10 }} />
      </div>
    </header>
  );
}
