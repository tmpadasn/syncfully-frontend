/**
 * Skeleton - Loading placeholder components with shimmer animation.
 * Provides various skeleton layouts for different page sections (work cards, profiles, search results, etc.).
 * Used across app to show loading states with proper visual feedback during data fetching.
 */

// ========== DESIGN TOKENS: Color palette for skeleton and background elements ==========
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

// ========== SPACING SCALE: Standard padding, margin, and gap values for consistent layout ==========
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

// ========== SIZE CONSTANTS: Predefined measurements for avatars, cards, and border radius values ==========
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

// ========== STYLE OBJECTS: Reusable CSS-in-JS styles for skeleton layouts across different page sections ==========
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

// ========== HELPER UTILITIES: Functions for generating skeleton grids and animation keyframes ==========
// Generate array of Skeleton components for creating multiple placeholder elements
const createSkeletonGrid = (count, width = '100%', height = '80px') =>
  Array.from({ length: count }).map((_, i) => <Skeleton key={i} width={width} height={height} borderRadius={SIZES.borderRadiusLarge} />);

// CSS animation keyframes for shimmer loading effect - creates left-to-right gradient shift across element
const skeletonKeyframes = `@keyframes skeleton-loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`;

// ========== BASE SKELETON COMPONENT: Generic animated placeholder with configurable dimensions ==========
// Renders animated gray gradient bar - primary building block for all skeleton layouts
export function Skeleton({ width = '100%', height = '20px', borderRadius = SIZES.borderRadiusSmall, style = {} }) {
  return (
    <div style={{ ...styles.skeletonBase, width, height, borderRadius, ...style }}>
      {/* Inject shimmer animation keyframes for this skeleton element */}
      <style>{skeletonKeyframes}</style>
    </div>
  );
}

// ========== WORK GRID SKELETON: Multiple work card placeholders with shimmer - for search/browse pages ==========
// Renders grid of card-height skeleton blocks - shows loading state for work listings
export function WorkGridSkeleton({ count = 6, columns = 'repeat(auto-fit, minmax(160px, 1fr))' }) {
  return (
    <div style={{ ...styles.workGridContainer, gridTemplateColumns: columns }}>
      {/* Create individual skeleton cards matching work card dimensions with subtle shadow */}
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

// ========== FRIEND CARD SKELETON: Individual friend/user card placeholder with avatar and name ==========
// Shows loading state for user cards - includes cover image area, small avatar, and name skeleton
export function FriendCardSkeleton() {
  return (
    <div style={styles.friendCardSkeleton}>
      {/* Cover image area (full width, no border radius) */}
      <Skeleton width="100%" height={`${SIZES.cardHeightSmall}px`} borderRadius="0" />
      <div style={styles.friendCardPadding}>
        {/* Avatar (circular) and user name */}
        <div style={styles.friendCardHeader}>
          <Skeleton width={`${SIZES.avatarSmall}px`} height={`${SIZES.avatarSmall}px`} borderRadius="50%" />
          <Skeleton width="80px" height="13px" />
        </div>
        {/* User bio/description text line */}
        <Skeleton width="90%" height="12px" />
      </div>
    </div>
  );
}

// ========== FRIEND GRID SKELETON: Multiple friend cards grid - for user/friend browsing pages ==========
// Renders responsive grid of friend card skeletons with configurable count
export function FriendGridSkeleton({ count = 4 }) {
  return (
    <div style={styles.friendGridContainer}>
      {/* Map over count to render individual friend card skeletons */}
      {Array.from({ length: count }).map((_, i) => <FriendCardSkeleton key={i} />)}
    </div>
  );
}

// ========== WORK DETAILS SKELETON: Full work page layout - cover, description, ratings, recommendations ==========
// Three-column layout matching work details page: left (cover), center (description), right (ratings)
export function WorkDetailsSkeleton() {
  return (
    <div style={styles.detailsContainer}>
      <div style={styles.detailsGrid}>
        {/* Left sidebar: work cover image and action button */}
        <aside>
          <Skeleton
            width="180px"
            height={`${SIZES.cardHeightMedium}px`}
            borderRadius={SIZES.borderRadiusMedium}
            style={{ marginBottom: SPACING.md }}
          />
          <Skeleton width="180px" height="48px" borderRadius={SIZES.borderRadiusLarge} />
        </aside>

        {/* Main content: title, creator, tags, description, recommendations */}
        <main>
          {/* Title skeleton (wider) and creator info (narrower) */}
          <Skeleton width="60%" height="32px" style={{ marginBottom: SPACING.md }} />
          <Skeleton width="40%" height="16px" style={{ marginBottom: SPACING.xl }} />
          {/* Genre/type tags */}
          <div style={styles.detailsMainSection}>
            <Skeleton width="80px" height="24px" borderRadius={SIZES.borderRadiusLarge} />
            <Skeleton width="100px" height="24px" borderRadius={SIZES.borderRadiusLarge} />
          </div>
          {/* Description section header and paragraph */}
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
          {/* "You May Also Like" recommendations section with similar works grid */}
          <Skeleton width="40%" height="24px" style={{ marginBottom: SPACING.md }} />
          <div style={styles.detailsSimilarWorks}>{createSkeletonGrid(5, '140px', '200px')}</div>
        </main>

        {/* Right sidebar: ratings and distribution */}
        <aside style={styles.detailsRightSidebar}>
          {/* Add to shelf button */}
          <Skeleton
            width="100%"
            height="40px"
            borderRadius={SIZES.borderRadiusMedium}
            style={{ marginBottom: SPACING.xxl }}
          />
          {/* Your rating section header and star buttons */}
          <Skeleton width="60%" height="20px" style={{ marginBottom: SPACING.lg }} />
          <div style={styles.detailsRatingStars}>
            {/* 5 star rating buttons */}
            {createSkeletonGrid(5, `${SIZES.ratingStart}px`, `${SIZES.ratingStart}px`)}
          </div>
          {/* Rating distribution header and histogram rows */}
          <Skeleton width="70%" height="16px" style={{ marginBottom: SPACING.md }} />
          {/* 5-row rating distribution (5★ through 1★) */}
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

// ========== SEARCH RESULTS SKELETON: Search page layout - filter bar and work grid ==========
// Shows loading state for search results with filter placeholder bar and card grid
export function SearchResultsSkeleton({ count = 12 }) {
  return (
    <div>
      {/* Filter bar with placeholder filter buttons */}
      <div style={styles.searchFilterBar}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} width="120px" height="36px" borderRadius={SIZES.borderRadiusSmall} />
        ))}
      </div>
      {/* Grid of work card skeletons matching search results layout */}
      <WorkGridSkeleton count={count} columns="repeat(auto-fill, minmax(180px, 1fr))" />
    </div>
  );
}

// ========== PROFILE SKELETON: User profile page layout - avatar, stats, ratings, history ==========
// Complex profile page skeleton with header (avatar + info), stats section (breakdown + genres), and rating history
export function ProfileSkeleton() {
  return (
    <div className="page-container">
      <div className="page-inner">
        <main className="page-main">
          <div style={styles.profileContainer}>
            <div style={styles.profileHeaderSection}>
              <div style={styles.profileHeaderGrid}>
                {/* User avatar (large circular placeholder) */}
                <div style={styles.profileAvatar}>
                  <Skeleton
                    width={`${SIZES.avatarMedium}px`}
                    height={`${SIZES.avatarMedium}px`}
                    borderRadius="50%"
                    style={{ flexShrink: 0 }}
                  />
                </div>
                {/* User name, email, and action buttons (edit profile, follow) */}
                <div style={styles.profileUserInfo}>
                  <Skeleton width="200px" height="32px" style={{ marginBottom: SPACING.md }} />
                  <Skeleton width="300px" height="16px" style={{ marginBottom: SPACING.xl }} />
                  <div style={styles.profileActionButtons}>
                    <Skeleton width="120px" height="40px" borderRadius={SIZES.borderRadiusMedium} />
                    <Skeleton width="120px" height="40px" borderRadius={SIZES.borderRadiusMedium} />
                  </div>
                </div>
              </div>
              {/* Stats section: rating breakdown (grid) and top genres (list) */}
              <div style={styles.profileStatsSection}>
                {/* Stats section header */}
                {/* Stats section header */}
                <Skeleton width="100px" height="28px" style={{ marginBottom: SPACING.xs }} />
                {/* Rating breakdown by type (grid of 4 cards) */}
                <div>
                  <Skeleton width="150px" height="16px" style={{ marginBottom: SPACING.lg }} />
                  <div style={styles.profileRatingBreakdown}>
                    {createSkeletonGrid(4, '100%', '80px')}
                  </div>
                </div>
                {/* Top genres/categories list (5 rows with icon and label) */}
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
            {/* User rating history section with 3 sample entries */}
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
