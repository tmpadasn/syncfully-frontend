import { Link } from "react-router-dom";

export default function UserRecommendations({ items = [] }) {
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
