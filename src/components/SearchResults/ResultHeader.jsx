/**
 * ResultHeader: Reusable header component for work and user items
 * Displays title (clickable), subtitle, and metadata
 * Used in WorkCard and UserCard components
 */
export function ResultHeader({ title, subtitle, meta, onClick }) {
  return (
    <>
      {/* Title - clickable with underline hover effect */}
      <h3
        onClick={onClick}
        style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'inline-block',
          width: 'fit-content'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
        onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
      >
        {title}
      </h3>
      <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
        <p style={{ margin: 0, color: '#666', fontSize: 14 }}>{subtitle}</p>
        <span style={{ margin: 0, color: '#888', fontSize: 12 }}>{meta}</span>
      </div>
    </>
  );
}
