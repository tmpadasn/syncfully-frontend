import { Link } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

function WorkCardInner({ work, flat = false, coverStyle, hideInfo = false }) {
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

export default function WorkCard(props) {
  return (
    <ErrorBoundary
      fallback={
        <div style={{
          padding: '20px',
          background: '#f8d7da',
          borderRadius: '8px',
          border: '1px solid #f5c6cb',
          textAlign: 'center',
          fontSize: '12px',
          color: '#721c24'
        }}>
          Card error
        </div>
      }
    >
      <WorkCardInner {...props} />
    </ErrorBoundary>
  );
}
