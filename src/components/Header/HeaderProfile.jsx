import React from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn, FiGrid, FiZap, FiLogOut } from 'react-icons/fi';
import { DEFAULT_AVATAR_URL } from '../../config/constants';

// HeaderProfile: renders profile/login affordance and action icons.
// Receives callbacks and user state from parent to avoid duplicating
// authentication logic and to preserve existing navigation flows.
export default function HeaderProfile({ user, isGuest, logout, navigate, styles }) {
  const profilePath = isGuest ? '/login' : '/account';

  return (
    <nav style={styles.nav} aria-label="Main navigation">
      {/* Profile affordance: conditionally renders a login entrypoint for
          unauthenticated users and an avatar+username for authenticated
          users; uses `aria-label` and subtle hover transforms to improve
          discoverability without altering navigation semantics. */}
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
            <img src={user?.profilePictureUrl || DEFAULT_AVATAR_URL} alt={`${user.username} profile picture`} style={styles.profileImage} />
            <span style={styles.profileText}>{user.username}</span>
          </>
        )}
      </Link>

      {!isGuest && (
        <Link to="/shelves" style={styles.navIcon} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} aria-label="View my shelves">
          <FiGrid size={34} aria-hidden="true" />
        </Link>
      )}

      <Link to="/recommendations" style={styles.navIcon} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} aria-label="View recommendations">
        <FiZap size={34} aria-hidden="true" />
      </Link>

      {!isGuest && (
        <>
          {/* Logout: clear client authentication and redirect home to
              preserve UI-route consistency and avoid presenting stale
              session state to the user. */}
          <button
            onClick={() => { logout(); navigate('/'); }}
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
        </>
      )}
    </nav>
  );
}
