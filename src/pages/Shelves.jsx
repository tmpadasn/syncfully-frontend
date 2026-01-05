/*
 Shelves page component.
 Shows the user's shelves.
 Each shelf can expand to show its works.
 Work details load when a shelf opens.
 Supports create, edit, and delete actions.
*/
// Quick note: shelves are user-scoped and editable.
// Keep UI actions optimistic to provide instant feedback.
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useShelves from '../hooks/useShelves';
import { getWork } from '../api/works';
import { getUserRatings } from '../api/users';
import { removeWorkFromShelf } from '../api/shelves';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiChevronDown, FiHeart } from 'react-icons/fi';
import { modalStyles } from '../styles/modal';
import WorkCardCarousel from '../components/WorkCardCarousel';
import { Skeleton } from '../components/Skeleton';
import logger from '../utils/logger';

/* ===================== UI STYLES ===================== */
/* Centralized styling: local `styles` groups visual tokens so
  layout and theme adjustments remain colocated for maintainability. */
// Styles are grouped to make visual tweaks simple and local.
// This reduces the likelihood of cascading layout regressions.
const styles = {

    shelfSection: {
    marginBottom: 24,
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    border: '1px solid #e0e0e0',
    overflow: 'hidden',
  },

  favouritesShelf: {
    marginBottom: 32,
    background: '#fff',
    borderRadius: 18,
    boxShadow: '0 10px 28px rgba(154, 66, 7, 0.18)',
    border: '2px solid #9a4207c8',
    overflow: 'hidden',
  },


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
  addButton: {
    background: '#6b8e23',
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
    borderRadius: 12,
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

/* Shelves page behaviour:
  The page enumerates user shelves and lazily loads shelf contents when a
  shelf is expanded. This pattern reduces initial load cost and binds
  work-level fetching to explicit user intent (expansion).
*/

// UX rationale: shelves load lazily to prioritize first paint and keep
// network usage proportional to user interactions (expand actions).

// Note: remove/add actions are optimistic by design; UI updates immediately
// and network failures roll back state to preserve user intent semantics.

// reuse shared modal styles
styles.modal = modalStyles.modal;
styles.modalContent = modalStyles.modalContent;
styles.modalHeader = modalStyles.modalHeader;
styles.modalTitle = modalStyles.modalTitle;

/* ===================== SHELVES FUNCTION ===================== */
/*
 Shelves page component.
 Manages user's shelves and lazy-loads shelf contents when opened.
*/
export default function Shelves() {
  const { user, isGuest } = useAuth();
  const { shelves, loading, error, createNewShelf, updateExistingShelf, deleteExistingShelf, getOrCreateFavourites } = useShelves(user?.userId);
  const navigate = useNavigate();
  const isMountedRef = useRef(true);
  
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
    if (!loading && !isGuest && shelves.length === 0 && isMountedRef.current) {
      getOrCreateFavourites().catch(() => {
        // Silently fail
      });
    }
  }, [loading, shelves, isGuest, getOrCreateFavourites]);

  // Put Favourites shelf first and remove duplicates
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

  /* Shelves ordering rationale: keep 'Favourites' prominent and
     remove accidental duplicates to present a predictable list. */

  // Load user's ratings once to avoid extra calls
  const loadUserRatings = useCallback(async () => {
    if (!user?.userId || !isMountedRef.current) return;
    
    try {
      const data = await getUserRatings(user.userId);
      if (!isMountedRef.current) return;
      
      // Backend returns an object map of ratings keyed by workId
      const ratingsObject = data?.ratings || data || {};
      setUserRatings(ratingsObject);
    } catch {
      if (isMountedRef.current) {
        setUserRatings({});
      }
    }
  }, [user?.userId]);

    /* Ratings caching: fetch ratings once and store as a map to
      enable O(1) lookups when rendering many work cards. */

  // Cache ratings as a map to allow constant-time lookups in render loops.
  // Reduces re-renders when rendering many work cards on the page.

  useEffect(() => {
    isMountedRef.current = true;
    loadUserRatings();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadUserRatings]);

  // Open shelf. Load works when the shelf is opened.
  const toggleShelf = async (shelfId) => {
    const newState = !expandedShelves[shelfId];
    setExpandedShelves({ ...expandedShelves, [shelfId]: newState });

    // Load works for this shelf if expanded and not already loaded
    if (newState && !shelfWorks[shelfId]) {
      // Bind network load to explicit user interaction to save bandwidth.
      // Keep per-shelf cached results to avoid repeated fetches on toggle.
      setLoadingWorks({ ...loadingWorks, [shelfId]: true });
      try {
        const shelf = shelves.find(s => s.shelfId === shelfId);
        if (shelf && shelf.works && Array.isArray(shelf.works)) {
          const workDetails = await Promise.all(
            shelf.works.map(async (workId) => {
              try {
                const workData = await getWork(workId);
                
                // getWork already handles response extraction, so workData should be the work object directly
                if (!workData) {
                  return {
                    workId: workId,
                    title: `Work #${workId}`,
                    coverUrl: '/album_covers/default.jpg',
                    type: 'unknown',
                    averageRating: 0
                  };
                }

                return {
                  workId: workData.workId || workId,
                  title: workData.title || workData.name || `Work #${workId}`,
                  coverUrl: workData.coverUrl || workData.cover || '/album_covers/default.jpg',
                  type: workData.type,
                  creator: workData.creator || workData.author,
                  year: workData.year || workData.releaseYear,
                  averageRating: workData.averageRating || workData.rating || 0
                };
              } catch (err) {
                logger.error(`Error loading work ${workId}:`, err);
                return {
                  workId: workId,
                  title: `Work #${workId}`,
                  coverUrl: '/album_covers/default.jpg',
                  type: 'unknown',
                  averageRating: 0
                };
              }
            })
          );
          setShelfWorks({ ...shelfWorks, [shelfId]: workDetails });
        }
      } catch (err) {
        logger.error('Error loading shelf works:', err);
      } finally {
        setLoadingWorks({ ...loadingWorks, [shelfId]: false });
      }
    }
  };

    /* Lazy-load rationale: shelf contents are loaded on demand to reduce
      initial page load and bind network requests to explicit user intent. */

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setFormData({ name: '', description: '' });
    setEditingShelf(null);
    setShowModal(true);
  };

    /* Modal control: `modalMode` toggles create/edit semantics while
      `formData` holds transient values until submission. */

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

  /* Deletion flow: deletion is gated by a confirmation UI to prevent
     accidental data loss and to communicate permanence to users. */

  const handleAddWorks = (shelfId, shelfName) => {
    // Navigate to search page with shelf context
    navigate(`/search?addToShelf=${shelfId}&shelfName=${encodeURIComponent(shelfName)}`);
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
    // First click marks for removal.
    // Second click removes the work.
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

    /* Two-step remove pattern: marking then confirming reduces accidental
       removals and gives a clear affordance for undo-like behavior. */

  // RETURN SHELVES PAGE LAYOUT
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
      {loading && (
        <div style={{ padding: '40px 0' }}>
          <div style={{ marginBottom: 30 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Skeleton width="200px" height="24px" />
              <Skeleton width="150px" height="40px" borderRadius="8px" />
            </div>
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ 
              marginBottom: 30, 
              background: '#f9f9f9', 
              borderRadius: 12, 
              border: '1px solid #e0e0e0',
              overflow: 'hidden'
            }}>
              <div style={{ padding: 20, background: '#fff', borderBottom: '1px solid #e0e0e0' }}>
                <Skeleton width="180px" height="20px" style={{ marginBottom: 8 }} />
                <Skeleton width="120px" height="14px" />
              </div>
              <div style={{ padding: 20, background: '#fff' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} width="100%" height="240px" borderRadius="8px" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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

     { /* Render shelves as expandable rows; Favourites are prioritized and duplicates removed. */
      /* Action buttons call stopPropagation so header clicks toggle expansion while actions remain interactive. */}
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

                //  Action buttons are separated from header click handling
                //  stopPropagation ensures header toggles remain independent of actions
                <div style={styles.shelfActions} onClick={(e) => e.stopPropagation()}>
                  {!isFavourites && (
                    <>
                      <button
                        style={{ ...styles.actionButton, ...styles.addButton }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddWorks(shelf.shelfId, shelf.name);
                        }}
                      >
                        <FiPlus size={16} />
                        Add
                      </button>
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
              //  Contents are rendered only when the shelf is expanded to save resources
              //  Carousel input is derived from cached per-shelf work details for stability
              {expandedShelves[shelf.shelfId] && (
                <div style={styles.shelfContent}>
                  {loadingWorks[shelf.shelfId] ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} width="100%" height="240px" borderRadius="8px" />
                      ))}
                    </div>
                  ) : !shelfWorks[shelf.shelfId] || shelfWorks[shelf.shelfId].length === 0 ? (
                    <div style={styles.emptyShelf}>This shelf is empty</div>
                  ) : (
                    <WorkCardCarousel
                      cards={shelfWorks[shelf.shelfId].map(work => {
                        if (!work) return null;
                        const rating = userRatings[work.workId] || userRatings[String(work.workId)];
                        const isMarkedForRemoval = removingWork?.shelfId === shelf.shelfId && removingWork?.workId === work.workId;

                        return {
                          id: `${shelf.shelfId}-${work.workId}`,
                          title: work.title || `Work ${work.workId}`,
                          coverUrl: work.coverUrl,
                          averageRating: work.averageRating || work.rating || 0,
                          userRating: rating?.score || null,
                          ratedAt: rating?.ratedAt || rating?.createdAt || null,
                          metaPrimary: work.creator || work.author || work.artist || 'Unknown Creator',
                          metaSecondary: work.year ? `${work.type || 'Work'} • ${work.year}` : undefined,
                          link: `/works/${work.workId}`,
                          data: {
                            shelfId: shelf.shelfId,
                            workId: work.workId,
                            isMarkedForRemoval
                          }
                        };
                      }).filter(Boolean)}
                      emptyMessage="This shelf is empty"
                      //  Extra card UI handles a two-step removal pattern (mark then confirm)
                      //  Showing controls only on hover reduces visual noise while preserving accessibility
                      renderCardExtras={(card, { isHovered }) => {
                        if (!card?.data) return null;
                        const { shelfId: cardShelfId, workId: cardWorkId, isMarkedForRemoval } = card.data;
                        const showButton = isHovered || isMarkedForRemoval;
                        return (
                          <button
                            style={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              background: isMarkedForRemoval ? '#d4b895' : '#9a4207',
                              color: isMarkedForRemoval ? '#392c2c' : '#fff',
                              border: 'none',
                              borderRadius: 6,
                              padding: isMarkedForRemoval ? '6px 10px' : '4px 6px',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                              opacity: showButton ? 1 : 0,
                              pointerEvents: showButton ? 'auto' : 'none',
                              zIndex: 20
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemoveFromShelf(cardShelfId, cardWorkId);
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = isMarkedForRemoval ? '#c9a679' : '#7a3506';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = isMarkedForRemoval ? '#d4b895' : '#9a4207';
                            }}
                            title={isMarkedForRemoval ? 'Confirm removal' : 'Remove from shelf'}
                          >
                            {isMarkedForRemoval ? '✓ Remove' : <FiX size={14} />}
                          </button>
                        );
                      }}
                      onCardMouseLeave={(card) => {
                        // Reset removal state when mouse leaves the card
                        if (card?.data?.isMarkedForRemoval && removingWork) {
                          setRemovingWork(null);
                        }
                      }}
                    />
                  )}
                </div>
              )}
            </div>
            );
          })}
        </div>
      )}

      {/* Modal dialog: isolates create/edit form from page context.
          Outer overlay closes the modal while inner content stops propagation so form interactions remain contained. */}
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
