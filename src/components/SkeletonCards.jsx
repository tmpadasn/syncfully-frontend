import { Skeleton } from './SkeletonBase';

/** Grid of work card placeholders - displays responsive grid of card skeletons
 * Default: 6 cards with 160px min-width, can customize count and column layout */
export function WorkGridSkeleton({
  count = 6,
  columns = 'repeat(auto-fit, minmax(160px, 1fr))'
}) {
  return (
    <div style={{ display: 'grid', gap: 20, gridTemplateColumns: columns }}>
      {/* Generate count placeholder cards */}
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Skeleton
            width="100%"
            height="280px"
            borderRadius={12}
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          />
        </div>
      ))}
    </div>
  );
}

/** Single friend/user card placeholder - shows cover image, avatar circle, name and bio skeleton */
export function FriendCardSkeleton() {
  return (
    <div
      style={{
        background: '#9a4207c8',
        borderRadius: '8px',
        overflow: 'hidden',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        opacity: 0.7
      }}
    >
      {/* Cover image placeholder */}
      <Skeleton width="100%" height="200px" borderRadius="0" />
      <div style={{ padding: '8px' }}>
        {/* Avatar + name row */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '6px',
            alignItems: 'center'
          }}
        >
          <Skeleton width="20px" height="20px" borderRadius="50%" />
          <Skeleton width="80px" height="13px" />
        </div>
        {/* Bio text line */}
        <Skeleton width="90%" height="12px" />
      </div>
    </div>
  );
}

/** Grid of friend card placeholders - displays 4 friend cards in responsive grid */
export function FriendGridSkeleton({ count = 4 }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '20px',
        marginTop: '4px'
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <FriendCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Vertical list of work item placeholders - matches ResultsSection flex column layout with title + text rows */
export function WorkListSkeleton({ count = 12 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Generate count list items with title and description lines */}
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ padding: '12px', backgroundColor: '#f8f5f0', borderRadius: '4px' }}>
          <Skeleton width="60%" height="18px" borderRadius="4px" style={{ marginBottom: '8px' }} />
          <Skeleton width="100%" height="14px" borderRadius="4px" style={{ marginBottom: '4px' }} />
          <Skeleton width="95%" height="14px" borderRadius="4px" />
        </div>
      ))}
    </div>
  );
}

export default { WorkGridSkeleton, FriendCardSkeleton, FriendGridSkeleton, WorkListSkeleton };
