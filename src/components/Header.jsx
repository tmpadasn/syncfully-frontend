import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiUser, FiSettings, FiStar, FiFolder } from "react-icons/fi";
import useAuth from '../hooks/useAuth';

function SearchBar() {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();

  function doSearch() {
    const q = (term || '').trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        padding: '6px 20px',
        borderRadius: 15,
        gap: 8,
        width: 260
      }}
    >
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') doSearch(); }}
        placeholder="Search works or creators"
        style={{
          border: 'none',
          outline: 'none',
          flex: 1,
          fontSize: 14
        }}
      />

      <FiSearch size={18} color='#392c2cff' style={{cursor:'pointer'}} onClick={doSearch} />
    </div>
  );
}

export default function Header() {
  const auth = useAuth();
  const user = auth && auth.user ? auth.user : null;
  const userId = user ? user.userId : null;
  const profilePath = userId ? `/profile/${userId}` : '/profile';
  const location = useLocation();

  return (
    <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 20px',background:'#9a4207c8',color:'#392c2cff'}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <Link
          to="/"
          title="Home"
          aria-label="Go to home"
          onClick={(e) => {
            // If already on home, reload the page; otherwise let the Link navigate
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
      <SearchBar />

       {/* Right - Icons */}
         <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* User area: avatar + name + action button */}
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

            <FiFolder size={34} style={{ cursor: "pointer" }} />
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
            <FiSettings size={34} style={{ cursor: "pointer", marginRight: 10 }} />
          </div>

    </header>
  );
}
