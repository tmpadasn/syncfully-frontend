/*
  FilterBarStyles — concise, declarative style map for the FilterBar UI.

  Provides a single `styles` object consumed by `FilterBar.jsx` and
  `MenuControl.jsx`. Entries encode layout and visual tokens (container,
  label, menu, grouped options). `labelButton` is a functional entry
  that composes runtime states (selected, disabled, open). The
  `icon` entry enforces fixed dimensions and centering for genre icons.

  Purpose: centralize visual rules so the FilterBar's appearance can be
  adjusted predictably without touching component logic.
*/
const styles = {
  // Outer layout: centers the bar and provides page-level padding
  outer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '12px 0',
    background: 'var(--bg)',
    width: '100%',
    boxSizing: 'border-box'
  },

  // The visual container for the filter controls
  bar: {
    width: '100%',
    maxWidth: '1100px',
    boxSizing: 'border-box',
    margin: '0 auto',
    padding: '12px 20px',
    borderTop: '2px solid #bfaea0',
    borderBottom: '2px solid #bfaea0',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },

  // Internal layout: distributes filter items horizontally
  container: {
    display: 'flex',
    gap: 24,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center'
  },

  loading: { color: '#8a6f5f', fontSize: 14, fontStyle: 'italic' },

  filterItem: { flex: 1, display: 'flex', justifyContent: 'center' },

  menuWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    position: 'relative'
  },

  // Label/button base and dynamic variant
  labelBase: {
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '8px 16px',
    textAlign: 'center',
    letterSpacing: 0.5,
    minWidth: '80px',
    borderRadius: '6px',
    transition: 'all 0.2s ease'
  },

  // Composes runtime states: selected, disabled, open
  labelButton: (isSelected, disabled, open) => ({
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    color: isSelected ? '#d4b895' : '#392c2cff',
    border: isSelected ? '1px solid #d4b895' : '1px solid transparent',
    backgroundColor: open ? '#f5f5f5' : (isSelected ? '#f8f5f0' : 'transparent')
  }),

  // Menu and option visuals
  menu: {
    position: 'absolute',
    top: 44,
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#fff',
    boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
    borderRadius: 8,
    padding: 8,
    zIndex: 40,
    minWidth: 160,
    border: '1px solid #bfaea0',
    maxHeight: '400px',
    overflowY: 'auto'
  },

  option: {
    padding: '8px 12px',
    cursor: 'pointer',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 400,
    textTransform: 'uppercase',
    color: '#392c2cff',
    transition: 'background-color 0.2s ease'
  },

  optionSeparator: { marginBottom: 8, borderBottom: '1px solid #e0e0e0', paddingBottom: 8 },

  groupHeader: {
    padding: '4px 12px',
    fontSize: 11,
    fontWeight: 600,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8
  },

  // When an option includes an icon, this makes a compact row
  groupedOption: { display: 'flex', alignItems: 'center', gap: 8 },

  // Icon wrapper: enforces uniform size and centers the SVG
  icon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
    flexShrink: 0,
    width: '14px',
    height: '14px'
  }
};

export default styles;
