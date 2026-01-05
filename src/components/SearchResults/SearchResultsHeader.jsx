/**
 * SearchResultsHeader: Page title header for search results
 * Displays the search page title (e.g., "Search Results for 'books'")
 */
export function SearchResultsHeader({ title, styles }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 0 }}>
      <div style={{ width: '100%', padding: '0 16px', boxSizing: 'border-box' }}>
        {/* Page title with styles from searchResultsStyles */}
        <div style={{
          marginTop: 16,
          marginBottom: 24,
          ...styles.titleBox
        }}>
          <span style={styles.titleText}>
            {title}
          </span>
        </div>
      </div>
    </div>
  );
}
