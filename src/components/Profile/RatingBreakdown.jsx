/**
 * Rating breakdown by type section
 * Displays counts of rated works grouped by their type (e.g., book, movie, game)
 */
export default function RatingBreakdown({ ratings, works }) {
  // Build a frequency map of work types across rated works
  const stats = {};
  Object.keys(ratings).forEach(workId => {
    const work = works.find(w => (w.id || w.workId) === Number(workId));
    if (work && work.type) {
      stats[work.type] = (stats[work.type] || 0) + 1;
    }
  });

  // Sort descending by count to show the most common items first
  const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      {/* Section Title */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          textTransform: "uppercase",
          color: "#8a6f5f",
          marginBottom: 14,
          opacity: 0.75,
          letterSpacing: 0.8,
        }}
      >
        📊 Rating Breakdown by Type
      </div>
      {/* Type Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
        }}
      >
        {sorted.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.6, fontSize: 13 }}>
            No ratings yet
          </div>
        ) : (
          sorted.map(([label, count]) => (
            // Type Count Card with hover effect
            <div
              key={label}
              style={{
                background: "linear-gradient(135deg, #fff9f5 0%, #fef5f0 100%)",
                padding: "16px",
                borderRadius: 10,
                border: "1.5px solid #f0e0d8",
                textAlign: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(154, 66, 7, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Count Number */}
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#9a4207",
                }}
              >
                {count}
              </div>
              {/* Type Label */}
              <div
                style={{
                  fontSize: 12,
                  marginTop: 6,
                  fontWeight: 600,
                  color: "#5d4c4c",
                  textTransform: "capitalize",
                }}
              >
                {label}
                {count !== 1 ? 's' : ''}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
