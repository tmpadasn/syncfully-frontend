/*
 Shelves page component.
 Shows the user's shelves.
 Each shelf can expand to show its works.
 Work details load when a shelf opens.
 Supports create, edit, and delete actions.
*/
import { useEffect, useRef, useCallback, useNavigate, useAuth, useShelves,
        getUserRatings, FiPlus, Skeleton, logger, ShelfHeader, ShelfContent,
        ShelfModal, DeleteConfirmation, styles, useShelfState, useShelfHandlers,
        useLoadShelfWorks, useShelfOperations } from '../imports/shelvesImports';

/**
 * Shelves page component.
 * Manages user's shelves and lazy-loads shelf contents when opened.
 */
export default function Shelves() {
  const { user, isGuest } = useAuth();
  const { shelves, loading, error, createNewShelf, updateExistingShelf,
          deleteExistingShelf, getOrCreateFavourites } = useShelves(user?.userId);
  const navigate = useNavigate();
  const isMountedRef = useRef(true);

  // Use custom state hook
  const state = useShelfState();

  // Auto-create Favourites shelf on first load
  useEffect(() => {
    if (!loading && !isGuest && isMountedRef.current) {
      getOrCreateFavourites().catch(() => {});
    }
  }, [loading, isGuest, getOrCreateFavourites]);

  // Sort shelves to keep Favourites at the top (deduped)
  const sortedShelves = useCallback(() => {
    const isFav = s => s.name?.toLowerCase() === 'favourites';
    const seen = new Set();
    return [...shelves]
      .filter(s => {
        if (isFav(s)) {
          if (seen.has('fav')) return false;
          seen.add('fav');
        }
        return true;
      })
      .sort((a, b) => isFav(b) - isFav(a));
  }, [shelves]);

  // Load shelf works
  const loadShelfWorks = useLoadShelfWorks(shelves, state.shelfWorks, state.setShelfWorks, state.setLoadingWorks);

  // Load user ratings
  useEffect(() => {
    if (!user?.userId) return;
    getUserRatings(user.userId)
      .then(data => {
        const ratings = Array.isArray(data) ? data : (data?.ratings || []);
        const map = {};
        ratings.forEach(r => { if (r?.workId) map[r.workId] = r; });
        state.setUserRatings(map);
      })
      .catch(err => {
        logger.error('Error loading ratings:', err);
        state.setUserRatings({});
      });
  }, [user?.userId]);

  // Use custom handlers and operations hooks
  const handlers = useShelfHandlers(state, shelves);
  const operations = useShelfOperations(state.editingShelf, createNewShelf, updateExistingShelf,
                                        deleteExistingShelf, state.shelfWorks, state.setShelfWorks, state.setMessage,
                                        state.setShowModal, state.setFormData, state.setEditingShelf, state.setDeleteConfirmation,
                                        state.setRemovingWork);

  const handleAddWorks = useCallback(
    (shelfId, shelfName) => {
      navigate(`/search?addToShelf=${shelfId}&shelfName=${encodeURIComponent(shelfName)}`);
    },
    [navigate]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Shelves</h1>
        <button className={styles.createButton} onClick={handlers.handleOpenCreateModal}>
          <FiPlus size={20} /> New Shelf
        </button>
      </div>

      {state.message && (
        <div className={state.message.type === 'error' ? styles.errorMessage : styles.successMessage}>
          {state.message.text}
        </div>
      )}

      {loading && (
        <div style={{ padding: '40px 0' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.shelfSection} style={{ opacity: 0.6 }}>
              <div style={{ padding: 20, background: '#fff', borderBottom: '1px solid #e0e0e0' }}>
                <Skeleton width="180px" height="20px" style={{ marginBottom: 8 }} />
                <Skeleton width="120px" height="14px" />
              </div>
              <div style={{ padding: 20, background: '#fff' }}>
                <div className={styles.workGrid}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} width="100%" height="240px" borderRadius="8px" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <div className={styles.errorMessage}>Error loading shelves: {error}</div>
      )}

      {!loading && shelves.length === 0 && (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateText}>You don't have any shelves yet</p>
          <button className={styles.createButton} onClick={handlers.handleOpenCreateModal}>
            <FiPlus size={20} /> Create your first shelf
          </button>
        </div>
      )}

      {!loading && shelves.length > 0 && (
        <div>
          {sortedShelves().map(shelf => {
            const isFav = shelf.name.toLowerCase() === 'favourites';
            const isExp = state.expandedShelves[shelf.shelfId];
            return (
              <div key={shelf.shelfId} className={isFav ? styles.favouritesShelf : styles.shelfSection}>
                <ShelfHeader shelf={shelf} isExpanded={isExp} isFavourites={isFav}
                              onToggle={() => handlers.toggleShelf(shelf.shelfId, loadShelfWorks)}
                              onAdd={() => handleAddWorks(shelf.shelfId, shelf.name)} onEdit={() => handlers.handleOpenEditModal(shelf)}
                              onDelete={() => handlers.handleDelete(shelf.shelfId, shelf.name)} />
                {isExp && <ShelfContent shelfId={shelf.shelfId} isFavourites={isFav} works={state.shelfWorks[shelf.shelfId]}
                                        userRatings={state.userRatings} isLoading={state.loadingWorks[shelf.shelfId]}
                                        removingWork={state.removingWork}
                                        onRemoveWork={(shelfId, workId) => operations.handleRemoveFromShelf(shelfId, workId, state.removingWork)} />}
              </div>
            );
          })}
        </div>
      )}

      <ShelfModal isOpen={state.showModal} mode={state.modalMode} formData={state.formData} isSubmitting={state.isSubmitting}
                  onClose={handlers.handleCloseModal} onSubmit={(e) => operations.handleSubmit(e, state.modalMode, state.formData)}
                  onChange={handlers.handleFormChange} />

      <DeleteConfirmation isOpen={!!state.deleteConfirmation} shelfName={state.deleteConfirmation?.shelfName}
                          onCancel={handlers.cancelDelete} onConfirm={() => operations.confirmDelete(state.deleteConfirmation)} />
    </div>
  );
}
