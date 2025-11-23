export default function UserRatings({ ratings = [], works = [] }) {
  if (!ratings.length) return <p>No ratings yet.</p>;

  return (
    <div style={{ display: "grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px,1fr))", gap:16 }}>
      {ratings.map((rating) => {
        const work = works.find(w => (w.id||w.workId) === Number(rating.workId));

        if (!work) return null;

        return (
          <div key={rating.workId} style={{ background:"#9a4207c8", padding:12, borderRadius:8 }}>
            <img src={work.coverUrl} style={{ width:"100%", borderRadius:6 }} alt={work.title} />
            <div style={{ marginTop:8, color:"#392c2c" }}>
              <strong>{work.title}</strong>
              <div>Score: {rating.score}★</div>
              <div style={{ fontSize:12 }}>{new Date(rating.ratedAt).toLocaleDateString()}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
