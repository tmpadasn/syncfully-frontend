import React from 'react';

/* BreakdownList: aggregates rating frequencies by a specified key (compact summary). */
export default function BreakdownList({ ratings = {}, works = [], keyName = 'type', emptyMessage = 'No ratings yet', cardStyle = {}, valueStyle = {}, labelStyle = {} }) {
  // Build a frequency map of the selected key across rated works.
  const stats = {};
  Object.keys(ratings).forEach(workId => {
    const work = works.find(w => (w.id || w.workId) === Number(workId));
    if (work && work[keyName]) {
      stats[work[keyName]] = (stats[work[keyName]] || 0) + 1;
    }
  });

  // Sort descending by count to show the most common items first.
  const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    return <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.6, fontSize: 13 }}>{emptyMessage}</div>;
  }

  return (
    <>
      {sorted.map(([label, count]) => (
        <div
          key={label}
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(154, 66, 7, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={valueStyle}>{count}</div>
          <div style={labelStyle}>
            {label}
            {count !== 1 ? 's' : ''}
          </div>
        </div>
      ))}
    </>
  );
}
