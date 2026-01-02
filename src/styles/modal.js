// Shared modal style tokens.
// Use these to style modal overlays and their content.

export const modalStyles = {
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: 'white',
    borderRadius: 12,
    padding: 30,
    maxWidth: 500,
    width: '90%',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '1px solid #eee'
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#392c2c'
  },
  confirmOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }
};

// Usage: import { modalStyles } from '../styles/modal';
// <div style={modalStyles.modal}><div style={modalStyles.modalContent}>...</div></div>
