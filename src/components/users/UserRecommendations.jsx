import { Link } from "react-router-dom";
import ErrorBoundary from '../ErrorBoundary';

function UserRecommendationsInner({ items = [] }) {
  if (!items.length) return <p>No recommendations yet.</p>;

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:16 }}>
      {items.map(item => (
        <Link key={item.workId} to={`/works/${item.workId}`} style={{ textDecoration:"none", color:"inherit" }}>
          <div style={{
            borderRadius:8,
            overflow:"hidden",
            boxShadow:"0 2px 8px rgba(0,0,0,0.1)",
            height:280,
            cursor:"pointer"
          }}>
            <img
              src={item.coverUrl}
              alt={item.title}
              style={{ width:"100%", height:"100%", objectFit:"cover" }}
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
        <div style={{
          padding: '30px',
          textAlign: 'center',
          background: '#fff3cd',
          borderRadius: '8px',
          border: '1px solid #ffc107'
        }}>
          <p style={{ color: '#856404' }}>Unable to load recommendations</p>
        </div>
      }
    >
      <UserRecommendationsInner {...props} />
    </ErrorBoundary>
  );
}
