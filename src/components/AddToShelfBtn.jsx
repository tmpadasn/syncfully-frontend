import { useState, useEffect, useRef } from 'react';
import { FiHeart, FiX } from 'react-icons/fi';
import { addWorkToShelf, getOrCreateFavouritesShelf } from '../api/shelves';
import { modalStyles } from '../styles/modal';

/* ===================== UI STYLES ===================== */
const styles = {
  addToShelfBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    background: '#9a4207c8',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  addToShelfBtnHover: {
    background: '#7d3506a0',
    transform: 'scale(1.05)'
  },
  
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: 28,
    cursor: 'pointer',
    color: '#999'
  },
  shelfOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  shelfOption: {
    padding: 12,
    border: '2px solid #ddd',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: 'white'
  },
  shelfOptionHover: {
    borderColor: '#9a4207c8',
    background: '#f9f9f9'
  },
  shelfOptionName: {
    fontWeight: '600',
    color: '#392c2c',
    marginBottom: 4
  },
  shelfOptionDesc: {
    fontSize: 12,
    color: '#666'
  },
  loadingMessage: {
    textAlign: 'center',
    padding: 20,
    color: '#666'
  },
  errorMessage: {
    background: '#ffebee',
    color: '#c62828',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 14,
    border: '1px solid #ef5350'
  },
  successMessage: {
    background: '#e8f5e9',
    color: '#2e7d32',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 14,
    border: '1px solid #66bb6a'
  }
};

// reuse shared modal styles
styles.modal = modalStyles.modal;
styles.modalContent = modalStyles.modalContent;
// preserve original AddToShelfBtn header thickness (was 2px in original file)
styles.modalHeader = { ...modalStyles.modalHeader, borderBottom: '2px solid #eee' };
styles.modalTitle = modalStyles.modalTitle;

/**
 * Component to add a work to a shelf
 * Shows a modal with available shelves
 */
export default function AddToShelfBtn({ workId, userId, shelves, onSuccess }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [availableShelves, setAvailableShelves] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  // Refs for focus management
  const triggerButtonRef = useRef(null);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const firstFocusableRef = useRef(null);

  useEffect(() => {
    if (showModal && shelves) {
      setAvailableShelves(shelves);
      setFocusedIndex(-1);
      
      // Focus the close button when modal opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 0);
    }
  }, [showModal, shelves]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!showModal) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showModal]);

  // Trap focus within modal
  useEffect(() => {
    if (!showModal || !modalRef.current) return;

    const handleTabKey = (e) => {
      const focusableElements = modalRef.current.querySelectorAll(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [showModal]);

  const closeModal = () => {
    setShowModal(false);
    // Return focus to trigger button
    setTimeout(() => {
      triggerButtonRef.current?.focus();
    }, 0);
  };

  const handleAddToShelf = async (shelfId) => {
    setLoading(true);
    setMessage(null);

    try {
      await addWorkToShelf(shelfId, workId);
      setMessage({ type: 'success', text: 'Work added to shelf!' });
      
      setTimeout(() => {
        closeModal();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error adding work to shelf' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavourites = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // Get or create Favourites shelf
      const favourites = await getOrCreateFavouritesShelf(userId, availableShelves);
      await addWorkToShelf(favourites.shelfId, workId);
      
      setMessage({ type: 'success', text: 'Added to Favourites!' });
      
      setTimeout(() => {
        closeModal();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error adding to Favourites' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        ref={triggerButtonRef}
        style={styles.addToShelfBtn}
        onClick={() => setShowModal(true)}
        onMouseEnter={(e) => {
          e.target.style.background = styles.addToShelfBtnHover.background;
          e.target.style.transform = styles.addToShelfBtnHover.transform;
        }}
        onMouseLeave={(e) => {
          e.target.style.background = styles.addToShelfBtn.background;
          e.target.style.transform = 'none';
        }}
        aria-label="Add work to shelf"
        aria-haspopup="dialog"
      >
        <FiHeart size={20} aria-hidden="true" />
        Add to Shelf
      </button>

      {showModal && (
        <div 
          style={styles.modal} 
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            ref={modalRef}
            style={styles.modalContent} 
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <h2 id="modal-title" style={styles.modalTitle}>Add to Shelf</h2>
              <button 
                ref={closeButtonRef}
                style={styles.closeButton} 
                onClick={closeModal}
                aria-label="Close dialog"
              >
                <FiX size={24} aria-hidden="true" />
              </button>
            </div>

            {message && (
              <div 
                style={message.type === 'error' ? styles.errorMessage : styles.successMessage}
                role="alert"
                aria-live="polite"
              >
                {message.text}
              </div>
            )}

            {loading && (
              <div style={styles.loadingMessage} role="status" aria-live="polite">
                Loading...
              </div>
            )}

            {!loading && availableShelves.length === 0 && (
              <div style={styles.loadingMessage} role="status">
                No shelves available
              </div>
            )}

            {!loading && availableShelves.length > 0 && (
              <div style={styles.shelfOptions} role="list">
                {/* Favourites button - always first */}
                {(() => {
                  // Find Favourites shelf to get work count
                  const favouritesShelf = availableShelves.find(
                    shelf => shelf.name?.toLowerCase() === 'favourites' || shelf.name?.toLowerCase() === 'favorite'
                  );
                  const favouritesCount = favouritesShelf?.works?.length || 0;
                  
                  return (
                    <button
                      ref={firstFocusableRef}
                      style={styles.shelfOption}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = styles.shelfOptionHover.borderColor;
                        e.currentTarget.style.background = styles.shelfOptionHover.background;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#ddd';
                        e.currentTarget.style.background = 'white';
                      }}
                      onClick={() => handleAddToFavourites()}
                      aria-label={`Add to Favourites shelf, contains ${favouritesCount} work${favouritesCount !== 1 ? 's' : ''}`}
                      role="listitem"
                    >
                      <div style={styles.shelfOptionName}>
                        <FiHeart size={16} style={{ color: '#9a4207', fill: '#9a4207', verticalAlign: 'middle', marginRight: 6 }} aria-hidden="true" />
                        Favourites
                      </div>
                      <div style={styles.shelfOptionDesc}>
                        {favouritesCount} work{favouritesCount !== 1 ? 's' : ''}
                      </div>
                    </button>
                  );
                })()}

                {/* Other shelves */}
                {availableShelves.map(shelf => {
                  // Skip the default "Favorite"/"Favourites" shelf - it's handled by "Add to Favourites" button
                  const shelfName = shelf.name?.toLowerCase() || '';
                  if (shelfName === 'favorite' || shelfName === 'favourites') {
                    return null;
                  }
                  
                  const workCount = shelf.works?.length || 0;
                  
                  return (
                    <button
                      key={shelf.shelfId}
                      style={styles.shelfOption}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = styles.shelfOptionHover.borderColor;
                        e.currentTarget.style.background = styles.shelfOptionHover.background;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#ddd';
                        e.currentTarget.style.background = 'white';
                      }}
                      onClick={() => handleAddToShelf(shelf.shelfId)}
                      aria-label={`Add to ${shelf.name} shelf, contains ${workCount} work${workCount !== 1 ? 's' : ''}`}
                      role="listitem"
                    >
                      <div style={styles.shelfOptionName}>{shelf.name}</div>
                      <div style={styles.shelfOptionDesc}>
                        {workCount} work{workCount !== 1 ? 's' : ''}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
