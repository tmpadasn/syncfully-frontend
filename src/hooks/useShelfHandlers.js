import { useCallback } from 'react';

/**
 * useShelfHandlers Hook
 *
 * Encapsulates all event handlers for shelf UI interactions.
 * Provides memoized callbacks for:
 * - Toggling shelf expansion
 * - Opening/closing modals for create/edit operations
 * - Handling form input changes
 * - Managing shelf deletion confirmation
 *
 * All handlers are wrapped with useCallback for performance optimization.
 */
export function useShelfHandlers(state) {
  const {
    setExpandedShelves,
    setShowModal,
    setModalMode,
    setFormData,
    setEditingShelf,
    setDeleteConfirmation,
  } = state;

  /**
   * Toggle shelf expansion and load works if expanding
   * @param {string} shelfId - The shelf to toggle
   * @param {function} loadShelfWorks - Async function to load shelf works
   */
  const toggleShelf = useCallback(
    (shelfId, loadShelfWorks) => {
      if (state.expandedShelves[shelfId]) {
        setExpandedShelves(prev => ({ ...prev, [shelfId]: false }));
      } else {
        loadShelfWorks(shelfId);
        setExpandedShelves(prev => ({ ...prev, [shelfId]: true }));
      }
    },
    [state.expandedShelves, setExpandedShelves]
  );

  /**
   * Open modal in create mode with empty form
   */
  const handleOpenCreateModal = useCallback(() => {
    setModalMode('create');
    setFormData({ name: '', description: '' });
    setEditingShelf(null);
    setShowModal(true);
  }, [setModalMode, setFormData, setEditingShelf, setShowModal]);

  /**
   * Open modal in edit mode with shelf data pre-filled
   * @param {object} shelf - The shelf to edit
   */
  const handleOpenEditModal = useCallback(
    (shelf) => {
      setModalMode('edit');
      setEditingShelf(shelf);
      setFormData({ name: shelf.name, description: shelf.description || '' });
      setShowModal(true);
    },
    [setModalMode, setEditingShelf, setFormData, setShowModal]
  );

  /**
   * Close modal and reset form state
   */
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setFormData({ name: '', description: '' });
    setEditingShelf(null);
  }, [setShowModal, setFormData, setEditingShelf]);

  /**
   * Update form field value
   * @param {string} field - Field name (name or description)
   * @param {string} value - New field value
   */
  const handleFormChange = useCallback(
    (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    [setFormData]
  );

  /**
   * Mark shelf for deletion (opens confirmation dialog)
   * @param {string} shelfId - The shelf to delete
   * @param {string} shelfName - The shelf name (for display)
   */
  const handleDelete = useCallback(
    (shelfId, shelfName) => {
      setDeleteConfirmation({ shelfId, shelfName });
    },
    [setDeleteConfirmation]
  );

  /**
   * Cancel deletion and close confirmation dialog
   */
  const cancelDelete = useCallback(() => {
    setDeleteConfirmation(null);
  }, [setDeleteConfirmation]);

  return {
    toggleShelf,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleFormChange,
    handleDelete,
    cancelDelete,
  };
}
