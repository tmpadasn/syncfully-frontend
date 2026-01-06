import { useState } from 'react';

/**
 * useShelfState Hook
 *
 * Centralized state management for the Shelves page component.
 * Manages all UI state including:
 * - Shelf expansion state
 * - Loaded works data per shelf
 * - User ratings for works
 * - Modal visibility and form data
 * - Loading and deletion states
 *
 * Returns an object with all state variables and their setters
 */
export function useShelfState() {
  // Track which shelves are expanded (shelfId -> boolean)
  const [expandedShelves, setExpandedShelves] = useState({});

  // Cache loaded works for each shelf (shelfId -> work objects array)
  const [shelfWorks, setShelfWorks] = useState({});

  // Store user ratings by workId for quick lookup
  const [userRatings, setUserRatings] = useState({});

  // Modal visibility state
  const [showModal, setShowModal] = useState(false);

  // Modal mode: 'create' for new shelf, 'edit' for existing shelf
  const [modalMode, setModalMode] = useState('create');

  // Currently editing shelf object (null if creating new)
  const [editingShelf, setEditingShelf] = useState(null);

  // Form data for create/edit shelf: { name, description }
  const [formData, setFormData] = useState({ name: '', description: '' });

  // Loading state during form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Feedback message: { type: 'success' | 'error', text: string }
  const [message, setMessage] = useState(null);

  // Loading state per shelf (shelfId -> boolean) for work fetching
  const [loadingWorks, setLoadingWorks] = useState({});

  // Track which work is marked for removal: { shelfId, workId } or null
  const [removingWork, setRemovingWork] = useState(null);

  // Track which shelf is marked for deletion: { shelfId, shelfName } or null
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  return {
    expandedShelves,
    setExpandedShelves,
    shelfWorks,
    setShelfWorks,
    userRatings,
    setUserRatings,
    showModal,
    setShowModal,
    modalMode,
    setModalMode,
    editingShelf,
    setEditingShelf,
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    message,
    setMessage,
    loadingWorks,
    setLoadingWorks,
    removingWork,
    setRemovingWork,
    deleteConfirmation,
    setDeleteConfirmation,
  };
}
