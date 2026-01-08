import { Skeleton } from './SkeletonBase';

/**
 * Skeleton loading components for different profile and rating sections.
 * Each skeleton provides a visual placeholder matching the final UI layout.
 * Used to improve perceived performance during data loading.
 */

/**
 * Profile header skeleton - user avatar circle + name + email + works count + action buttons
 * Matches ProfileHeader component layout with circular avatar, text fields, and button placeholders.
 * Prevents layout shift during user data loading.
 */
export function ProfileHeaderSkeleton() {
  return (
    <div style={{ marginBottom: '48px' }}>
      {/* Avatar and text info row */}
      <div
        style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
          marginBottom: '32px'
        }}
      >
        {/* Circular avatar placeholder */}
        <div style={{ flexShrink: 0 }}>
          <Skeleton
            width="140px"
            height="140px"
            borderRadius="50%"
            style={{ flexShrink: 0 }}
          />
        </div>
        {/* Username, email, and buttons column */}
        <div style={{ flex: 1 }}>
          {/* Username skeleton */}
          <Skeleton
            width="200px"
            height="32px"
            style={{ marginBottom: 12 }}
          />
          {/* Email skeleton */}
          <Skeleton
            width="300px"
            height="16px"
            style={{ marginBottom: 20 }}
          />
          {/* Action buttons row */}
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

/**
 * Rating stats skeleton - works rated count + 4-item breakdown grid by type
 * Shows placeholder for rating statistics section with grid of type breakdowns.
 */
export function RatingStatsSkeleton() {
  return (
    <div>
      {/* Works rated number and label */}
      <Skeleton width="100px" height="28px" style={{ marginBottom: 4 }} />
      <Skeleton width="150px" height="16px" style={{ marginBottom: 16 }} />
      {/* 4-column grid of rating breakdown items (e.g., Book, Manga, Light Novel, Anime) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} width="100%" height="80px" borderRadius={12} />
        ))}
      </div>
    </div>
  );
}

/**
 * Genre stats skeleton - section header + 5 genre rows with icon and name
 * Placeholder for top genres list showing most commonly rated genres.
 */
export function GenreStatsSkeleton() {
  return (
    <div>
      {/* Section header "Top Genres" */}
      <Skeleton width="150px" height="16px" style={{ marginBottom: 16 }} />
      {/* 5 genre rows, each with icon and name */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          {/* Genre icon placeholder */}
          <Skeleton width="30px" height="28px" borderRadius={4} />
          {/* Genre name placeholder */}
          <Skeleton width="100%" height="28px" borderRadius={4} />
        </div>
      ))}
    </div>
  );
}

/**
 * Rating history skeleton - section title + 3 rating item placeholders
 * Shows loading state for user's past ratings with content boxes.
 */
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
