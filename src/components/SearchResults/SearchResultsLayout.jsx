/**
 * SearchResultsLayout - Main page layout wrapper
 * Contains layout structure, messaging, and results sections components
 */

// Layout wrapper for consistent page structure
export function SearchResultsLayout({ children }) {
  return (
    <div className="search-results-container">
      <div className="search-results-wrapper">
        <main className="search-results-main">
          {children}
        </main>
      </div>
    </div>
  );
}

// Message component - displays header or empty state
export function SearchResultsMessage({ title, isEmpty = false }) {
  if (isEmpty) {
    return (
      <div className="search-results-no-results">
        <p>No results found for your search.</p>
      </div>
    );
  }

  return (
    <div className="search-results-title-box">
      <span className="search-results-title-text">
        {title}
      </span>
    </div>
  );
}

// Results section - Generic container for search results (works or users)
export function ResultsSection({ title, items, renderItem }) {
  return (
    <div className="search-results-section">
      <h2 className="search-results-section-title">
        {title} ({items.length})
      </h2>
      <div className="search-results-items-grid">
        {items.map((entity, idx) => renderItem(entity, idx, items.length))}
      </div>
    </div>
  );
}

// Backward compatibility exports
export function SearchResultsHeader({ title }) {
  return <SearchResultsMessage title={title} isEmpty={false} />;
}
// Empty state message
export function NoResultsMessage() {
  return <SearchResultsMessage isEmpty={true} />;
}
// Backward compatibility exports
export function WorksSection({ works, renderWorkCard }) {
  return <ResultsSection title="WORKS" items={works} renderItem={renderWorkCard} />;
}
// Backward compatibility exports
export function UsersSection({ users, renderUserCard }) {
  return <ResultsSection title="USERS" items={users} renderItem={renderUserCard} />;
}
