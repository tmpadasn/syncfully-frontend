/**
 * WorksSection: Container for search results works/books
 * Displays section title and renders work cards using provided render function
 */
export function WorksSection({ works, styles, renderWorkCard }) {
  return (
    <div style={{ marginBottom: 40 }}>
      {/* Section title with work count */}
      <h2 style={styles.sectionTitle}>
        WORKS ({works.length})
      </h2>
      {/* Grid of work cards */}
      <div style={styles.itemsGrid}>
        {works.map((entity, idx) => renderWorkCard(entity, idx, works.length))}
      </div>
    </div>
  );
}

/**
 * UsersSection: Container for search results users
 * Displays section title and renders user cards using provided render function
 */
export function UsersSection({ users, styles, renderUserCard }) {
  return (
    <div>
      {/* Section title with user count */}
      <h2 style={styles.sectionTitle}>
        USERS ({users.length})
      </h2>
      {/* Grid of user cards */}
      <div style={styles.itemsGrid}>
        {users.map((entity, idx) => renderUserCard(entity, idx, users.length))}
      </div>
    </div>
  );
}
