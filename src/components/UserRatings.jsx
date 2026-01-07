import Shelf from './Shelves/Shelf';
import ErrorBoundary from './ErrorBoundary';

// UserRatings: renders a user's rating history as a carousel of work cards.
// Maps rating objects to Shelf card models and sorts by date.
/* ===================== UI STYLES ===================== */
const styles = {
  /* ===================== ERROR FALLBACK ===================== */
  errorFallback: {
    padding: '30px',
    textAlign: 'center',
    background: '#fff3cd',
    borderRadius: '8px',
    border: '1px solid #ffc107',
  },

  /* ===================== ERROR TEXT ===================== */
  errorText: {
    color: '#856404',
  },
};

function UserRatingsInner({ ratings = {}, works = [] }) {
  const entries = Object.entries(ratings);

  // Sort by ratedAt descending (most recent first)
  const sortedEntries = entries.sort((a, b) => {
    const dateA = new Date(a[1].ratedAt);
    const dateB = new Date(b[1].ratedAt);
    return dateB - dateA;
  });

  const cards = sortedEntries.map(([workId, rating]) => {
    const work = works.find(w => (w.id || w.workId) === Number(workId));
    if (!work) return null;

    return {
      id: workId,
      title: work.title,
      coverUrl: work.coverUrl,
      averageRating: work.averageRating || work.rating || 0,
      userRating: rating?.score || null,
      ratedAt: rating?.ratedAt || null,
      metaPrimary: work.creator || work.author || work.artist || 'Unknown Creator',
      metaSecondary: work.year ? `${work.type || 'Work'} • ${work.year}` : (work.type || undefined),
      link: `/works/${work.id || work.workId}`
    };
  }).filter(Boolean);

  return (
    <Shelf
      cards={cards}
      emptyMessage="No ratings yet. Start rating some works!"
    />
  );
}

export default function UserRatings(props) {
  return (
    <ErrorBoundary
      fallback={
        <div style={styles.errorFallback}>
          <p style={styles.errorText}>Unable to load user ratings</p>
        </div>
      }
    >
      <UserRatingsInner {...props} />
    </ErrorBoundary>
  );
}
