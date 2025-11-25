import { Link } from 'react-router-dom';

export default function UserRatings({ ratings = {}, works = [] }) {
  const entries = Object.entries(ratings);

  if (entries.length === 0) return <p>No ratings yet.</p>;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns:"repeat(auto-fill, minmax(180px,1fr))",
      gap:16
    }}>
      {entries.map(([workId, rating]) => {
        const work = works.find(w => (w.id||w.workId) === Number(workId));
        if (!work) return null;

        return (
          <Link 
            key={workId} 
            to={`/works/${work.id || work.workId}`}
            style={{ textDecoration: 'none' }}
          >
            <div 
              style={{ 
                background:"#9a4207c8", 
                padding:12, 
                borderRadius:8,
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                height: '320px',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <img 
                src={work.coverUrl} 
                alt={work.title}
                style={{ 
                  width:"100%", 
                  height: "220px",
                  objectFit: "cover",
                  borderRadius:6
                }} 
              />
              <div style={{ marginTop:8, color:"#392c2c", flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <strong style={{ 
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: 4
                }}>{work.title}</strong>
                <div>Score: {rating.score}★</div>
                <div style={{ fontSize:12 }}>
                  {new Date(rating.ratedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
