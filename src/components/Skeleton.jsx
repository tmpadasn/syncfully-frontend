/**
 * Skeleton Loading Components - Loading placeholders with shimmer animation
 * Supports: work cards, friend cards, work details, profiles, search results
 */

// Design tokens for consistent styling
const COLORS = { skeletonLight: '#f0f0f0', skeletonMid: '#e0e0e0', shadowLight: 'rgba(0,0,0,0.04)' };
const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 };
const SIZES = { coverSmall: 72, avatarSmall: 20, avatarMedium: 140, cardHeightSmall: 200,
                cardHeightMedium: 260, cardHeightLarge: 280, ratingStart: 24,
                borderRadiusSmall: 4, borderRadiusMedium: 8, borderRadiusLarge: 12 };

// Shimmer gradient animation effect
const getSkeletonGradient = () => ({
  background: `linear-gradient(90deg, ${COLORS.skeletonLight} 25%, ${COLORS.skeletonMid} 50%, ${COLORS.skeletonLight} 75%)`,
  backgroundSize: '200% 100%',
  animation: 'skeleton-loading 1.5s ease-in-out infinite',
});

// CSS animation for shimmer effect
const skeletonKeyframes = `@keyframes skeleton-loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`;
const mb = (v) => ({ marginBottom: v }); // Margin bottom helper
const createSkeletonGrid = (count, w = '100%', h = '80px') => Array.from({ length: count }).map((_, i) =>
                            <Skeleton key={i} width={w} height={h} borderRadius={SIZES.borderRadiusLarge} />); // Reusable grid generator

// Base skeleton component with animated shimmer gradient
export function Skeleton({ width = '100%', height = '20px', borderRadius = SIZES.borderRadiusSmall, style = {} }) {
  return <div style={{ ...getSkeletonGradient(), width, height, borderRadius, ...style }}><style>{skeletonKeyframes}</style></div>;
}

// Grid of work card placeholders for search/browse pages
export function WorkGridSkeleton({ count = 6, columns = 'repeat(auto-fit, minmax(160px, 1fr))' }) {
  return <div style={{ display: 'grid', gap: SPACING.xl, gridTemplateColumns: columns }}>
    {Array.from({ length: count }).map((_, i) =>
    <div key={i}>
      <Skeleton width="100%" height={`${SIZES.cardHeightLarge}px`}
      borderRadius={SIZES.borderRadiusLarge} style={{ boxShadow: `0 1px 4px ${COLORS.shadowLight}` }}
    /></div>)}
  </div>;
}

// Friend/user card with cover image, avatar, and text
export function FriendCardSkeleton() {
  return <div className="skeleton-friend-card">
    <Skeleton width="100%" height={`${SIZES.cardHeightSmall}px`} borderRadius="0" /> {/* Cover image */}
    <div className="skeleton-friend-card-padding">
      <div className="skeleton-friend-card-header">
        <Skeleton width={`${SIZES.avatarSmall}px`} height={`${SIZES.avatarSmall}px`} borderRadius="50%" /> {/* Avatar */}
        <Skeleton width="80px" height="13px" /> {/* Name */}
      </div>
      <Skeleton width="90%" height="12px" /> {/* Bio/description */}
    </div>
  </div>;
}

// Responsive grid of friend cards
export function FriendGridSkeleton({ count = 4 }) {
  return <div className="skeleton-friend-grid">{Array.from({ length: count }).map((_, i) => <FriendCardSkeleton key={i} />)}</div>;
}

// Three-column layout: cover/action, main content, ratings sidebar
export function WorkDetailsSkeleton() {
  return <div className="skeleton-details-container"><div className="skeleton-details-grid">
    <aside> {/* Left: Book cover and action button */}
      <Skeleton width="180px" height={`${SIZES.cardHeightMedium}px`} borderRadius={SIZES.borderRadiusMedium} style={mb(SPACING.md)} />
      <Skeleton width="180px" height="48px" borderRadius={SIZES.borderRadiusLarge} />
    </aside>
    <main> {/* Center: Title, description, genre tags, review button, similar works */}
      <Skeleton width="60%" height="32px" style={mb(SPACING.md)} />
      <Skeleton width="40%" height="16px" style={mb(SPACING.xl)} />
      <div className="skeleton-details-main-section"><Skeleton width="80px" height="24px" borderRadius={SIZES.borderRadiusLarge} />
        <Skeleton width="100px" height="24px" borderRadius={SIZES.borderRadiusLarge} /></div>
      <Skeleton width="30%" height="24px" style={mb(SPACING.md)} />
      <Skeleton width="100%" height="64px" borderRadius={SIZES.borderRadiusSmall} style={mb(SPACING.xs)} />
      <Skeleton width="120px" height="32px" borderRadius={SIZES.borderRadiusSmall}
        style={{ marginLeft: 'auto', display: 'block', marginBottom: SPACING.xxl }} />
      <Skeleton width="40%" height="24px" style={mb(SPACING.md)} />
      <div className="skeleton-details-similar-works">{createSkeletonGrid(5, '140px', '200px')}</div>
    </main>
    <aside className="skeleton-details-right-sidebar"> {/* Right: Rating aggregate and star distribution */}
      <Skeleton width="100%" height="40px" borderRadius={SIZES.borderRadiusMedium} style={mb(SPACING.xxl)} />
      <Skeleton width="60%" height="20px" style={mb(SPACING.lg)} />
      <div className="skeleton-details-rating-stars">{Array.from({ length: 5 }).map((_, i) =>
        <Skeleton key={i} width={`${SIZES.ratingStart}px`} height={`${SIZES.ratingStart}px`} />)}</div>
      <Skeleton width="70%" height="16px" style={mb(SPACING.md)} />
      {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton-details-rating-row"><Skeleton width="28px" height="20px" />
        <Skeleton width="100%" height="20px" borderRadius={SIZES.borderRadiusSmall} /><Skeleton width="32px" height="20px" /></div>)}
    </aside>
  </div></div>;
}

// Search results page with filter bar and cards
export function SearchResultsSkeleton({ count = 12 }) {
  return <><div className="skeleton-search-filter-bar">{Array.from({ length: 4 }).map((_, i) =>
  <Skeleton key={i} width="120px" height="36px" borderRadius={SIZES.borderRadiusSmall} />)}</div>
  <WorkGridSkeleton count={count} columns="repeat(auto-fill, minmax(180px, 1fr))" /></>;
}

// User profile: header with stats grid, and rating history section
export function ProfileSkeleton() {
  return <div className="page-container"><div className="page-inner"><main className="page-main"><div className="skeleton-profile-container">
    <div className="skeleton-profile-header-section"><div className="skeleton-profile-header-grid">
      <div className="skeleton-profile-avatar"> {/* User avatar on left */}
        <Skeleton width={`${SIZES.avatarMedium}px`} height={`${SIZES.avatarMedium}px`} borderRadius="50%" style={{ flexShrink: 0 }} /></div>
      <div className="skeleton-profile-user-info"> {/* Name, bio, action buttons */}
        <Skeleton width="200px" height="32px" style={mb(SPACING.md)} />
        <Skeleton width="300px" height="16px" style={mb(SPACING.xl)} />
      <div className="skeleton-profile-action-buttons"><Skeleton width="120px" height="40px" borderRadius={SIZES.borderRadiusMedium} />
        <Skeleton width="120px" height="40px" borderRadius={SIZES.borderRadiusMedium} /></div></div>
    </div>
    <div className="skeleton-profile-stats-section"> {/* Rating aggregate and genre breakdown */}
      <Skeleton width="100px" height="28px" style={mb(SPACING.xs)} /><div>
      <Skeleton width="150px" height="16px" style={mb(SPACING.lg)} />
    <div className="skeleton-profile-rating-breakdown">{createSkeletonGrid(4, '100%', '80px')}</div></div>
    <div><Skeleton width="150px" height="16px" style={mb(SPACING.lg)} />
      {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton-profile-genre-stats-row">
        <Skeleton width="30px" height="28px" borderRadius={SIZES.borderRadiusSmall} />
      <Skeleton width="100%" height="28px" borderRadius={SIZES.borderRadiusSmall} /></div>)}</div></div></div>
    <section className="skeleton-profile-rating-history"> {/* Recent ratings timeline */}
      <Skeleton width="200px" height="28px" style={mb(SPACING.xxl)} />
      {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton-profile-rating-history-item">
      <Skeleton width="100%" height="60px" borderRadius={SIZES.borderRadiusMedium} /></div>)}</section>
  </div></main></div></div>;
}

export default Skeleton;