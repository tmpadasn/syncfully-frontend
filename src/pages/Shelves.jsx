import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useShelves from '../hooks/useShelves';
import { getWork } from '../api/works';
import { getUserRatings } from '../api/users';
import { removeWorkFromShelf } from '../api/shelves';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiChevronDown, FiHeart } from 'react-icons/fi';

const styles = {
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: 20
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '2px solid #9a4207c8'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#392c2c'
  },
  createButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    background: '#9a4207c8',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 'bold'
  },
  shelfSection: {
    marginBottom: 30,
    background: '#f9f9f9',
    borderRadius: 12,
    border: '1px solid #e0e0e0',
    overflow: 'hidden'
  },
  favouritesShelf: {
    marginBottom: 30,
    background: 'linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%)',
    borderRadius: 12,
    border: '2px solid #9a4207c8',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(154, 66, 7, 0.15)'
  },
  shelfHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    background: '#fff',
    borderBottom: '1px solid #e0e0e0',
    cursor: 'pointer',
    transition: 'background 0.2s ease'
  },
  shelfHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  shelfChevron: {
    transition: 'transform 0.3s ease'
  },
  shelfChevronOpen: {
    transform: 'rotate(180deg)'
  },
  shelfInfo: {
    flex: 1
  },
  shelfName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#392c2c',
    marginBottom: 4
  },
  favouritesShelfName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#9a4207',
    marginBottom: 4,
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  shelfDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4
  },
  workCount: {
    fontSize: 12,
    color: '#999'
  },
  shelfActions: {
    display: 'flex',
    gap: 8
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 12px',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },
  editButton: {
    background: '#d4b895',
    color: '#392c2c'
  },
  deleteButton: {
    background: '#9a4207',
    color: 'white'
  },
  shelfContent: {
    padding: 20,
    background: '#fff'
  },
  worksList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 16
  },
  workCard: {
    background: '#9a4207c8',
    borderRadius: 8,
    padding: 12,
    overflow: 'hidden',
    transition: 'transform 0.12s ease, box-shadow 0.12s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    position: 'relative',
    height: '320px',
    display: 'flex',
    flexDirection: 'column'
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    background: '#9a4207',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    padding: '4px 6px',
    fontSize: 12,
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    zIndex: 10,
    minWidth: '24px',
    minHeight: '24px',
    opacity: 0,
    pointerEvents: 'none'
  },
  confirmRemoveButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    background: '#d4b895',
    color: '#392c2c',
    border: 'none',
    borderRadius: 4,
    padding: '6px 12px',
    fontSize: 12,
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    zIndex: 10,
    opacity: 1,
    pointerEvents: 'auto'
  },
  workCardHovered: {
    opacity: 1,
    pointerEvents: 'auto'
  },
  coverImage: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
    borderRadius: 6
  },
  workInfo: {
    marginTop: 8,
    color: '#392c2c',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  ratingText: {
    fontSize: 14,
    marginBottom: 4
  },
  ratingDate: {
    fontSize: 12
  },
  emptyShelf: {
    textAlign: 'center',
    padding: 40,
    color: '#999'
  },
  emptyState: {
    textAlign: 'center',
    padding: 60,
    color: '#666'
  },
  emptyStateText: {
    fontSize: 18,
    marginBottom: 20
  },
  loadingMessage: {
    textAlign: 'center',
    padding: 40,
    color: '#666',
    fontSize: 18
  },
  errorMessage: {
    background: '#ffebee',
    color: '#c62828',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    border: '1px solid #ef5350'
  },
  successMessage: {
    background: '#e8f5e9',
    color: '#2e7d32',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    border: '1px solid #66bb6a'
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
    borderBottom: '1px solid #eee'
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
  formGroup: {
    marginBottom: 20
  },
  label: {
    display: 'block',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#392c2c'
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: 14,
    border: '1px solid #ddd',
    borderRadius: 6,
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    fontSize: 14,
    border: '1px solid #ddd',
    borderRadius: 6,
    boxSizing: 'border-box',
    minHeight: 80,
    fontFamily: 'inherit'
  },
  formButtons: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end',
    marginTop: 24
  },
  cancelButton: {
    padding: '10px 20px',
    background: '#e0e0e0',
    color: '#333',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: '600'
  },
  submitButton: {
    padding: '10px 20px',
    background: '#9a4207c8',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: '600'
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
  },
  confirmDialog: {
    background: 'white',
    borderRadius: 12,
    padding: 24,
    maxWidth: 400,
    width: '90%',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#392c2c',
    marginBottom: 12
  },
  confirmMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 1.5
  },
  confirmButtons: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end'
  },
  confirmCancelButton: {
    padding: '10px 20px',
    background: '#e0e0e0',
    color: '#333',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: '600'
  },
  confirmDeleteButton: {
    padding: '10px 20px',
    background: '#9a4207',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: '600'
  }
};

export default function Shelves() {
  const { user, isGuest } = useAuth();
  const { shelves, loading, error, createNewShelf, updateExistingShelf, deleteExistingShelf, getOrCreateFavourites } = useShelves(user?.userId);
  
  const [expandedShelves, setExpandedShelves] = useState({});
  const [shelfWorks, setShelfWorks] = useState({});
  const [userRatings, setUserRatings] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingShelf, setEditingShelf] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [loadingWorks, setLoadingWorks] = useState({});
  const [removingWork, setRemovingWork] = useState(null); // { shelfId, workId }
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // { shelfId, shelfName }

  // Auto-create Favourites shelf on first load
  useEffect(() => {
    if (!loading && !isGuest && shelves.length === 0) {
      getOrCreateFavourites().catch(() => {
        // Silently fail
      });
    }
  }, [loading, shelves, isGuest, getOrCreateFavourites]);

  // Sort shelves to keep Favourites at the top and remove duplicates
  const sortedShelves = [...shelves]
    .filter((shelf, index, self) => {
      // Remove duplicate Favourites shelves (keep only the first one)
      const isFavourites = shelf.name?.toLowerCase() === 'favourites';
      if (isFavourites) {
        const firstFavIndex = self.findIndex(s => s.name?.toLowerCase() === 'favourites');
        return index === firstFavIndex;
      }
      return true;
    })
    .sort((a, b) => {
      const aIsFavourites = a.name?.toLowerCase() === 'favourites';
      const bIsFavourites = b.name?.toLowerCase() === 'favourites';
      if (aIsFavourites) return -1;
      if (bIsFavourites) return 1;
      return 0;
    });

  // Load user ratings once
  useEffect(() => {
    if (user?.userId) {
      getUserRatings(user.userId)
        .then(data => {
          // Backend returns an object map of ratings keyed by workId
          const ratingsObject = data?.ratings || data || {};
          console.log('User ratings loaded:', ratingsObject);
          setUserRatings(ratingsObject);
        })
        .catch(() => {
          setUserRatings({});
        });
    }
  }, [user?.userId]);

  const toggleShelf = async (shelfId) => {
    const newState = !expandedShelves[shelfId];
    setExpandedShelves({ ...expandedShelves, [shelfId]: newState });

    // Load works for this shelf if expanded and not already loaded
    if (newState && !shelfWorks[shelfId]) {
      setLoadingWorks({ ...loadingWorks, [shelfId]: true });
      try {
        const shelf = shelves.find(s => s.shelfId === shelfId);
        if (shelf && shelf.works && Array.isArray(shelf.works)) {
          const workDetails = await Promise.all(
            shelf.works.map(async (workId) => {
              try {
                const workData = await getWork(workId);
                
                // getWork already handles response extraction, so workData should be the work object directly
                console.log('Loaded work:', { workId, work: workData });

                if (!workData) {
                  return {
                    workId: workId,
                    title: `Work #${workId}`,
                    coverUrl: '/album_covers/default.jpg',
                    type: 'unknown'
                  };
                }

                return {
                  workId: workData.workId || workId,
                  title: workData.title || workData.name || `Work #${workId}`,
                  coverUrl: workData.coverUrl || workData.cover || '/album_covers/default.jpg',
                  type: workData.type,
                  creator: workData.creator || workData.author,
                  year: workData.year || workData.releaseYear
                };
              } catch (err) {
                console.error(`Error loading work ${workId}:`, err);
                return {
                  workId: workId,
                  title: `Work #${workId}`,
                  coverUrl: '/album_covers/default.jpg',
                  type: 'unknown'
                };
              }
            })
          );
          setShelfWorks({ ...shelfWorks, [shelfId]: workDetails });
        }
      } catch (err) {
        console.error('Error loading shelf works:', err);
      } finally {
        setLoadingWorks({ ...loadingWorks, [shelfId]: false });
      }
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setFormData({ name: '', description: '' });
    setEditingShelf(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (shelf) => {
    setModalMode('edit');
    setEditingShelf(shelf);
    setFormData({ name: shelf.name, description: shelf.description || '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ name: '', description: '' });
    setEditingShelf(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      setMessage(null);
      if (modalMode === 'create') {
        await createNewShelf(formData.name, formData.description);
        setMessage({ type: 'success', text: 'Shelf created successfully!' });
      } else {
        await updateExistingShelf(editingShelf.shelfId, formData.name, formData.description);
        setMessage({ type: 'success', text: 'Shelf updated successfully!' });
      }

      setTimeout(() => {
        handleCloseModal();
        setMessage(null);
      }, 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'An error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (shelfId, shelfName) => {
    setDeleteConfirmation({ shelfId, shelfName });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;
    
    try {
      await deleteExistingShelf(deleteConfirmation.shelfId);
      setMessage({ type: 'success', text: 'Shelf deleted successfully!' });
      setDeleteConfirmation(null);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Error deleting shelf' });
      setDeleteConfirmation(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const handleRemoveFromShelf = async (shelfId, workId) => {
    // If this work is already marked for removal, confirm and remove it
    if (removingWork?.shelfId === shelfId && removingWork?.workId === workId) {
      try {
        await removeWorkFromShelf(shelfId, workId);
        
        // Update local state
        setShelfWorks({
          ...shelfWorks,
          [shelfId]: shelfWorks[shelfId].filter(w => w.workId !== workId)
        });
        
        setMessage({ type: 'success', text: 'Work removed from shelf!' });
        setRemovingWork(null);
      } catch (err) {
        setMessage({ type: 'error', text: err.message || 'Error removing work from shelf' });
        setRemovingWork(null);
      }
    } else {
      // First click - mark this work for removal
      setRemovingWork({ shelfId, workId });
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>My Shelves</h1>
        <button style={styles.createButton} onClick={handleOpenCreateModal}>
          <FiPlus size={20} />
          New Shelf
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div style={message.type === 'error' ? styles.errorMessage : styles.successMessage}>
          {message.text}
        </div>
      )}

      {/* Loading state */}
      {loading && <div style={styles.loadingMessage}>Loading your shelves...</div>}

      {/* Error state */}
      {error && !loading && (
        <div style={styles.errorMessage}>
          Error loading shelves: {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && shelves.length === 0 && (
        <div style={styles.emptyState}>
          <p style={styles.emptyStateText}>You don't have any shelves yet</p>
          <button style={styles.createButton} onClick={handleOpenCreateModal}>
            <FiPlus size={20} />
            Create your first shelf
          </button>
        </div>
      )}

      {/* Shelves as expandable rows */}
      {!loading && shelves.length > 0 && (
        <div>
          {sortedShelves.map(shelf => {
            const isFavourites = shelf.name.toLowerCase() === 'favourites';
            return (
            <div key={shelf.shelfId} style={isFavourites ? styles.favouritesShelf : styles.shelfSection}>
              {/* Shelf header - click to expand */}
              <div
                style={styles.shelfHeader}
                onClick={() => toggleShelf(shelf.shelfId)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isFavourites ? '#fff9f0' : '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                }}
              >
                <div style={styles.shelfHeaderLeft}>
                  <div
                    style={{
                      ...styles.shelfChevron,
                      ...(expandedShelves[shelf.shelfId] ? styles.shelfChevronOpen : {})
                    }}
                  >
                    <FiChevronDown size={24} color="#9a4207c8" />
                  </div>
                  <div style={styles.shelfInfo}>
                    <div style={isFavourites ? styles.favouritesShelfName : styles.shelfName}>
                      {isFavourites && <FiHeart size={20} style={{ color: '#9a4207', fill: '#9a4207' }} />}
                      {shelf.name}
                    </div>
                    {shelf.description && (
                      <div style={styles.shelfDescription}>{shelf.description}</div>
                    )}
                    <div style={styles.workCount}>
                      {shelf.works?.length || 0} work{(shelf.works?.length || 0) !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div style={styles.shelfActions} onClick={(e) => e.stopPropagation()}>
                  {!isFavourites && (
                    <>
                      <button
                        style={{ ...styles.actionButton, ...styles.editButton }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(shelf);
                        }}
                      >
                        <FiEdit2 size={16} />
                        Edit
                      </button>
                      <button
                        style={{ ...styles.actionButton, ...styles.deleteButton }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(shelf.shelfId, shelf.name);
                        }}
                      >
                        <FiTrash2 size={16} />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Shelf content - works grid */}
              {expandedShelves[shelf.shelfId] && (
                <div style={styles.shelfContent}>
                  {loadingWorks[shelf.shelfId] ? (
                    <div style={styles.emptyShelf}>Loading works...</div>
                  ) : !shelfWorks[shelf.shelfId] || shelfWorks[shelf.shelfId].length === 0 ? (
                    <div style={styles.emptyShelf}>This shelf is empty</div>
                  ) : (
                    <div style={styles.worksList}>
                      {shelfWorks[shelf.shelfId].map(work => {
                        const r = userRatings[work.workId] || userRatings[String(work.workId)];
                        const isMarkedForRemoval = removingWork?.shelfId === shelf.shelfId && removingWork?.workId === work.workId;
                        return (
                          <div
                            key={work.workId}
                            style={styles.workCard}
                            onMouseEnter={(e) => {
                              if (!isMarkedForRemoval) {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
                                const btn = e.currentTarget.querySelector('button');
                                if (btn) {
                                  btn.style.opacity = '1';
                                  btn.style.pointerEvents = 'auto';
                                }
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'none';
                              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                              
                              // Reset removal state when leaving the work card
                              if (isMarkedForRemoval) {
                                setRemovingWork(null);
                              }
                              
                              const btn = e.currentTarget.querySelector('button');
                              if (btn && !isMarkedForRemoval) {
                                btn.style.opacity = '0';
                                btn.style.pointerEvents = 'none';
                                btn.style.background = '#9a4207'; // Reset to default theme color
                              }
                            }}
                          >
                            {isMarkedForRemoval ? (
                              <button
                                style={styles.confirmRemoveButton}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFromShelf(shelf.shelfId, work.workId);
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#c9a679';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = '#d4b895';
                                }}
                                title="Confirm removal"
                              >
                                ✓ Remove
                              </button>
                            ) : (
                              <button
                                style={styles.removeButton}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFromShelf(shelf.shelfId, work.workId);
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#7a3506';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = '#9a4207';
                                }}
                                title="Remove from shelf"
                              >
                                <FiX size={16} />
                              </button>
                            )}
                            <img
                              src={work.coverUrl}
                              alt={work.title || 'Work cover'}
                              style={styles.coverImage}
                              onError={(e) => {
                                console.log('Image error for work:', work.workId, work.coverUrl);
                                e.target.src = '/album_covers/default.jpg';
                              }}
                            />
                            <div style={styles.workInfo}>
                              <strong 
                                title={work.title}
                                style={{
                                  display: 'block',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  marginBottom: 4
                                }}
                              >
                                {work.title || `Work ${work.workId}`}
                              </strong>
                              {r ? (
                                <>
                                  <div style={styles.ratingText}>Score: {r.score}★</div>
                                  <div style={styles.ratingDate}>
                                    {new Date(r.ratedAt || r.createdAt).toLocaleDateString()}
                                  </div>
                                </>
                              ) : (
                                <div style={styles.ratingText}>Unrated</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={styles.modal} onClick={handleCloseModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {modalMode === 'create' ? 'Create New Shelf' : 'Edit Shelf'}
              </h2>
              <button style={styles.closeButton} onClick={handleCloseModal}>
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Shelf Name *</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="e.g., Favorites, To Read, Wishlist"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  autoFocus
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  style={styles.textarea}
                  placeholder="What is this shelf for?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={styles.formButtons}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : modalMode === 'create' ? 'Create Shelf' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation && (
        <div style={styles.confirmOverlay} onClick={cancelDelete}>
          <div style={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.confirmTitle}>Delete Shelf?</h3>
            <p style={styles.confirmMessage}>
              Are you sure you want to delete "<strong>{deleteConfirmation.shelfName}</strong>"? This action cannot be undone.
            </p>
            <div style={styles.confirmButtons}>
              <button
                style={styles.confirmCancelButton}
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                style={styles.confirmDeleteButton}
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
