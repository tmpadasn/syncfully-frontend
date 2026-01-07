import { Link } from '../../imports/workDetailsImports';
import { WorkCard } from '../../imports/workDetailsImports';

/**
 * Main content component for work details page
 * Displays:
 * - Work title, creator, and publication year
 * - Type and genre tags
 * - Work description with styled background
 * - Recommended similar works carousel
 *
 * Props:
 *   work: Work object with title, creator, year, type, genres, description
 *   recommended: Array of recommended similar works
 */
export default function WorkDetailsMainContent({ work, recommended }) {
  return (
    <main>
      {/* Work title */}
      <h1 style={{ marginTop: 0 }}>{work.title}</h1>

      {/* Creator and publication year metadata */}
      <p style={{ color: '#666' }}>
        {work.creator} • {work.year}
      </p>

      {/* Type and genre tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16, marginBottom: 24 }}>
        {/* Work type tag (e.g., Book, Manga, Light Novel) */}
        {work.type && (
          <span
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: 13,
              color: '#fff',
              fontWeight: 700,
              background: '#9a4207',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            {String(work.type)}
          </span>
        )}
        {/* Render individual genre tags */}
        {work.genres?.map((g, i) => (
          <span
            key={i}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: 13,
              color: '#fff',
              fontWeight: 600,
              background: '#b95716',
              letterSpacing: '0.3px',
            }}
          >
            {g}
          </span>
        ))}
      </div>

      {/* Work description section with gradient background */}
      <section
        style={{
          marginTop: 28,
          background: 'linear-gradient(to bottom, rgba(154, 66, 7, 0.03), rgba(154, 66, 7, 0.01))',
          borderLeft: '4px solid #9a4207',
          borderRadius: 8,
          padding: '20px 36px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Description section title */}
        <h3
          style={{
            marginTop: 0,
            marginBottom: 16,
            color: '#9a4207',
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          Description
        </h3>
        {/* Description text or fallback message if not available */}
        {work.description ? (
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: '#333',
              margin: 0,
              whiteSpace: 'pre-wrap',
              textAlign: 'justify',
            }}
          >
            {work.description}
          </p>
        ) : (
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: '#666',
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            No description available for this work yet.
          </p>
        )}
      </section>

      {/* Recommended similar works carousel section */}
      <section style={{ marginTop: 24 }}>
        <div style={{ display: 'inline-block', width: '100%' }}>
          <h3 className="section-title">YOU MAY ALSO LIKE</h3>
        </div>
        {/* Recommended works carousel or fallback message */}
        {recommended.length > 0 ? (
          // Horizontal scrollable list of recommended works
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, marginTop: 12 }}>
            {recommended.map((rw) => (
              <div key={rw.workId} style={{ minWidth: 140 }}>
                {/* Link to recommended work's detail page */}
                <Link to={`/works/${rw.workId}`} style={{ textDecoration: 'none' }}>
                  <WorkCard
                    work={rw}
                    flat
                    hideInfo
                    coverStyle={{ width: 140, height: 200 }}
                  />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          // Fallback message when no recommendations available
          <div
            style={{
              marginTop: 12,
              padding: 16,
              background: '#f5f5f5',
              borderRadius: 8,
            }}
          >
            <p>No similar works found for this item.</p>
          </div>
        )}
      </section>
    </main>
  );
}
