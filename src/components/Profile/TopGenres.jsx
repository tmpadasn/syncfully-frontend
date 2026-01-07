import HoverBar from "../HoverBar";

/**
 * Color palette for genre bars - cycled through for visual variety
 * Uses warm/brown tones consistent with design theme
 */
const GENRE_COLORS = ["#9a4207", "#b95716", "#c86f38", "#d4885c", "#d9956f"];

/**
 * Top genres section - displays user's top 5 most rated genres with frequency bars
 * Aggregates genres from all rated works and sorts by frequency (descending)
 *
 * Props:
 *   ratings: Object map of work ratings { workId: { score, ratedAt } }
 *   works: Array of work objects with genre information
 */
export default function TopGenres({ ratings, works }) {
  // Compute genre frequencies from user's rated works
  // Iterates through each rated work and aggregates all genres
  const genreStats = {};
  Object.keys(ratings).forEach(workId => {
    const work = works.find(w => (w.id || w.workId) === Number(workId));
    // Count each genre in the work
    if (work && work.genres && Array.isArray(work.genres)) {
      work.genres.forEach(genre => {
        if (!genreStats[genre]) genreStats[genre] = 0;
        genreStats[genre]++;
      });
    }
  });

  // Sort by frequency descending and take top 5 genres
  const sorted = Object.entries(genreStats).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div>
      {/* Section header "Most Rated Genres" */}
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
        \ud83c\udf2d Most Rated Genres
      </div>

      {/* Genre frequency bars list */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* Empty state when no genres available */}
        {sorted.length === 0 ? (
          <div style={{ textAlign: "center", opacity: 0.6, fontSize: 13 }}>No genre data available</div>
        ) : (
          // Render top 5 genres with count and colored bar
          sorted.map(([genre, count], idx) => (
            <div key={genre} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Genre count display */}
              <div style={{ width: 30, textAlign: "right", fontSize: 13, fontWeight: 700, color: "#3b2e2e" }}>
                {count}
              </div>
              {/* Genre name and bar */}
              <div style={{ flex: 1 }}>
                {/* Colored bar with hover effect, cycles through color palette */}
                <HoverBar
                  style={{
                    height: 28,
                    background: GENRE_COLORS[idx % 5],
                    backgroundImage: `linear-gradient(90deg, ${GENRE_COLORS[idx % 5]}, ${GENRE_COLORS[idx % 5]}dd)`,
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 12,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "capitalize",
                    boxShadow: "0 4px 12px rgba(154, 66, 7, 0.15)",
                    transition: "all 0.2s ease",
                    flex: 1,
                  }}
                >
                  {genre}
                </HoverBar>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
