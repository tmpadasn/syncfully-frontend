/**
 * Skeleton: Loading placeholder component with shimmer animation
 * Used across app to show loading states with proper visual feedback
 */

// Design tokens for consistent styling across all skeleton variants
const COLORS = {
  skeletonLight: '#f0f0f0',
  skeletonMid: '#e0e0e0',
  cardBg: '#9a4207c8',
  borderColor: '#eee',
  textBg: '#f9f9f9',
  shadow: 'rgba(0,0,0,0.1)',
  shadowLight: 'rgba(0,0,0,0.04)',
  shadowBrown: 'rgba(154, 66, 7, 0.4)',
  gold: '#efe5db'
};

// Standard spacing values for consistent layout
const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 48
};

// Predefined size values for components and spacing
const SIZES = {
  coverSmall: 72,
  avatarSmall: 20,
  avatarMedium: 140,
  cardHeightSmall: 200,
  cardHeightMedium: 260,
  cardHeightLarge: 280,
  ratingStart: 24,
  borderRadiusSmall: 4,
  borderRadiusMedium: 8,
  borderRadiusLarge: 12
};

// Reusable style objects for different skeleton layouts
const styles = {
  skeletonBase: {
    background: `linear-gradient(90deg, ${COLORS.skeletonLight} 25%, ${COLORS.skeletonMid} 50%, ${COLORS.skeletonLight} 75%)`,
    backgroundSize: '200% 100%',
    animation: 'skeleton-loading 1.5s ease-in-out infinite'
  },
  workGridContainer: { display: 'grid', gap: SPACING.xl },
  friendCardSkeleton: {
    background: COLORS.cardBg,
    borderRadius: SIZES.borderRadiusLarge,
    overflow: 'hidden',
    height: SIZES.cardHeightSmall,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: `0 2px 8px ${COLORS.shadow}`,
    opacity: 0.7
  },
  friendCardPadding: { padding: SPACING.sm },
  friendCardHeader: { display: 'flex', gap: SPACING.xs, marginBottom: 6, alignItems: 'center' },
  friendGridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: SPACING.xl,
    marginTop: SPACING.xs
  },
  detailsContainer: { maxWidth: 1200, margin: '0 auto', padding: `${SPACING.xl}px ${SPACING.md}px` },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '220px 1fr 260px',
    gap: SPACING.xxl,
    alignItems: 'start'
  },
  detailsMainSection: { display: 'flex', gap: SPACING.xs, marginBottom: SPACING.xl },
  detailsSimilarWorks: { display: 'flex', gap: SPACING.md, marginTop: SPACING.md },
  detailsRatingStars: { display: 'flex', gap: 4, marginBottom: SPACING.xl },
  detailsRatingRow: { display: 'flex', gap: SPACING.xs, marginBottom: 6, alignItems: 'center' },
  detailsRightSidebar: { borderLeft: `1px solid ${COLORS.borderColor}`, paddingLeft: SPACING.md },
  searchFilterBar: {
    display: 'flex',
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
    padding: `${SPACING.sm}px ${SPACING.md}px`,
    background: COLORS.textBg,
    borderRadius: SIZES.borderRadiusMedium
  },
  profileContainer: { maxWidth: 900, margin: '0 auto' },
  profileHeaderSection: { marginBottom: SPACING.xxxxl },
  profileHeaderGrid: { display: 'flex', gap: SPACING.xxxl, alignItems: 'center', marginBottom: SPACING.xxxl },
  profileAvatar: { flexShrink: 0 },
  profileUserInfo: { flex: 1 },
  profileActionButtons: { display: 'flex', gap: SPACING.md },
  profileStatsSection: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: SPACING.xxl,
    marginTop: SPACING.xxxxl,
    paddingTop: SPACING.xxxl,
    borderTop: `1px solid ${COLORS.gold}`
  },
  profileRatingBreakdown: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: SPACING.md
  },
  profileGenreStatsRow: { display: 'flex', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md },
  profileRatingHistory: { marginTop: SPACING.xxxxl },
  profileRatingHistoryItem: { marginBottom: SPACING.lg, padding: SPACING.lg, background: COLORS.textBg, borderRadius: SIZES.borderRadiusMedium },
};

// Helper function to generate grid of skeleton elements
const createSkeletonGrid = (count, width = '100%', height = '80px') =>
  Array.from({ length: count }).map((_, i) => <Skeleton key={i} width={width} height={height} borderRadius={SIZES.borderRadiusLarge} />);

// CSS animation for shimmer effect
const skeletonKeyframes = `@keyframes skeleton-loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`;

// Base skeleton component with shimmer animation
export function Skeleton({ width = '100%', height = '20px', borderRadius = SIZES.borderRadiusSmall, style = {} }) {
  return (
    <div style={{ ...styles.skeletonBase, width, height, borderRadius, ...style }}>
      <style>{skeletonKeyframes}</style>
    </div>
  );
}

// Grid of work card skeletons with configurable columns and count
export function WorkGridSkeleton({ count = 6, columns = 'repeat(auto-fit, minmax(160px, 1fr))' }) {
  return (
    <div style={{ ...styles.workGridContainer, gridTemplateColumns: columns }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Skeleton
            width="100%"
            height={`${SIZES.cardHeightLarge}px`}
            borderRadius={SIZES.borderRadiusLarge}
            style={{ boxShadow: `0 1px 4px ${COLORS.shadowLight}` }}
          />
        </div>
      ))}
    </div>
  );
}

// Single friend card skeleton (avatar, name, bio)
export function FriendCardSkeleton() {
  return (
    <div style={styles.friendCardSkeleton}>
      <Skeleton width="100%" height={`${SIZES.cardHeightSmall}px`} borderRadius="0" />
      <div style={styles.friendCardPadding}>
        <div style={styles.friendCardHeader}>
          <Skeleton width={`${SIZES.avatarSmall}px`} height={`${SIZES.avatarSmall}px`} borderRadius="50%" />
          <Skeleton width="80px" height="13px" />
        </div>
        <Skeleton width="90%" height="12px" />
      </div>
    </div>
  );
}

// Grid layout for multiple friend card skeletons
export function FriendGridSkeleton({ count = 4 }) {
  return (
    <div style={styles.friendGridContainer}>
      {Array.from({ length: count }).map((_, i) => <FriendCardSkeleton key={i} />)}
    </div>
  );
}

// Detailed work page skeleton (cover, title, description, ratings, similar works)
export function WorkDetailsSkeleton() {
  return (
    <div style={styles.detailsContainer}>
      <div style={styles.detailsGrid}>
        <aside>
          <Skeleton
            width="180px"
            height={`${SIZES.cardHeightMedium}px`}
            borderRadius={SIZES.borderRadiusMedium}
            style={{ marginBottom: SPACING.md }}
          />
          <Skeleton width="180px" height="48px" borderRadius={SIZES.borderRadiusLarge} />
        </aside>
        <main>
          <Skeleton width="60%" height="32px" style={{ marginBottom: SPACING.md }} />
          <Skeleton width="40%" height="16px" style={{ marginBottom: SPACING.xl }} />
          <div style={styles.detailsMainSection}>
            <Skeleton width="80px" height="24px" borderRadius={SIZES.borderRadiusLarge} />
            <Skeleton width="100px" height="24px" borderRadius={SIZES.borderRadiusLarge} />
          </div>
          <Skeleton width="30%" height="24px" style={{ marginBottom: SPACING.md }} />
          <Skeleton
            width="100%"
            height="64px"
            borderRadius={SIZES.borderRadiusSmall}
            style={{ marginBottom: SPACING.xs }}
          />
          <Skeleton
            width="120px"
            height="32px"
            borderRadius={SIZES.borderRadiusSmall}
            style={{ marginLeft: 'auto', display: 'block', marginBottom: SPACING.xxl }}
          />
          <Skeleton width="40%" height="24px" style={{ marginBottom: SPACING.md }} />
          <div style={styles.detailsSimilarWorks}>{createSkeletonGrid(5, '140px', '200px')}</div>
        </main>
        <aside style={styles.detailsRightSidebar}>
          <Skeleton
            width="100%"
            height="40px"
            borderRadius={SIZES.borderRadiusMedium}
            style={{ marginBottom: SPACING.xxl }}
          />
          <Skeleton width="60%" height="20px" style={{ marginBottom: SPACING.lg }} />
          <div style={styles.detailsRatingStars}>
            {createSkeletonGrid(5, `${SIZES.ratingStart}px`, `${SIZES.ratingStart}px`)}
          </div>
          <Skeleton width="70%" height="16px" style={{ marginBottom: SPACING.md }} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={styles.detailsRatingRow}>
              <Skeleton width="28px" height="20px" />
              <Skeleton width="100%" height="20px" borderRadius={SIZES.borderRadiusSmall} />
              <Skeleton width="32px" height="20px" />
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

// Search page skeleton with filter bar and work results grid
export function SearchResultsSkeleton({ count = 12 }) {
  return (
    <div>
      <div style={styles.searchFilterBar}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} width="120px" height="36px" borderRadius={SIZES.borderRadiusSmall} />
        ))}
      </div>
      <WorkGridSkeleton count={count} columns="repeat(auto-fill, minmax(180px, 1fr))" />
    </div>
  );
}

// User profile page skeleton (avatar, stats, rating breakdown, history)
export function ProfileSkeleton() {
  return (
    <div className="page-container">
      <div className="page-inner">
        <main className="page-main">
          <div style={styles.profileContainer}>
            <div style={styles.profileHeaderSection}>
              <div style={styles.profileHeaderGrid}>
                <div style={styles.profileAvatar}>
                  <Skeleton
                    width={`${SIZES.avatarMedium}px`}
                    height={`${SIZES.avatarMedium}px`}
                    borderRadius="50%"
                    style={{ flexShrink: 0 }}
                  />
                </div>
                {/* User info section */}
                <div style={styles.profileUserInfo}>
                  <Skeleton width="200px" height="32px" style={{ marginBottom: SPACING.md }} />
                  <Skeleton width="300px" height="16px" style={{ marginBottom: SPACING.xl }} />
                  <div style={styles.profileActionButtons}>
                    <Skeleton width="120px" height="40px" borderRadius={SIZES.borderRadiusMedium} />
                    <Skeleton width="120px" height="40px" borderRadius={SIZES.borderRadiusMedium} />
                  </div>
                </div>
              </div>
              {/* Stats and breakdown section */}
              <div style={styles.profileStatsSection}>
                <Skeleton width="100px" height="28px" style={{ marginBottom: SPACING.xs }} />
                <div>
                  <Skeleton width="150px" height="16px" style={{ marginBottom: SPACING.lg }} />
                  <div style={styles.profileRatingBreakdown}>
                    {createSkeletonGrid(4, '100%', '80px')}
                  </div>
                </div>
                <div>
                  <Skeleton width="150px" height="16px" style={{ marginBottom: SPACING.lg }} />
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={styles.profileGenreStatsRow}>
                      <Skeleton width="30px" height="28px" borderRadius={SIZES.borderRadiusSmall} />
                      <Skeleton width="100%" height="28px" borderRadius={SIZES.borderRadiusSmall} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Rating history section */}
            <section style={styles.profileRatingHistory}>
              <Skeleton width="200px" height="28px" style={{ marginBottom: SPACING.xxl }} />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={styles.profileRatingHistoryItem}>
                  <Skeleton width="100%" height="60px" borderRadius={SIZES.borderRadiusMedium} />
                </div>
              ))}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Skeleton;
