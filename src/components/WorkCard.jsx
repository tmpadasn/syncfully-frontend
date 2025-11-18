import React from 'react';
import { Link } from 'react-router-dom';

export default function WorkCard({ work, flat = false, coverStyle, hideInfo = false }) {
  if (!work) return null;
  const outerStyle = flat ? { background: 'transparent', boxShadow: 'none' } : undefined;
  return (
    <div className="work-card" style={outerStyle}>
      <img src={work.coverUrl || ''} alt={work.title} className="work-cover" style={coverStyle} />
      {!hideInfo && (
        <div className="work-info">
          <h3>{work.title}</h3>
          <p>{work.creator} • {work.year}</p>
          <p>Rating: {work.rating ?? '—'}</p>
          <Link to={`/works/${work.workId}`}>Details</Link>
        </div>
      )}
    </div>
  );
}
