/**
 * WorkDetailsStyles.js
 *
 * Extracted UI styles and component configurations used in WorkDetails.jsx
 * All values preserved from original implementation
 * Optimized with design tokens for reduced lines and improved maintainability
 */

/* ===================== CONSTANTS ===================== */
export const MAX_RECOMMENDATIONS = 5;
export const RATING_TOAST_TIMEOUT = 2000;
export const EXTERNAL_LINK_HOVER_SHADOW = '0 6px 16px rgba(154, 66, 7, 0.4)';
export const EXTERNAL_LINK_DEFAULT_SHADOW = '0 4px 12px rgba(154, 66, 7, 0.3)';

/* ===================== DESIGN TOKENS ===================== */
const colors = {
  primary: { light: '#9a4207', dark: '#b95716' },
  success: { light: '#d4edda', border: '#c3e6cb', text: '#155724', bg: '#e8f5e9', darkText: '#2e7d32', badge: '#81c784' },
  error: { light: '#f8d7da', border: '#f5c6cb', text: '#721c24' },
  neutral: { border: '#eee', gray: '#666', medGray: '#f5f5f5', darkText: '#333', lightText: '#888' },
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 28 };

const typography = { xs: 11, sm: 12, md: 13, base: 14, lg: 15, xl: 20, xxl: 24 };

const radii = { sm: 4, md: 8, lg: 10, full: 20, badge: 12 };

const shadows = {
  light: '0 2px 12px rgba(0, 0, 0, 0.04)',
  link: '0 4px 12px rgba(154, 66, 7, 0.3)',
  linkHover: '0 6px 16px rgba(154, 66, 7, 0.4)',
};

const gradients = {
  brown: 'linear-gradient(135deg, #9a4207, #b95716)',
  desc: 'linear-gradient(to bottom, rgba(154, 66, 7, 0.03), rgba(154, 66, 7, 0.01))',
};

const flex = { center: { display: 'flex', alignItems: 'center', justifyContent: 'center' }, col: { display: 'flex', flexDirection: 'column' } };

/* ===================== SHARED STYLES ===================== */
const baseTag = { padding: `${spacing.sm}px ${spacing.lg}px`, borderRadius: radii.full, fontSize: typography.md, color: '#fff' };
const baseMessage = { padding: `${spacing.md}px ${spacing.lg}px`, marginBottom: spacing.lg, borderRadius: radii.md, fontSize: typography.base, fontWeight: 500 };
const baseFlex = { display: 'flex', alignItems: 'center' };

export const workDetailsStyles = {
  pageContainer: { maxWidth: 1200, margin: '0 auto', padding: `${spacing.xl}px ${spacing.lg}px` },
  gridLayout: { display: 'grid', gridTemplateColumns: '220px 1fr 260px', gap: spacing.xxl, alignItems: 'start' },
  leftColumn: { padding: 0, ...flex.col, alignItems: 'flex-start' },
  rightColumn: { borderLeft: `1px solid ${colors.neutral.border}`, paddingLeft: spacing.lg, minWidth: 240, maxWidth: 280 },

  messageBox: (type) => ({
    ...baseMessage,
    ...(type === 'success'
      ? { border: `1px solid ${colors.success.border}`, background: colors.success.light, color: colors.success.text }
      : { border: `1px solid ${colors.error.border}`, background: colors.error.light, color: colors.error.text }),
  }),
  successMessage: { background: colors.success.bg, border: `1px solid ${colors.success.badge}`, color: colors.success.darkText, padding: `${spacing.sm}px ${spacing.md}px`, borderRadius: radii.md, fontSize: typography.md, fontWeight: 600, marginBottom: spacing.md, textAlign: 'center' },

  workTitle: { marginTop: 0 },
  workMeta: { color: colors.neutral.gray },
  tagContainer: { display: 'flex', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg, marginBottom: spacing.xxl },
  typeTag: { ...baseTag, fontWeight: 700, background: colors.primary.light, letterSpacing: '0.5px', textTransform: 'uppercase' },
  genreTag: { ...baseTag, fontWeight: 600, background: colors.primary.dark, letterSpacing: '0.3px' },

  descriptionSection: { marginTop: spacing.xxxl, background: gradients.desc, borderLeft: `4px solid ${colors.primary.light}`, borderRadius: radii.md, padding: `${spacing.xl}px ${spacing.xl + spacing.md}px`, boxShadow: shadows.light },
  descriptionTitle: { marginTop: 0, marginBottom: spacing.lg, color: colors.primary.light, fontSize: typography.xl, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' },
  descriptionText: { fontSize: typography.lg, lineHeight: 1.7, color: colors.neutral.darkText, margin: 0, whiteSpace: 'pre-wrap', textAlign: 'justify' },
  descriptionPlaceholder: { fontSize: typography.lg, lineHeight: 1.7, color: colors.neutral.gray, margin: 0, fontStyle: 'italic' },

  recommendationsSection: { marginTop: spacing.xxl },
  recommendationsDisplay: { display: 'flex', gap: spacing.md, overflowX: 'auto', paddingBottom: spacing.sm, marginTop: spacing.md },
  recommendationCard: { minWidth: 140 },
  emptyRecommendations: { marginTop: spacing.md, padding: spacing.lg, background: colors.neutral.medGray, borderRadius: radii.md },

  linksContainer: { display: 'flex', flexDirection: 'column', gap: spacing.md, marginTop: spacing.lg },
  externalLink: { ...baseFlex, ...flex.center, gap: spacing.sm, padding: `${spacing.lg + 2}px ${spacing.xl}px`, background: gradients.brown, color: 'white', textDecoration: 'none', borderRadius: radii.lg, fontWeight: 700, fontSize: typography.base, boxShadow: shadows.link, transition: 'all 0.2s ease', border: 'none', cursor: 'pointer', width: '100%', boxSizing: 'border-box' },

  ratingContainer: { marginBottom: spacing.xl },
  ratingHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  ratingTitle: { margin: 0, fontSize: typography.base, fontWeight: 600 },
  ratingBadge: { display: 'flex', alignItems: 'center', gap: spacing.xs, background: colors.success.bg, padding: `${spacing.xs}px ${spacing.sm}px`, borderRadius: radii.badge, fontSize: typography.sm, fontWeight: 600, color: colors.success.darkText },
  starContainer: { display: 'flex', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.lg },
  star: (isGuest, filled) => ({ background: 'transparent', border: 'none', padding: spacing.xs, margin: 0, cursor: isGuest ? 'not-allowed' : 'pointer', fontSize: typography.xxl, lineHeight: 1, color: filled ? colors.primary.light : colors.neutral.lightText, opacity: isGuest ? 0.4 : 1, transition: 'color 0.2s ease', fontWeight: filled ? 'normal' : 'bold', textShadow: filled ? 'none' : `0 0 1px ${colors.neutral.gray}` }),

  distributionContainer: { marginBottom: spacing.xl },
  distributionTitle: { margin: `0 0 ${spacing.md}px 0`, fontSize: typography.base, fontWeight: 600 },
  distributionEmpty: { fontSize: typography.md, color: colors.neutral.gray, margin: 0 },
  distributionRows: { display: 'flex', flexDirection: 'column', gap: spacing.xs + 1 },
  distributionRow: { display: 'flex', alignItems: 'center', gap: spacing.sm },
  distributionLabel: { width: 28, textAlign: 'right', fontSize: typography.sm, fontWeight: 500 },
  distributionBar: { flex: 1, background: colors.neutral.border, height: 20, borderRadius: radii.sm, overflow: 'hidden', minWidth: 100, position: 'relative' },
  distributionFill: { width: (pct) => `${pct}%`, height: '100%', background: gradients.brown, transition: 'width 0.3s ease' },
  distributionCount: { width: 32, textAlign: 'left', fontSize: typography.md, fontWeight: 600, color: colors.neutral.darkText },
  distributionTotal: { fontSize: typography.xs, color: colors.neutral.gray, marginTop: spacing.xs, textAlign: 'center' },
};

/* ===================== COMPONENT REFERENCES ===================== */
export const workDetailsComponents = {
  WorkCard: { name: 'WorkCard', usage: 'Display work cover and basic info', instances: [{ location: 'LEFT column', props: { work: 'work object', coverStyle: '{ width: 180, height: 260 }', flat: true, hideInfo: true } }, { location: 'RECOMMENDATIONS', props: { work: 'recommended work object', flat: true, hideInfo: true, coverStyle: '{ width: 140, height: 200 }' } }] },
  Toast: { name: 'Toast', usage: 'Notification for recommendation updates', props: { message: 'string - notification text', onClose: 'callback function', link: 'string - optional navigation link' } },
  AddToShelfBtn: { name: 'AddToShelfBtn', usage: 'Button to add work to user shelves', location: 'RIGHT column', props: { workId: 'number - parsed from workId param', userId: 'number - current user ID', shelves: 'array - user shelves', onSuccess: 'callback function' } },
  WorkDetailsSkeleton: { name: 'WorkDetailsSkeleton', usage: 'Loading skeleton for work details page', location: 'Shown during initial data load' }
};

/* ===================== LAYOUT STRUCTURE ===================== */
export const workDetailsLayoutStructure = {
  pageContainer: { maxWidth: 1200, description: 'Main page wrapper' },
  gridLayout: { columns: '220px 1fr 260px', description: 'Three-column layout: left sidebar, main content, right sidebar', gaps: 24 },
  leftColumn: { width: 220, content: 'WorkCard (book cover), External links' },
  mainColumn: { flexible: true, content: 'Work title, metadata, tags, description, recommendations section' },
  rightColumn: { width: 260, content: 'AddToShelfBtn, Ratings section, Rating distribution' }
};

/* ===================== COLOR PALETTE ===================== */
export const colorPalette = {
  primary: { brown: '#9a4207', brownDark: '#b95716' },
  success: { light: '#d4edda', border: '#c3e6cb', text: '#155724', background: '#e8f5e9', darkText: '#2e7d32' },
  error: { light: '#f8d7da', border: '#f5c6cb', text: '#721c24' },
  neutral: { lightGray: '#eee', mediumGray: '#f5f5f5', darkGray: '#666', darkText: '#333', lightText: '#888' }
};

/* ===================== INTERACTIVE STATES ===================== */
export const interactiveStates = {
  externalLinkHover: { transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(154, 66, 7, 0.4)' },
  externalLinkDefault: { transform: 'translateY(0)', boxShadow: '0 4px 12px rgba(154, 66, 7, 0.3)' },
  starHover: { transition: 'color 0.2s ease' },
  distributionBarAnimation: { transition: 'width 0.3s ease' }
};

/* ===================== SPACING CONSTANTS ===================== */
export const spacingValues = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 28,
  pageContainerPadding: '20px 16px', gridGap: 24, tagGap: 8,
  descriptionSection: 28, recommendationsSectionMargin: 24, ratingContainerMargin: 20,
  linksContainerGap: 12, recommendationsDisplayGap: 12, starContainerGap: 4, distributionRowGap: 6
};

/* ===================== TYPOGRAPHY ===================== */
export const typographyScales = {
  xs: 11, sm: 12, md: 13, base: 14, lg: 15, xl: 20, xxl: 24,
  typeTag: { fontSize: 13, fontWeight: 700, letterSpacing: '0.5px' },
  genreTag: { fontSize: 13, fontWeight: 600, letterSpacing: '0.3px' },
  descriptionTitle: { fontSize: 20, fontWeight: 700, letterSpacing: '0.5px' },
  descriptionText: { fontSize: 15, lineHeight: 1.7 }
};

/* ===================== BORDER & RADIUS ===================== */
export const borderRadii = { sm: 4, md: 8, lg: 10, full: 20, badge: 12 };

/* ===================== SHADOWS ===================== */
export const boxShadowsCollection = {
  descriptionSection: '0 2px 12px rgba(0, 0, 0, 0.04)',
  externalLinkDefault: '0 4px 12px rgba(154, 66, 7, 0.3)',
  externalLinkHover: '0 6px 16px rgba(154, 66, 7, 0.4)'
};

/* ===================== GRADIENTS ===================== */
export const gradientPresets = {
  descriptionSection: 'linear-gradient(to bottom, rgba(154, 66, 7, 0.03), rgba(154, 66, 7, 0.01))',
  externalLink: 'linear-gradient(135deg, #9a4207, #b95716)',
  distributionFill: 'linear-gradient(135deg, #9a4207, #b95716)'
};
