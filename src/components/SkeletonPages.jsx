import { Skeleton } from './SkeletonBase';
import { ProfileHeaderSkeleton, RatingStatsSkeleton, GenreStatsSkeleton, RatingHistorySkeleton, RatingDistributionSkeleton } from './SkeletonSections';

/** Work details page skeleton - 3-column layout with cover/sidebar, main content, and ratings */
export function WorkDetailsSkeleton() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 12px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 260px', gap: '24px', alignItems: 'start' }}>
        {/* Left sidebar - cover image and action button */}
        <aside>
          <Skeleton width="180px" height="260px" borderRadius={8} style={{ marginBottom: 12 }} />
          <Skeleton width="180px" height="48px" borderRadius={12} />
        </aside>
        {/* Main content - title, metadata, description, and related works carousel */}
        <main>
          <Skeleton width="60%" height="32px" style={{ marginBottom: 12 }} />
          <Skeleton width="40%" height="16px" style={{ marginBottom: 20 }} />
          <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
            <Skeleton width="80px" height="24px" borderRadius={12} />
            <Skeleton width="100px" height="24px" borderRadius={12} />
          </div>
          <Skeleton width="30%" height="24px" style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height="64px" borderRadius={4} style={{ marginBottom: 4 }} />
          <Skeleton width="120px" height="32px" borderRadius={4} style={{ marginLeft: 'auto', display: 'block', marginBottom: 24 }} />
          <Skeleton width="40%" height="24px" style={{ marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} width="140px" height="200px" borderRadius={12} />)}
          </div>
        </main>
        {/* Right sidebar - rating distribution chart and stats */}
        <aside style={{ borderLeft: '1px solid #eee', paddingLeft: '12px' }}>
          <RatingDistributionSkeleton />
        </aside>
      </div>
    </div>
  );
}

/** User profile page skeleton - header with avatar/name/buttons, rating stats, genre stats, and rating history */
export function ProfileSkeleton() {
  return (
    <div className="page-container">
      <div className="page-inner">
        <main className="page-main">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Profile header with avatar, name, bio, and follow button */}
            <ProfileHeaderSkeleton />
            {/* Rating and genre statistics sections */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '24px',
                marginTop: '48px',
                paddingTop: '32px',
                borderTop: '1px solid #efe5db'
              }}
            >
              <RatingStatsSkeleton />
              <GenreStatsSkeleton />
            </div>
            {/* User's rating history timeline */}
            <RatingHistorySkeleton />
          </div>
        </main>
      </div>
    </div>
  );
}

export default { WorkDetailsSkeleton, ProfileSkeleton };
