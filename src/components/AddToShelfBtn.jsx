/**
 * Add to Shelf Button Component
 * Main entry point for adding works to user's shelves
 *
 */

import { useRef, useState, useContext } from 'react';
import { FiPlus } from 'react-icons/fi';
import { addWorkToShelf, getOrCreateFavouritesShelf } from '../api/shelves';
import '../styles/addToShelfStyles.css';
import { useAddToShelfState, useModalAccessibility } from '../hooks/useAddToShelfBtn';
import { AddToShelfModal } from './AddToShelfBtn/AddToShelfModal';
import { AuthContext } from '../context/AuthContext';

/**
 * AddToShelfBtn Component
 * Provides button to open modal for adding work to shelves
 *
 * Props:
 * @param {number} workId - ID of the work to add
 * @param {Array} userShelves - List of user's shelves with { shelfId, name, description }
 * @returns {JSX.Element} Button component with modal
 */
export default function AddToShelfBtn({ workId, userShelves = [] }) {
  /**
   * Get current user from AuthContext to access userId
   * Needed for creating/getting Favourites shelf
   */
  const { user } = useContext(AuthContext);

  /**
   * Track button hover state using React state (prevents DOM inconsistencies)
   * This ensures the hover effect works reliably across all renders
   */
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  /**
   * State management using custom hook
   * Destructure all necessary state and handlers from useAddToShelfState
   * - isModalOpen/setIsModalOpen: Control modal visibility
   * - loading/message: Display loading and status feedback
   * - availableShelves: List of shelves to display in modal (synced from props)
   * - handleAddToShelf/handleAddToFavourites: Update local state on success
   */
  const {
    isModalOpen,
    setIsModalOpen,
    loading,
    message,
    availableShelves,
    handleAddToShelf: handleAddToShelfState,
    handleAddToFavourites: handleAddToFavouritesState,
  } = useAddToShelfState(userShelves);

  /**
   * Accessibility hook for keyboard navigation and focus management
   * - buttonRef: Reference to trigger button for focus restoration on close
   * - modalRef: Reference to modal container for focus trap and escape key
   * - closeButtonRef: First focusable element to receive focus when modal opens
   * - firstFocusableRef: Reference for keyboard navigation starting point
   * - handleCloseModal: Handler to properly close modal with cleanup
   */
  const buttonRef = useRef(null);
  const {
    modalRef,
    closeButtonRef,
    firstFocusableRef,
    handleCloseModal,
  } = useModalAccessibility(isModalOpen, () => setIsModalOpen(false), buttonRef);

  /**
   * Handles adding work to a specific shelf
   */
  const addToShelf = async (shelfId) => {
    try {
      // Step 1: Make API call to add work to specific shelf
      await addWorkToShelf(shelfId, workId);
      // Step 2: Update local UI state (work count and success message)
      handleAddToShelfState(shelfId);
      // Step 3: Auto-close modal after brief delay for smooth user experience
      setTimeout(() => setIsModalOpen(false), 800);
    } catch (error) {
      // Log error details for debugging and monitoring
      console.error('Failed to add work to shelf:', error);
      // Step 4: Show error message to user and keep modal open for retry
      const errorMsg = error?.message || 'Failed to add work to shelf';
      console.error('Error details:', errorMsg);
      // Keep modal open to display error to user for retry
    }
  };

  /**
   * Handles adding work to Favourites shelf
   * Special handling: Creates Favourites shelf if user doesn't have one yet
   * Shows error messages if API calls fail
   */
  const addToFavourites = async () => {
    try {
      // Validate user is logged in
      if (!user?.userId && !user?.id) {
        console.error('User not authenticated');
        return;
      }

      const userId = user.userId || user.id;
      // Step 1: Get or create Favourites shelf for user
      const favouritesShelf = await getOrCreateFavouritesShelf(userId, userShelves);
      // Step 2: Verify that we have a valid shelf ID (creation succeeded)
      if (!favouritesShelf?.shelfId) {
        // Error: Shelf ID is missing
        console.error('Favourites shelf ID is missing:', favouritesShelf);
        return;
      }
      // Step 3: Add work to the Favourites shelf
      await addWorkToShelf(favouritesShelf.shelfId, workId);
      // Step 4: Update UI state with success message
      handleAddToFavouritesState();
      // Auto-close modal with brief delay for user feedback
      setTimeout(() => setIsModalOpen(false), 800);
    } catch (error) {
      // Log error for debugging
      console.error('Failed to add to Favourites:', error);
      // Show error message to user
      const errorMsg = error?.message || 'Failed to add to Favourites';
      console.error('Error details:', errorMsg);
      // Keep modal open to display error to user for retry
    }
  };

  return (
    <>
      {/* Add to Shelf Button - Opens modal dialog when clicked */}
      {/* Accessible button with ARIA attributes for screen readers */}
      <button
        ref={buttonRef}
        onClick={() => setIsModalOpen(true)}
        // Apply CSS class with optional hover class based on hover state
        className={`addToShelfBtn${isButtonHovered ? ' addToShelfBtn:hover' : ''}`}
        // Set hover state when mouse enters
        onMouseEnter={() => setIsButtonHovered(true)}
        // Clear hover state when mouse leaves
        onMouseLeave={() => setIsButtonHovered(false)}
        aria-label="Add work to shelf"
        aria-haspopup="dialog"
        title="Add this work to your shelves"
      >
        <FiPlus size={20} aria-hidden="true" />
        <span>Add to Shelf</span>
      </button>
      {/* Modal Backdrop + Content Container */}
      {isModalOpen && (
        <div
          // Full-screen backdrop overlay with semi-transparent background
          // Clicking on backdrop (outside modal) triggers handleCloseModal
          className="modal"
          onClick={handleCloseModal}
          role="presentation"
        >
          {/* Modal content component displaying shelf options */}
          <AddToShelfModal
            // Accessibility: Refs for managing focus and keyboard navigation within modal
            modalRef={modalRef}
            closeButtonRef={closeButtonRef}
            firstFocusableRef={firstFocusableRef}
            loading={loading}
            message={message}
            availableShelves={availableShelves}
            // Event handlers: called when user selects a shelf or Favourites
            onAddToShelf={addToShelf}
            onAddToFavourites={addToFavourites}
            // Handler to close modal (on close button, Escape key, or backdrop click)
            onClose={handleCloseModal}
          />
        </div>
      )}
    </>
  );
}
