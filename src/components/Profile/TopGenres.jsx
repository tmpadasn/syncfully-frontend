import HoverBar from "../HoverBar";

const GENRE_COLORS = ["#9a4207", "#b95716", "#c86f38", "#d4885c", "#d9956f"];

/** Most rated genres section with top 5 genre statistics */
export default function TopGenres({ ratings, works }) {
  // Compute top genres by counting genres in the user's rated works
  const genreStats = {};
  Object.keys(ratings).forEach(workId => {
    const work = works.find(w => (w.id || w.workId) === Number(workId));
    if (work && work.genres && Array.isArray(work.genres)) {
      work.genres.forEach(genre => {
        if (!genreStats[genre]) genreStats[genre] = 0;
        genreStats[genre]++;
      });
    }
  });

  const sorted = Object.entries(genreStats).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    // Most Rated Genres
    <div>
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
        🎭 Most Rated Genres
      </div>
      {/* Genre Bars */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {sorted.length === 0 ? (
          <div style={{ textAlign: "center", opacity: 0.6, fontSize: 13 }}>No genre data available</div>
        ) : (
          sorted.map(([genre, count], idx) => (
            <div key={genre} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 30, textAlign: "right", fontSize: 13, fontWeight: 700, color: "#3b2e2e" }}>
                {count}
              </div>
              <div style={{ flex: 1 }}>
                {/* Colored genre bar with hover effect */}
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
