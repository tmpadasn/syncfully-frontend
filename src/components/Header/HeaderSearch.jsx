import React from 'react';
import { FiSearch } from 'react-icons/fi';

// HeaderSearch: controlled search input. All state and navigation
// semantics remain in the parent; this component only renders the
// input and triggers callbacks to avoid changing behavior.
export default function HeaderSearch({ term, handleSearchInput, doSearch, styles, debounceTimerRef }) {
  return (
    <div style={styles.searchContainer} role="search">
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
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
            doSearch();
          }
        }}
        placeholder="Search works or users"
        style={styles.searchInput}
        aria-label="Search works or users"
      />
      <button onClick={doSearch} style={styles.searchButton} aria-label="Submit search">
        <FiSearch size={22} color='#392c2cff' aria-hidden="true" />
      </button>
    </div>
  );
}
