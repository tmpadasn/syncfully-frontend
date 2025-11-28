import { Link } from "react-router-dom";
import ErrorBoundary from '../ErrorBoundary';

/* ===================== UI STYLES ===================== */
const styles = {
  /* ===================== RECOMMENDATIONS GRID ===================== */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
    gap: 16,
  },

  /* ===================== RECOMMENDATION LINK ===================== */
  link: {
    textDecoration: "none",
    color: "inherit",
  },

  /* ===================== RECOMMENDATION CARD ===================== */
  card: {
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    height: 280,
    cursor: "pointer",
  },

  /* ===================== COVER IMAGE ===================== */
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  /* ===================== ERROR FALLBACK ===================== */
  errorFallback: {
    padding: '30px',
    textAlign: 'center',
    background: '#fff3cd',
    borderRadius: '8px',
    border: '1px solid #ffc107',
  },

  /* ===================== ERROR MESSAGE ===================== */
  errorMessage: {
    color: '#856404',
  },
};

function UserRecommendationsInner({ items = [] }) {
  if (!items.length) return <p>No recommendations yet.</p>;

  return (
    <div style={styles.grid}>
      {items.map(item => (
        <Link key={item.workId} to={`/works/${item.workId}`} style={styles.link}>
          <div style={styles.card}>
            <img
              src={item.coverUrl}
              alt={item.title}
              style={styles.image}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function UserRecommendations(props) {
  return (
    <ErrorBoundary
      fallback={
        <div style={styles.errorFallback}>
          <p style={styles.errorMessage}>Unable to load recommendations</p>
        </div>
      }
    >
      <UserRecommendationsInner {...props} />
    </ErrorBoundary>
  );
}
