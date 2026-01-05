/**
 * SearchResults Page - Styles
 * Centralized inline styles with design tokens
 */

// Design Tokens
const COLORS = {
  primary: '#9a4207',
  secondary: '#4caf50',
  text: { dark: '#392c2cff', light: '#555', muted: '#666', dimmed: '#888' },
  bg: { section: '#f8f5f0', card: '#f2f2f2' },
  border: { light: '#bfaea0', dark: '#9a420776', accent: '#d4b895' },
  button: { primary: '#9a4207c8' },
};

const SPACING = { xs: 4, sm: 6, md: 8, lg: 12, xl: 16, xxl: 20, xxxl: 24, xxxxl: 40 };
const TYPOGRAPHY = {
  banner: { fontSize: 15, fontWeight: '600' },
  title: { fontSize: 13, fontWeight: 600 },
  sectionHeader: { fontSize: 18, fontWeight: 600 },
  workTitle: { fontSize: 16, fontWeight: 700 },
  workMeta: { fontSize: 14 },
  workMetaSmall: { fontSize: 12 },
  workDesc: { fontSize: 13, lineHeight: 1.5 },
  ratingInfo: { fontSize: 13, fontWeight: 500 },
  userName: { fontSize: 16, fontWeight: 600 },
  userEmail: { fontSize: 14 },
  userDetails: { fontSize: 12 }
};
const RADII = { sm: 4, md: 6, lg: 8, xl: 10, full: '50%' };
const SHADOWS = { light: '0 2px 8px rgba(0,0,0,0.1)', button: '0 2px 8px rgba(0,0,0,0.2)', banner: '0 4px 12px rgba(0,0,0,0.15)' };

// Styles object
export const searchResultsStyles = {
  // Page Layout
  pageContainer: { display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  pageInner: { flex: 1 },
  pageMain: { maxWidth: '1200px', margin: '0 auto', width: '100%', padding: `${SPACING.xl}px ${SPACING.lg}px` },

  // Banner Section
  bannerContainer: {
    position: 'fixed',
    right: SPACING.xl,
    top: 100, width: 320,
    background: COLORS.primary,
    padding: `${SPACING.lg}px`,
    zIndex: 1000,
    boxSizing: 'border-box',
    borderRadius: RADII.lg,
    boxShadow: SHADOWS.banner
  },
  bannerContent: { display: 'flex', flexDirection: 'column', gap: SPACING.lg, color: 'white' },
  bannerHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  bannerTitle: { display: 'flex', alignItems: 'center', gap: SPACING.sm, ...TYPOGRAPHY.banner },
  bannerCloseBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: SPACING.sm,
    borderRadius: RADII.md,
    display: 'flex', alignItems: 'center',
    justifyContent: 'center',
    transition: `background 0.2s ease`
  },

  // Title Section
  titleContainer: { marginBottom: SPACING.xxl },
  titleBox: {
    padding: `${SPACING.md}px ${SPACING.lg}px`,
    backgroundColor: COLORS.bg.section,
    borderLeft: `4px solid ${COLORS.border.accent}`,
    borderRadius: RADII.sm,
    display: 'flex', alignItems: 'center',
    gap: SPACING.sm
  },
  titleText: { ...TYPOGRAPHY.title, color: COLORS.text.muted, letterSpacing: 0.5, textTransform: 'uppercase' },

  loadingContainer: { marginTop: SPACING.xxl },
  emptyMessage: { textAlign: 'center' },
  noResults: { display: 'flex', flexDirection: 'column', gap: 0 },

  // Results Container
  resultsContainer: { display: 'flex', flexDirection: 'column', gap: 0 },
  worksSection: { marginBottom: SPACING.xxxxl },
  usersSection: { marginBottom: SPACING.xxxxl },
  sectionTitle: {
    ...TYPOGRAPHY.sectionHeader,
    color: COLORS.text.dark,
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottom: `2px solid ${COLORS.border.light}`,
    letterSpacing: 0.5
  },
  itemsGrid: { display: 'flex', flexDirection: 'column', gap: SPACING.lg },

  // Work Items
  workItem: { width: '100%', display: 'flex', gap: SPACING.lg, alignItems: 'flex-start', position: 'relative' },
  coverImage: {
    width: 120, height: 170,
    borderRadius: RADII.lg,
    overflow: 'hidden',
    flexShrink: 0,
    boxShadow: SHADOWS.light,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: COLORS.bg.card,
    transition: 'all 0.2s ease'
  },
  coverImageInner: { width: '100%', height: '100%', objectFit: 'cover' },

  // Dynamic factories for button states based on processing status
  heartButton: (isProcessing) => ({
    position: 'absolute',
    top: SPACING.sm, right: SPACING.sm,
    width: 32, height: 32,
    borderRadius: RADII.full,
    border: 'none',
    background: COLORS.button.primary,
    color: 'white',
    cursor: isProcessing ? 'default' : 'pointer',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center',
    boxShadow: SHADOWS.button,
    transition: 'all 0.2s ease',
    zIndex: 10,
    opacity: isProcessing ? 0.6 : 1
  }),
  checkButton: (isProcessing) => ({
    position: 'absolute',
    top: SPACING.sm,
    right: 52, width: 32, height: 32,
    borderRadius: RADII.full,
    border: 'none',
    background: COLORS.secondary,
    color: 'white',
    cursor: isProcessing ? 'default' : 'pointer',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center',
    boxShadow: SHADOWS.button,
    transition: 'all 0.2s ease',
    zIndex: 10,
    opacity: isProcessing ? 0.6 : 1
  }),

  workInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: SPACING.md },
  workTitle: { margin: 0, ...TYPOGRAPHY.workTitle, cursor: 'pointer', color: COLORS.text.dark },
  workMeta: { display: 'flex', gap: SPACING.xl, alignItems: 'center' },
  workCreator: { margin: 0, color: COLORS.text.muted, ...TYPOGRAPHY.workMeta },
  workYear: { margin: 0, color: COLORS.text.dimmed, ...TYPOGRAPHY.workMetaSmall },
  workDescription: {
    margin: 0,
    color: COLORS.text.light,
    ...TYPOGRAPHY.workDesc,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  ratingInfo: { ...TYPOGRAPHY.ratingInfo, color: COLORS.text.muted },

  // User Items
  userItem: { display: 'flex', gap: SPACING.xl, alignItems: 'center' },
  userAvatar: { width: 80, height: 80, borderRadius: RADII.full, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.bg.card, transition: 'all 0.2s ease', flexShrink: 0 },
  userAvatarImage: { width: '100%', height: '100%', objectFit: 'cover' },
  userInfo: { flex: 1, padding: `${SPACING.sm}px 0`, display: 'flex', flexDirection: 'column', gap: SPACING.xs },
  userName: { margin: 0, ...TYPOGRAPHY.userName, cursor: 'pointer', display: 'inline-block', width: 'fit-content' },
  userDetails: { display: 'flex', gap: SPACING.xl, alignItems: 'baseline' },
  userEmail: { margin: 0, color: COLORS.text.muted, ...TYPOGRAPHY.userEmail },
  userRatings: { margin: 0, color: COLORS.text.dimmed, ...TYPOGRAPHY.userDetails },
  userLabel: { margin: 0, color: COLORS.text.dimmed, ...TYPOGRAPHY.userDetails },

  // Divider
  divider: { marginTop: SPACING.xxxl - 2, borderBottom: `2px solid ${COLORS.border.dark}`, paddingBottom: SPACING.sm, marginBottom: SPACING.lg },
};
