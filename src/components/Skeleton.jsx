/**
 * Base Skeleton component for loading states
 */

/* ===================== UI STYLES ===================== */
const styles = {
  /* ===================== SKELETON BASE ===================== */
  skeletonBase: {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'skeleton-loading 1.5s ease-in-out infinite',
  },

  /* ===================== WORK CARD SKELETON ===================== */
  workCardSkeleton: {
    opacity: 0.7,
  },

  workCardInfo: {
    flex: 1,
  },

  /* ===================== WORK GRID SKELETON ===================== */
  workGridContainer: {
    display: 'grid',
    gap: 20,
  },

  /* ===================== FRIEND CARD SKELETON ===================== */
  friendCardSkeleton: {
    background: '#9a4207c8',
    borderRadius: '12px',
    overflow: 'hidden',
    height: '280px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    opacity: 0.7,
  },

  friendCardPadding: {
    padding: '12px',
  },

  friendCardHeader: {
    display: 'flex',
    gap: 8,
    marginBottom: 6,
    alignItems: 'center',
  },

  /* ===================== FRIEND GRID SKELETON ===================== */
  friendGridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: 20,
    marginTop: 8,
  },

  /* ===================== WORK DETAILS SKELETON ===================== */
  detailsContainer: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '20px 16px',
  },

  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '220px 1fr 260px',
    gap: 24,
    alignItems: 'start',
  },

  detailsMainSection: {
    display: 'flex',
    gap: 8,
    marginBottom: 20,
  },

  detailsSimilarWorks: {
    display: 'flex',
    gap: 12,
    marginTop: 12,
  },

  detailsRatingStars: {
    display: 'flex',
    gap: 4,
    marginBottom: 20,
  },

  detailsRatingRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 6,
    alignItems: 'center',
  },

  detailsRightSidebar: {
    borderLeft: '1px solid #eee',
    paddingLeft: 16,
  },

  /* ===================== SEARCH RESULTS SKELETON ===================== */
  searchFilterBar: {
    display: 'flex',
    gap: 12,
    marginBottom: 24,
    padding: '12px 16px',
    background: '#f9f9f9',
    borderRadius: 8,
  },

  /* ===================== PROFILE SKELETON ===================== */
  profileContainer: {
    maxWidth: 900,
    margin: '0 auto',
  },

  profileHeaderSection: {
    marginBottom: 48,
  },

  profileHeaderGrid: {
    display: 'flex',
    gap: 32,
    alignItems: 'center',
    marginBottom: 32,
  },

  profileAvatar: {
    flexShrink: 0,
  },

  profileUserInfo: {
    flex: 1,
  },

  profileActionButtons: {
    display: 'flex',
    gap: 12,
  },

  profileStatsSection: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 24,
    marginTop: 36,
    paddingTop: 32,
    borderTop: '1px solid #efe5db',
  },

  profileRatingBreakdown: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 12,
  },

  profileGenreStatsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },

  profileRatingHistory: {
    marginTop: 48,
  },

  profileRatingHistoryItem: {
    marginBottom: 16,
    padding: 16,
    background: '#f9f9f9',
    borderRadius: 8,
  },
};

/* ===================== ANIMATIONS ===================== */
const skeletonKeyframes = `
  @keyframes skeleton-loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;
export function Skeleton({ width = '100%', height = '20px', borderRadius = '4px', style = {} }) {
  return (
    <div
      style={{
        ...styles.skeletonBase,
        width,
        height,
        borderRadius,
        ...style
      }}
    >
      <style>{skeletonKeyframes}</style>
    </div>
  );
}

/**
 * Skeleton for WorkCard component
 */
export function WorkCardSkeleton({ coverStyle = {} }) {
  return (
    <div className="work-card" style={styles.workCardSkeleton}>
      <Skeleton 
        width={coverStyle.width || 72} 
        height={coverStyle.height || 100} 
        borderRadius="4px"
        style={coverStyle}
      />
      <div className="work-info" style={styles.workCardInfo}>
        <Skeleton width="80%" height="18px" style={{ marginBottom: 8 }} />
        <Skeleton width="60%" height="14px" style={{ marginBottom: 6 }} />
        <Skeleton width="40%" height="14px" />
      </div>
    </div>
  );
}

/**
 * Skeleton for grid of work cards (popular works, search results)
 */
export function WorkGridSkeleton({ count = 6, columns = 'repeat(auto-fit, minmax(160px, 1fr))' }) {
  return (
    <div style={{ ...styles.workGridContainer, gridTemplateColumns: columns }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Skeleton 
            width="100%" 
            height="280px" 
            borderRadius="12px"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton for friend cards
 */
export function FriendCardSkeleton() {
  return (
    <div style={styles.friendCardSkeleton}>
      <Skeleton width="100%" height="200px" borderRadius="0" />
      <div style={styles.friendCardPadding}>
        <div style={styles.friendCardHeader}>
          <Skeleton width="20px" height="20px" borderRadius="50%" />
          <Skeleton width="80px" height="13px" />
        </div>
        <Skeleton width="90%" height="12px" />
      </div>
    </div>
  );
}

/**
 * Skeleton for friend grid
 */
export function FriendGridSkeleton({ count = 4 }) {
  return (
    <div style={styles.friendGridContainer}>
      {Array.from({ length: count }).map((_, i) => (
        <FriendCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for WorkDetails page
 */
export function WorkDetailsSkeleton() {
  return (
    <div style={styles.detailsContainer}>
      <div style={styles.detailsGrid}>
        {/* LEFT column */}
        <aside>
          <Skeleton width="180px" height="260px" borderRadius="8px" style={{ marginBottom: 12 }} />
          <Skeleton width="180px" height="48px" borderRadius="10px" />
        </aside>

        {/* MIDDLE column */}
        <main>
          <Skeleton width="60%" height="32px" style={{ marginBottom: 12 }} />
          <Skeleton width="40%" height="16px" style={{ marginBottom: 20 }} />
          
          <div style={styles.detailsMainSection}>
            <Skeleton width="80px" height="24px" borderRadius="16px" />
            <Skeleton width="100px" height="24px" borderRadius="16px" />
          </div>

          {/* Comments section */}
          <Skeleton width="30%" height="24px" style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height="64px" borderRadius="4px" style={{ marginBottom: 8 }} />
          <Skeleton width="120px" height="32px" borderRadius="4px" style={{ marginLeft: 'auto', display: 'block', marginBottom: 24 }} />

          {/* Similar works */}
          <Skeleton width="40%" height="24px" style={{ marginBottom: 12 }} />
          <div style={styles.detailsSimilarWorks}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} width="140px" height="200px" borderRadius="4px" />
            ))}
          </div>
        </main>

        {/* RIGHT column */}
        <aside style={styles.detailsRightSidebar}>
          <Skeleton width="100%" height="40px" borderRadius="8px" style={{ marginBottom: 24 }} />
          
          <Skeleton width="60%" height="20px" style={{ marginBottom: 16 }} />
          
          {/* Rating stars */}
          <div style={styles.detailsRatingStars}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} width="24px" height="24px" borderRadius="4px" />
            ))}
          </div>

          {/* Distribution */}
          <Skeleton width="70%" height="16px" style={{ marginBottom: 12 }} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={styles.detailsRatingRow}>
              <Skeleton width="28px" height="20px" />
              <Skeleton width="100%" height="20px" borderRadius="4px" />
              <Skeleton width="32px" height="20px" />
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

/**
 * Skeleton for search results page
 */
export function SearchResultsSkeleton({ count = 12 }) {
  return (
    <div>
      {/* Filter bar skeleton */}
      <div style={styles.searchFilterBar}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} width="120px" height="36px" borderRadius="6px" />
        ))}
      </div>

      {/* Results grid */}
      <WorkGridSkeleton count={count} columns="repeat(auto-fill, minmax(180px, 1fr))" />
    </div>
  );
}

/**
 * Skeleton for Profile page
 */
export function ProfileSkeleton() {
  return (
    <div className="page-container">
      <div className="page-inner">
        <main className="page-main">
          <div style={styles.profileContainer}>
            {/* Profile header skeleton */}
            <div style={styles.profileHeaderSection}>
              <div style={styles.profileHeaderGrid}>
                {/* Avatar skeleton */}
                <div style={styles.profileAvatar}>
                  <Skeleton 
                    width="140px" 
                    height="140px" 
                    borderRadius="50%" 
                    style={{ flexShrink: 0 }}
                  />
                </div>

                {/* User info skeleton */}
                <div style={styles.profileUserInfo}>
                  <Skeleton width="200px" height="32px" style={{ marginBottom: 12 }} />
                  <Skeleton width="300px" height="16px" style={{ marginBottom: 20 }} />
                  <div style={styles.profileActionButtons}>
                    <Skeleton width="120px" height="40px" borderRadius="8px" />
                    <Skeleton width="120px" height="40px" borderRadius="8px" />
                  </div>
                </div>
              </div>

              {/* Stats section skeleton */}
              <div style={styles.profileStatsSection}>
                <Skeleton width="100px" height="28px" style={{ marginBottom: 8 }} />
                
                {/* Rating breakdown skeleton */}
                <div>
                  <Skeleton width="150px" height="16px" style={{ marginBottom: 14 }} />
                  <div style={styles.profileRatingBreakdown}>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} width="100%" height="80px" borderRadius="10px" />
                    ))}
                  </div>
                </div>

                {/* Genre stats skeleton */}
                <div>
                  <Skeleton width="150px" height="16px" style={{ marginBottom: 14 }} />
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={styles.profileGenreStatsRow}>
                      <Skeleton width="30px" height="28px" borderRadius="6px" />
                      <Skeleton width="100%" height="28px" borderRadius="6px" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rating history skeleton */}
            <section style={styles.profileRatingHistory}>
              <Skeleton width="200px" height="28px" style={{ marginBottom: 24 }} />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={styles.profileRatingHistoryItem}>
                  <Skeleton width="100%" height="60px" borderRadius="8px" />
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
