/**
 * Custom hooks for AddToShelfBtn component
 * Separates state management and accessibility logic for better testability and reusability
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useAddToShelfState Hook
 * Manages modal state, messages, shelves list, and handlers
 */
export function useAddToShelfState(initialShelves = []) {
  // Modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Loading and messaging
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Available shelves
  const [availableShelves, setAvailableShelves] = useState(initialShelves);

  // Update shelves when initial shelves change
  useEffect(() => {
    setAvailableShelves(initialShelves);
  }, [initialShelves]);

  // Handle adding work to specific shelf
  const handleAddToShelf = useCallback((shelfId) => {
    // Show success message to user (auto-hides after timeout in component)
    setMessage({
      type: 'success',
      text: 'Work added to shelf!'
    });

    // This provides immediate visual feedback to user
    setAvailableShelves(prevShelves =>
      prevShelves.map(shelf =>
        // If this is the shelf user added to, add empty work object to increment count
        shelf.shelfId === shelfId
          ? { ...shelf, works: [...(shelf.works || []), {}] }
          : shelf
      )
    );
  }, []);

  // Handle adding work to Favourites shelf
  const handleAddToFavourites = useCallback(() => {
    // Show success message to user
    setMessage({
      type: 'success',
      text: 'Added to Favourites!'
    });

    // Optimistically update UI: increment Favourites shelf work count
    // Find Favourites by checking multiple possible naming conventions
    setAvailableShelves(prevShelves =>
      prevShelves.map(shelf =>
        // Match both 'Favourites' and 'Favorite' naming variants
        shelf.name?.toLowerCase() === 'favourites' || shelf.name?.toLowerCase() === 'favorite'
          ? { ...shelf, works: [...(shelf.works || []), {}] }
          : shelf
      )
    );
  }, []);

  return {
    isModalOpen,
    setIsModalOpen,
    loading,
    setLoading,
    message,
    setMessage,
    availableShelves,
    setAvailableShelves,
    handleAddToShelf,
    handleAddToFavourites,
  };
}

/**
 * useModalAccessibility Hook
 * Handles focus management, keyboard navigation (Escape, Tab trap)
 */
export function useModalAccessibility(isOpen, onClose, triggerButtonRef) {
  // Refs for modal elements - used for focus management and DOM access
  const modalRef = useRef(null);           // Reference to modal container
  const closeButtonRef = useRef(null);     // Reference to close button (first focusable element)
  const firstFocusableRef = useRef(null);  // Reference for keyboard navigation starting point

  /**
   * Focus management effect
   * When modal opens: focus the close button (good UX, clear call-to-action)
   * When modal closes: return focus to trigger button (accessibility best practice)
   */
  useEffect(() => {
    if (isOpen) {
      // Modal opened: Move focus to close button with small delay (ensures DOM is ready)
      setTimeout(() => closeButtonRef.current?.focus(), 0);
    } else if (triggerButtonRef?.current) {
      // Modal closed: Return focus to trigger button for keyboard navigation continuity
      setTimeout(() => triggerButtonRef.current?.focus(), 0);
    }
  }, [isOpen, triggerButtonRef]);

  /**
   * Escape key handler
   * When user presses Escape, close modal (standard UX pattern)
   * Event listener only active when modal is open (isOpen === true)
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        // User pressed Escape key - close modal
        onClose();
      }
    };

    // Add global keydown listener for Escape detection
    document.addEventListener('keydown', handleEscape);
    // Cleanup: Remove listener when modal closes or component unmounts
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  /**
   * Tab focus trap effect
   * Prevents Tab key from escaping the modal (accessibility requirement)
   * Loops focus: Last element Tab wraps to first; first element Shift+Tab wraps to last
   */
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      // Get all focusable elements within modal
      // Includes: buttons, links, inputs, textareas, and elements with tabindex
      const focusableElements = modalRef.current.querySelectorAll(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift+Tab on first element: wrap focus to last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
      // Tab on last element: wrap focus to first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    // Add global keydown listener for Tab key detection
    document.addEventListener('keydown', handleTabKey);
    // Cleanup: Remove listener when modal closes or component unmounts
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen, modalRef]);

  const handleCloseModal = useCallback(() => onClose(), [onClose]);

  return {
    modalRef,
    closeButtonRef,
    firstFocusableRef,
    handleCloseModal,
  };
}
