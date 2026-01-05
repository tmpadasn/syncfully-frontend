/**
 * Modal Styles
 * Centralized inline styles with design tokens
 */

// Design Tokens
const COLORS = {
  text: { dark: '#392c2c' },
  overlay: 'rgba(0,0,0,0.5)',
  bg: { card: 'white' },
  border: { light: '#eee' },
};

const SPACING = { xs: 15, sm: 20, md: 30 };
const TYPOGRAPHY = { title: { fontSize: 24, fontWeight: 'bold' } };
const RADII = { md: 12 };
const SHADOWS = { modal: '0 4px 20px rgba(0,0,0,0.3)' };

// Styles object
export const modalStyles = {
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: COLORS.overlay,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: COLORS.bg.card,
    borderRadius: RADII.md,
    padding: SPACING.md,
    maxWidth: 500,
    width: '90%',
    boxShadow: SHADOWS.modal,
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.xs,
    borderBottom: `1px solid ${COLORS.border.light}`,
  },
  modalTitle: { ...TYPOGRAPHY.title, color: COLORS.text.dark },
  confirmOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: COLORS.overlay,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
};
