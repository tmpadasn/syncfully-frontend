/**
 * Edit Account Page Styles
 * Centralized inline styles with design tokens for maintainability
 */

// Design Tokens
const COLORS = {
  primary: '#9a4207',
  text: { dark: '#392c2c', label: '#6b5b4f', secondary: '#8b7355', muted: '#9a8371' },
  bg: { gradient: 'linear-gradient(135deg, #faf8f5 0%, #f5f0ea 100%)', card: '#ffffff', input: '#fdfbf8', inputFocus: '#fff', section: '#f8f5f0' },
  border: { light: '#e0d5cc', lighter: '#f0e8dc', section: '#9a420740' },
  success: { border: '#66bb6a', bg: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', text: '#1b5e20' },
  error: { border: '#ef5350', bg: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)', text: '#b71c1c' },
  button: { secondary: '#6b6b6b' },
};

const SPACING = { xs: 6, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, xxxxl: 36 };
const TYPOGRAPHY = { label: { fontSize: 13, fontWeight: 700 }, input: { fontSize: 15 }, button: { fontSize: 16, fontWeight: 800 }, msgBox: { fontSize: 15, fontWeight: 600 }, section: { fontSize: 18, fontWeight: 800 }, title: { fontSize: 36, fontWeight: 900 } };
const RADII = { sm: 6, md: 10, lg: 12, xl: 20, full: '50%' };
const SHADOWS = { card: '0 24px 48px rgba(0,0,0,0.1)', button: '0 4px 12px rgba(0,0,0,0.15)', buttonHover: '0 6px 16px rgba(0, 0, 0, 0.2)', avatar: '0 8px 20px rgba(0,0,0,0.15)', inputFocus: '0 0 0 3px rgba(154, 66, 7, 0.1)' };

// Styles object
export const editAccountStyles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: `${SPACING.xl}px ${SPACING.sm}px`, background: COLORS.bg.gradient },
  cardWrapper: { width: '100%', maxWidth: '600px' },
  card: { width: '100%', background: COLORS.bg.card, padding: `${SPACING.xxxxl}px ${SPACING.xxxl * 2.5}px`, borderRadius: RADII.xl, boxShadow: SHADOWS.card, border: `1px solid rgba(154, 66, 7, 0.1)`, boxSizing: 'border-box' },

  pageTitle: { textAlign: 'center', marginBottom: SPACING.xxxl, ...TYPOGRAPHY.title, color: COLORS.text.dark, letterSpacing: '-0.5px' },
  sectionHeader: { ...TYPOGRAPHY.section, color: COLORS.text.dark, marginBottom: SPACING.xl, marginTop: SPACING.xxxl, paddingBottom: SPACING.md, borderBottom: `2px solid ${COLORS.border.section}`, textTransform: 'uppercase', letterSpacing: 0.8 },

  fieldGroup: { marginBottom: SPACING.xxl },
  label: { display: 'block', ...TYPOGRAPHY.label, marginBottom: SPACING.sm, color: COLORS.text.label, textTransform: 'uppercase', letterSpacing: 0.6 },
  input: { width: '100%', padding: `${SPACING.md + 2}px ${SPACING.lg}px`, borderRadius: RADII.md, border: `2px solid ${COLORS.border.light}`, ...TYPOGRAPHY.input, background: COLORS.bg.input, transition: 'all 0.2s ease', fontFamily: 'inherit', boxSizing: 'border-box' },
  inputFocus: { borderColor: COLORS.primary, background: COLORS.bg.inputFocus, boxShadow: SHADOWS.inputFocus },
  inputPlaceholder: { fontSize: 12, color: COLORS.text.muted, marginTop: SPACING.sm, fontStyle: 'italic' },

  avatarContainer: { textAlign: 'center', marginBottom: SPACING.xxxxl, paddingBottom: SPACING.xxxl, borderBottom: `2px solid ${COLORS.border.lighter}` },
  avatar: { width: 140, height: 140, borderRadius: RADII.full, objectFit: 'cover', border: `5px solid ${COLORS.primary}`, boxShadow: SHADOWS.avatar },
  usernameTag: { marginTop: SPACING.lg, fontSize: 14, color: COLORS.text.secondary, fontWeight: 600 },

  buttonContainer: { marginTop: SPACING.xxxxl },
  // Dynamic factory function for custom button backgrounds
  button: (bg) => ({ width: '100%', padding: `${SPACING.lg}px ${SPACING.xl}px`, borderRadius: RADII.md, border: 'none', cursor: 'pointer', ...TYPOGRAPHY.button, letterSpacing: '.5px', color: '#fff', background: bg, boxShadow: SHADOWS.button, transition: 'all 0.2s ease', boxSizing: 'border-box' }),
  buttonPrimary: { background: COLORS.primary },
  buttonSecondary: { background: COLORS.button.secondary, marginTop: SPACING.md },
  buttonDisabled: { opacity: 0.6 },
  buttonHover: { transform: 'translateY(-2px)', boxShadow: SHADOWS.buttonHover },

  // Dynamic factory for success/error variants
  messageBox: (type) => ({ padding: `${SPACING.lg}px ${SPACING.xl}px`, marginBottom: SPACING.xxl, borderRadius: RADII.lg, ...TYPOGRAPHY.msgBox, display: 'flex', alignItems: 'center', gap: SPACING.md, ...(type === 'success' ? { border: `2px solid ${COLORS.success.border}`, background: COLORS.success.bg, color: COLORS.success.text } : { border: `2px solid ${COLORS.error.border}`, background: COLORS.error.bg, color: COLORS.error.text }) }),
};
