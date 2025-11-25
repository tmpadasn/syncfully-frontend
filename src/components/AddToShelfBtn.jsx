import { useState, useEffect } from 'react';
import { FiHeart, FiX } from 'react-icons/fi';
import { addWorkToShelf, getOrCreateFavouritesShelf } from '../api/shelves';

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
    borderBottom: '2px solid #eee'
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#392c2c'
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

/**
 * Component to add a work to a shelf
 * Shows a modal with available shelves
 */
export default function AddToShelfBtn({ workId, userId, shelves, onSuccess }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [availableShelves, setAvailableShelves] = useState([]);

  useEffect(() => {
    if (showModal && shelves) {
      setAvailableShelves(shelves);
    }
  }, [showModal, shelves]);

  const handleAddToShelf = async (shelfId) => {
    setLoading(true);
    setMessage(null);

    try {
      await addWorkToShelf(shelfId, workId);
      setMessage({ type: 'success', text: 'Work added to shelf!' });
      
      setTimeout(() => {
        setShowModal(false);
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
        setShowModal(false);
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
      >
        <FiHeart size={20} />
        Add to Shelf
      </button>

      {showModal && (
        <div style={styles.modal} onClick={() => setShowModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add to Shelf</h2>
              <button style={styles.closeButton} onClick={() => setShowModal(false)}>
                <FiX size={24} />
              </button>
            </div>

            {message && (
              <div style={message.type === 'error' ? styles.errorMessage : styles.successMessage}>
                {message.text}
              </div>
            )}

            {loading && <div style={styles.loadingMessage}>Loading...</div>}

            {!loading && availableShelves.length === 0 && (
              <div style={styles.loadingMessage}>No shelves available</div>
            )}

            {!loading && availableShelves.length > 0 && (
              <div style={styles.shelfOptions}>
                {/* Favourites button - always first */}
                <div
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
                >
                  <div style={styles.shelfOptionName}>
                    <FiHeart size={16} style={{ marginRight: 8, display: 'inline' }} />
                    Add to Favourites
                  </div>
                  <div style={styles.shelfOptionDesc}>Your favorite works collection</div>
                </div>

                {/* Other shelves */}
                {availableShelves.map(shelf => {
                  // Skip the default "Favorite"/"Favourites" shelf - it's handled by "Add to Favourites" button
                  const shelfName = shelf.name?.toLowerCase() || '';
                  if (shelfName === 'favorite' || shelfName === 'favourites') {
                    return null;
                  }
                  
                  return (
                    <div
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
                    >
                      <div style={styles.shelfOptionName}>{shelf.name}</div>
                      <div style={styles.shelfOptionDesc}>
                        {shelf.works?.length || 0} work{(shelf.works?.length || 0) !== 1 ? 's' : ''}
                      </div>
                    </div>
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
