/**
 * Add to Shelf Button Component
 * Provides button to open modal for adding work to shelves
 */
import { useRef, useState, useContext } from 'react';
import { FiPlus } from 'react-icons/fi';
import { addWorkToShelf, getOrCreateFavouritesShelf } from '../api';
import { useAddToShelfState, useModalAccessibility } from '../hooks';
import { AddToShelfModal } from './AddToShelfBtn/AddToShelfModal';
import { AuthContext } from '../context/AuthContext';

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
      await addWorkToShelf(shelfId, workId);
      handleAddToShelfState(shelfId);
      setTimeout(() => setIsModalOpen(false), 800);
    } catch (error) {
      console.error('Failed to add work to shelf:', error);
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
      const favouritesShelf = await getOrCreateFavouritesShelf(userId, userShelves);
      if (!favouritesShelf?.shelfId) {
        // Error: Shelf ID is missing
        console.error('Favourites shelf ID is missing:', favouritesShelf);
        return;
      }
      await addWorkToShelf(favouritesShelf.shelfId, workId);
      handleAddToFavouritesState();
      // Auto-close modal with brief delay for user feedback
      setTimeout(() => setIsModalOpen(false), 800);
    } catch (error) {
      console.error('Failed to add to Favourites:', error);
      const errorMsg = error?.message || 'Failed to add to Favourites';
      console.error('Error details:', errorMsg);
      // Keep modal open to display error to user for retry
    }
  };

  return (
    <>
      {/* Add to Shelf Button - Opens modal dialog when clicked */}
      <button
        ref={buttonRef}
        onClick={() => setIsModalOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: isButtonHovered ? '#7d3506a0' : '#9a4207c8',
          color: 'white',
          border: 'none',
          outline: 0,
          outlineOffset: 0,
          boxShadow: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          WebkitAppearance: 'none',
          appearance: 'none',
          WebkitFocusRingColor: 'transparent',
          WebkitTapHighlightColor: 'transparent',
          transform: 'scale(1)',
          transformOrigin: 'center',
        }}
        onMouseEnter={() => setIsButtonHovered(true)}
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
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
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
