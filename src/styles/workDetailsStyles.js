/**
 * WorkDetailsStyles.js
 *
 * Centralized styles and design tokens for WorkDetails page
 * Organized into logical sections for easy maintenance and reusability
 * All values preserved from original implementation
 */

// Design Tokens - Single source of truth for all values
const COLORS = {
  primary: { light: '#9a4207', dark: '#b95716' },
  success: { light: '#d4edda', border: '#c3e6cb', text: '#155724', bg: '#e8f5e9', darkText: '#2e7d32', badge: '#81c784' },
  error: { light: '#f8d7da', border: '#f5c6cb', text: '#721c24' },
  neutral: { border: '#eee', gray: '#666', medGray: '#f5f5f5', darkText: '#333', lightText: '#888' },
};

const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 28 };
const TYPOGRAPHY = { xs: 11, sm: 12, md: 13, base: 14, lg: 15, xl: 20, xxl: 24 };
const RADII = { sm: 4, md: 8, lg: 10, full: 20, badge: 12 };

const SHADOWS = {
  light: '0 2px 12px rgba(0, 0, 0, 0.04)',
  link: '0 4px 12px rgba(154, 66, 7, 0.3)',
  linkHover: '0 6px 16px rgba(154, 66, 7, 0.4)',
};

const GRADIENTS = {
  brown: 'linear-gradient(135deg, #9a4207, #b95716)',
  desc: 'linear-gradient(to bottom, rgba(154, 66, 7, 0.03), rgba(154, 66, 7, 0.01))',
};

// Helper mixins for common patterns
const flexCenter = { display: 'flex', alignItems: 'center', justifyContent: 'center' };
const flexCol = { display: 'flex', flexDirection: 'column' };
const flexBase = { display: 'flex', alignItems: 'center' };

// Base styles for reusable components
const baseTag = { padding: `${SPACING.sm}px ${SPACING.lg}px`, borderRadius: RADII.full, fontSize: TYPOGRAPHY.md, color: '#fff' };
const baseMessage = { padding: `${SPACING.md}px ${SPACING.lg}px`, marginBottom: SPACING.lg, borderRadius: RADII.md, fontSize: TYPOGRAPHY.base, fontWeight: 500 };

// Constants
export const MAX_RECOMMENDATIONS = 5;
export const RATING_TOAST_TIMEOUT = 2000;
export const EXTERNAL_LINK_HOVER_SHADOW = '0 6px 16px rgba(154, 66, 7, 0.4)';
export const EXTERNAL_LINK_DEFAULT_SHADOW = '0 4px 12px rgba(154, 66, 7, 0.3)';

// Main styles export
export const workDetailsStyles = {
  pageContainer: { maxWidth: 1200, margin: '0 auto', padding: `${SPACING.xl}px ${SPACING.lg}px` },
  gridLayout: { display: 'grid', gridTemplateColumns: '220px 1fr 260px', gap: SPACING.xxl, alignItems: 'start' },
  leftColumn: { padding: 0, ...flexCol, alignItems: 'flex-start' },
  rightColumn: { borderLeft: `1px solid ${COLORS.neutral.border}`, paddingLeft: SPACING.lg, minWidth: 240, maxWidth: 280 },

  messageBox: (type) => ({
    ...baseMessage,
    ...(type === 'success'
      ? { border: `1px solid ${COLORS.success.border}`, background: COLORS.success.light, color: COLORS.success.text }
      : { border: `1px solid ${COLORS.error.border}`, background: COLORS.error.light, color: COLORS.error.text }),
  }),
  successMessage: { background: COLORS.success.bg, border: `1px solid ${COLORS.success.badge}`, color: COLORS.success.darkText, padding: `${SPACING.sm}px ${SPACING.md}px`, borderRadius: RADII.md, fontSize: TYPOGRAPHY.md, fontWeight: 600, marginBottom: SPACING.md, textAlign: 'center' },

  workTitle: { marginTop: 0 },
  workMeta: { color: COLORS.neutral.gray },
  tagContainer: { display: 'flex', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.lg, marginBottom: SPACING.xxl },
  typeTag: { ...baseTag, fontWeight: 700, background: COLORS.primary.light, letterSpacing: '0.5px', textTransform: 'uppercase' },
  genreTag: { ...baseTag, fontWeight: 600, background: COLORS.primary.dark, letterSpacing: '0.3px' },

  descriptionSection: { marginTop: SPACING.xxxl, background: GRADIENTS.desc, borderLeft: `4px solid ${COLORS.primary.light}`, borderRadius: RADII.md, padding: `${SPACING.xl}px ${SPACING.xl + SPACING.md}px`, boxShadow: SHADOWS.light },
  descriptionTitle: { marginTop: 0, marginBottom: SPACING.lg, color: COLORS.primary.light, fontSize: TYPOGRAPHY.xl, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' },
  descriptionText: { fontSize: TYPOGRAPHY.lg, lineHeight: 1.7, color: COLORS.neutral.darkText, margin: 0, whiteSpace: 'pre-wrap', textAlign: 'justify' },
  descriptionPlaceholder: { fontSize: TYPOGRAPHY.lg, lineHeight: 1.7, color: COLORS.neutral.gray, margin: 0, fontStyle: 'italic' },

  recommendationsSection: { marginTop: SPACING.xxl },
  recommendationsDisplay: { display: 'flex', gap: SPACING.md, overflowX: 'auto', paddingBottom: SPACING.sm, marginTop: SPACING.md },
  recommendationCard: { minWidth: 140 },
  emptyRecommendations: { marginTop: SPACING.md, padding: SPACING.lg, background: COLORS.neutral.medGray, borderRadius: RADII.md },

  linksContainer: { display: 'flex', flexDirection: 'column', gap: SPACING.md, marginTop: SPACING.lg },
  externalLink: { ...flexBase, ...flexCenter, gap: SPACING.sm, padding: `${SPACING.lg + 2}px ${SPACING.xl}px`, background: GRADIENTS.brown, color: 'white', textDecoration: 'none', borderRadius: RADII.lg, fontWeight: 700, fontSize: TYPOGRAPHY.base, boxShadow: SHADOWS.link, transition: 'all 0.2s ease', border: 'none', cursor: 'pointer', width: '100%', boxSizing: 'border-box' },

  ratingContainer: { marginBottom: SPACING.xl },
  ratingHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.sm },
  ratingTitle: { margin: 0, fontSize: TYPOGRAPHY.base, fontWeight: 600 },
  ratingBadge: { display: 'flex', alignItems: 'center', gap: SPACING.xs, background: COLORS.success.bg, padding: `${SPACING.xs}px ${SPACING.sm}px`, borderRadius: RADII.badge, fontSize: TYPOGRAPHY.sm, fontWeight: 600, color: COLORS.success.darkText },
  starContainer: { display: 'flex', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.lg },
  star: (isGuest, filled) => ({ background: 'transparent', border: 'none', padding: SPACING.xs, margin: 0, cursor: isGuest ? 'not-allowed' : 'pointer', fontSize: TYPOGRAPHY.xxl, lineHeight: 1, color: filled ? COLORS.primary.light : COLORS.neutral.lightText, opacity: isGuest ? 0.4 : 1, transition: 'color 0.2s ease', fontWeight: filled ? 'normal' : 'bold', textShadow: filled ? 'none' : `0 0 1px ${COLORS.neutral.gray}` }),

  distributionContainer: { marginBottom: SPACING.xl },
  distributionTitle: { margin: `0 0 ${SPACING.md}px 0`, fontSize: TYPOGRAPHY.base, fontWeight: 600 },
  distributionEmpty: { fontSize: TYPOGRAPHY.md, color: COLORS.neutral.gray, margin: 0 },
  distributionRows: { display: 'flex', flexDirection: 'column', gap: SPACING.xs + 1 },
  distributionRow: { display: 'flex', alignItems: 'center', gap: SPACING.sm },
  distributionLabel: { width: 28, textAlign: 'right', fontSize: TYPOGRAPHY.sm, fontWeight: 500 },
  distributionBar: { flex: 1, background: COLORS.neutral.border, height: 20, borderRadius: RADII.sm, overflow: 'hidden', minWidth: 100, position: 'relative' },
  distributionFill: { width: (pct) => `${pct}%`, height: '100%', background: GRADIENTS.brown, transition: 'width 0.3s ease' },
  distributionCount: { width: 32, textAlign: 'left', fontSize: TYPOGRAPHY.md, fontWeight: 600, color: COLORS.neutral.darkText },
  distributionTotal: { fontSize: TYPOGRAPHY.xs, color: COLORS.neutral.gray, marginTop: SPACING.xs, textAlign: 'center' },
};

// Component usage documentation
export const workDetailsComponents = {
  WorkCard: { name: 'WorkCard', usage: 'Display work cover and basic info', instances: [{ location: 'LEFT column', props: { work: 'work object', coverStyle: '{ width: 180, height: 260 }', flat: true, hideInfo: true } }, { location: 'RECOMMENDATIONS', props: { work: 'recommended work object', flat: true, hideInfo: true, coverStyle: '{ width: 140, height: 200 }' } }] },
  Toast: { name: 'Toast', usage: 'Notification for recommendation updates', props: { message: 'string - notification text', onClose: 'callback function', link: 'string - optional navigation link' } },
  AddToShelfBtn: { name: 'AddToShelfBtn', usage: 'Button to add work to user shelves', location: 'RIGHT column', props: { workId: 'number - parsed from workId param', userId: 'number - current user ID', shelves: 'array - user shelves', onSuccess: 'callback function' } },
  WorkDetailsSkeleton: { name: 'WorkDetailsSkeleton', usage: 'Loading skeleton for work details page', location: 'Shown during initial data load' }
};
