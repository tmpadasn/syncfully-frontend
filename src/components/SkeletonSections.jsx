import { Skeleton } from './SkeletonBase';

/** Profile header skeleton - user avatar circle + name + bio + action buttons */
export function ProfileHeaderSkeleton() {
  return (
    <div style={{ marginBottom: '48px' }}>
      <div
        style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
          marginBottom: '32px'
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <Skeleton
            width="140px"
            height="140px"
            borderRadius="50%"
            style={{ flexShrink: 0 }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <Skeleton
            width="200px"
            height="32px"
            style={{ marginBottom: 12 }}
          />
          <Skeleton
            width="300px"
            height="16px"
            style={{ marginBottom: 20 }}
          />
          <div style={{ display: 'flex', gap: '12px' }}>
            <Skeleton
              width="120px"
              height="40px"
              borderRadius={8}
            />
            <Skeleton
              width="120px"
              height="40px"
              borderRadius={8}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Rating stats skeleton - aggregate rating number + 4-item breakdown grid */
export function RatingStatsSkeleton() {
  return (
    <div>
      {/* Rating number and label */}
      <Skeleton width="100px" height="28px" style={{ marginBottom: 4 }} />
      <Skeleton width="150px" height="16px" style={{ marginBottom: 16 }} />
      {/* 4-column grid of rating breakdown items */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} width="100%" height="80px" borderRadius={12} />
        ))}
      </div>
    </div>
  );
}

/** Genre stats skeleton - list of 5 genres with count values */
export function GenreStatsSkeleton() {
  return (
    <div>
      {/* Section header */}
      <Skeleton width="150px" height="16px" style={{ marginBottom: 16 }} />
      {/* 5 genre rows with icon and name */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <Skeleton width="30px" height="28px" borderRadius={4} />
          <Skeleton width="100%" height="28px" borderRadius={4} />
        </div>
      ))}
    </div>
  );
}

/** Rating history skeleton - section title + 3 rating item rows with grey content boxes */
export function RatingHistorySkeleton() {
  return (
    <section style={{ marginTop: '48px' }}>
      <Skeleton width="200px" height="28px" style={{ marginBottom: 24 }} />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} style={{ marginBottom: '16px', padding: '16px', background: '#f9f9f9', borderRadius: '8px' }}>
          <Skeleton width="100%" height="60px" borderRadius={8} />
        </div>
      ))}
    </section>
  );
}

/** Rating distribution skeleton - 5 star circles + 5 distribution rows with bars and percentages */
export function RatingDistributionSkeleton() {
  return (
    <>
      <Skeleton width="100%" height="40px" borderRadius={8} style={{ marginBottom: 24 }} />
      <Skeleton width="60%" height="20px" style={{ marginBottom: 16 }} />
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} width="24px" height="24px" />
        ))}
      </div>
      <Skeleton width="70%" height="16px" style={{ marginBottom: 12 }} />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: '4px', marginBottom: '6px', alignItems: 'center' }}>
          <Skeleton width="28px" height="20px" />
          <Skeleton width="100%" height="20px" borderRadius={4} />
          <Skeleton width="32px" height="20px" />
        </div>
      ))}
    </>
  );
}

export default { ProfileHeaderSkeleton, RatingStatsSkeleton, GenreStatsSkeleton, RatingHistorySkeleton, RatingDistributionSkeleton };
