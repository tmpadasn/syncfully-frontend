import { useState } from 'react';

/**
 * useShelfState Hook
 *
 * Centralized state management for the Shelves page component.
 * Organizes UI state into logical groups:
 * - Shelf UI: expansion, loading, and work display
 * - Modal: visibility and form data for creating/editing shelves
 * - User Interactions: ratings, removal confirmations, deletion confirmations
 * - Feedback: messages and submission status
 *
 * @returns {Object} State object with all properties and setters
 */

// ============================================================================
// SHELF DATA STATE
// ============================================================================

/**
 * Initialize shelf UI state (expansion, work loading, work data)
 */
function useShelfUIState() {
  // Track expanded shelves: { shelfId: boolean }
  const [expandedShelves, setExpandedShelves] = useState({});

  // Cache works loaded for each shelf: { shelfId: Work[] }
  const [shelfWorks, setShelfWorks] = useState({});

  // Track loading state per shelf: { shelfId: boolean }
  const [loadingWorks, setLoadingWorks] = useState({});

  return {
    expandedShelves,
    setExpandedShelves,
    shelfWorks,
    setShelfWorks,
    loadingWorks,
    setLoadingWorks,
  };
}

// ============================================================================
// MODAL & FORM STATE
// ============================================================================

/**
 * Initialize modal and form state for creating/editing shelves
 */
function useShelfModalState() {
  // Control modal visibility
  const [showModal, setShowModal] = useState(false);

  // Modal mode: 'create' or 'edit'
  const [modalMode, setModalMode] = useState('create');

  // Current shelf being edited (null if creating new)
  const [editingShelf, setEditingShelf] = useState(null);

  // Form inputs: { name: string, description: string }
  const [formData, setFormData] = useState({ name: '', description: '' });

  return {
    showModal,
    setShowModal,
    modalMode,
    setModalMode,
    editingShelf,
    setEditingShelf,
    formData,
    setFormData,
  };
}

// ============================================================================
// USER INTERACTION STATE
// ============================================================================

/**
 * Initialize state for user interactions (ratings, confirmations, submissions)
 */
function useUserInteractionState() {
  // Store user ratings by workId for quick lookup: { workId: rating }
  const [userRatings, setUserRatings] = useState({});

  // Track work being removed: { shelfId, workId } or null
  const [removingWork, setRemovingWork] = useState(null);

  // Track shelf being deleted: { shelfId, shelfName } or null
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Loading state during form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  return {
    userRatings,
    setUserRatings,
    removingWork,
    setRemovingWork,
    deleteConfirmation,
    setDeleteConfirmation,
    isSubmitting,
    setIsSubmitting,
  };
}

// ============================================================================
// FEEDBACK STATE
// ============================================================================

/**
 * Initialize feedback state for user notifications
 */
function useFeedbackState() {
  // Display message: { type: 'success' | 'error', text: string } or null
  const [message, setMessage] = useState(null);

  return { message, setMessage };
}

// ============================================================================
// COMBINED HOOK
// ============================================================================

/**
 * useShelfState Hook
 *
 * Combines all shelf-related state into a single organized hook
 * Separates state into logical concerns for better maintainability
 */
export function useShelfState() {
  // Initialize state groups
  const shelfUIState = useShelfUIState();
  const modalState = useShelfModalState();
  const interactionState = useUserInteractionState();
  const feedbackState = useFeedbackState();

  // Combine all state into single return object
  return {
    // Shelf UI state
    ...shelfUIState,

    // Modal & Form state
    ...modalState,

    // User interaction state
    ...interactionState,

    // Feedback state
    ...feedbackState,
  };
}
