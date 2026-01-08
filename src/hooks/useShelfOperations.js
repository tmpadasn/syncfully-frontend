import { useCallback } from 'react';
import { removeWorkFromShelf } from '../imports/shelvesImports';

/**
 * useShelfOperations Hook
 *
 * Encapsulates all shelf CRUD operations (Create, Read, Update, Delete).
 * Handles:
 * - Creating new shelves
 * - Editing existing shelves
 * - Deleting shelves
 * - Removing works from shelves
 *
 * All operations include:
 * - Error handling with user feedback messages
 * - Loading states during submission
 * - Automatic modal closure on success
 * - Optimistic state updates where applicable
 */
export function useShelfOperations(
  editingShelf,
  createNewShelf,
  updateExistingShelf,
  deleteExistingShelf,
  shelfWorks,
  setShelfWorks,
  setMessage,
  setShowModal,
  setFormData,
  setEditingShelf,
  setDeleteConfirmation,
  setRemovingWork
) {
  /**
   * Create or update a shelf based on modal mode
   * Shows success message and closes modal on completion
   * @param {event} e - Form submission event
   * @param {string} modalMode - 'create' or 'edit'
   * @param {object} formData - Form data { name, description }
   */
  const handleSubmit = useCallback(
    async (e, modalMode, formData) => {
      e.preventDefault();
      if (!formData.name.trim()) return;

      try {
        setMessage(null);
        if (modalMode === 'create') {
          // Create new shelf
          await createNewShelf(formData.name, formData.description);
          setMessage({ type: 'success', text: 'Shelf created successfully!' });
        } else {
          // Update existing shelf
          await updateExistingShelf(editingShelf.shelfId, formData.name, formData.description);
          setMessage({ type: 'success', text: 'Shelf updated successfully!' });
        }

        // Auto-close modal after success message
        setTimeout(() => {
          setShowModal(false);
          setFormData({ name: '', description: '' });
          setEditingShelf(null);
          setMessage(null);
        }, 1500);
      } catch (err) {
        setMessage({ type: 'error', text: err.message || 'An error occurred' });
      }
    },
    [
      editingShelf,
      createNewShelf,
      updateExistingShelf,
      setMessage,
      setShowModal,
      setFormData,
      setEditingShelf,
    ]
  );

  /**
   * Confirm and execute shelf deletion
   * Called after user confirms deletion in confirmation dialog
   * @param {object} deleteConfirmation - { shelfId, shelfName }
   */
  const confirmDelete = useCallback(
    async (deleteConfirmation) => {
      if (!deleteConfirmation) return;

      try {
        await deleteExistingShelf(deleteConfirmation.shelfId);
        setMessage({ type: 'success', text: 'Shelf deleted successfully!' });
        // Immediately close the modal, then clear the shelf works cache
        setDeleteConfirmation(null);
        // Also clear the shelf works from cache
        setShelfWorks(prev => {
          const updated = { ...prev };
          delete updated[deleteConfirmation.shelfId];
          return updated;
        });
        // Auto-clear success message after 1.5 seconds
        setTimeout(() => setMessage(null), 1500);
      } catch (err) {
        setMessage({ type: 'error', text: err.message || 'Error deleting shelf' });
        setDeleteConfirmation(null);
      }
    },
    [deleteExistingShelf, setMessage, setDeleteConfirmation, setShelfWorks, shelfWorks]
  );

  /**
   * Remove a work from a shelf with two-step confirmation
   * First click marks work for removal, second click confirms
   * @param {string} shelfId - The shelf ID
   * @param {string} workId - The work ID to remove
   * @param {object} removingWork - Current removal state { shelfId, workId }
   */
  const handleRemoveFromShelf = useCallback(
    async (shelfId, workId, removingWork) => {
      // Confirm: both clicks on same work
      if (removingWork?.shelfId === shelfId && removingWork?.workId === workId) {
        try {
          // Remove work from shelf via API
          await removeWorkFromShelf(shelfId, workId);

          // Update local cache by filtering out removed work
          setShelfWorks(prev => ({
            ...prev,
            [shelfId]: prev[shelfId].filter(w => w.workId !== workId)
          }));

          setMessage({ type: 'success', text: 'Work removed from shelf!' });
          setRemovingWork(null);
        } catch (err) {
          setMessage({ type: 'error', text: err.message || 'Error removing work from shelf' });
          setRemovingWork(null);
        }
      } else {
        // Mark work for removal (first click)
        setRemovingWork({ shelfId, workId });
      }
    },
    [setShelfWorks, setMessage, setRemovingWork]
  );

  return {
    handleSubmit,
    confirmDelete,
    handleRemoveFromShelf,
  };
}
