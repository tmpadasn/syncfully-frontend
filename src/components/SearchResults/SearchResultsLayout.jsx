/**
 * SearchResultsLayout - Main page layout wrapper
 * Contains layout structure, messaging, and results sections components
 */

// Layout wrapper for consistent page structure
export function SearchResultsLayout({ children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1100px', padding: '0 20px', boxSizing: 'border-box' }}>
        <main style={{ flex: 1 }}>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, textAlign: 'center', padding: '40px 20px' }}>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>No results found for your search.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '8px 12px', backgroundColor: '#f8f5f0', borderLeft: '4px solid #d4b895', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontSize: '13px', fontWeight: 600, color: '#666', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>
        {title}
      </span>
    </div>
  );
}

// Results section - Generic container for search results (works or users)
export function ResultsSection({ title, items, renderItem }) {
  return (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#392c2cff', marginBottom: '12px', paddingBottom: '6px', borderBottom: '2px solid #bfaea0', letterSpacing: '0.5px' }}>
        {title} ({items.length})
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
