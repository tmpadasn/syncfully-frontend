import React from 'react';
import { Link } from 'react-router-dom';

// HeaderLogo: presentational logo/link. Styles are passed from parent
// to avoid coupling to a shared styles module and preserve visual
// parity with the original Header implementation.
export default function HeaderLogo({ styles }) {
  return (
    <Link to="/" style={styles.logo} aria-label="SyncFully home page">
      <img src="/syncFully_logo.png" alt="SyncFully" style={styles.logoImage} />
      <span style={styles.logoText}>
        <span style={{ fontWeight: 'bold' }}>Sync</span>
        <span style={{ fontStyle: 'italic' }}>Fully</span>
      </span>
    </Link>
  );
}
