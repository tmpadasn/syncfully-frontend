/**
 * Add to Shelf Modal Content Sub-component
 * Displays shelf options, loading state, and messages
 *
 * Responsibilities:
 * - Render modal header with close button
 * - Display status messages (error/success) with aria-live regions
 * - Show loading state
 * - Render shelf options using ShelfOptionButton component
 * - Handle Favourites shelf separately for special styling
 */

import { FiX } from 'react-icons/fi';
import '../../styles/addToShelfStyles.css';
import { ShelfOptionButton } from './ShelfOptionButton';

export function AddToShelfModal({
  modalRef,
  closeButtonRef,
  firstFocusableRef,
  loading,
  message,
  availableShelves,
  onAddToShelf,
  onAddToFavourites,
  onClose,
}) {
  // Extract Favourites shelf from shelves list if it exists
  // Check both 'Favourites' and 'Favorite' to handle regional naming variants
  const favouritesShelf = availableShelves.find(
    s => s.name?.toLowerCase() === 'favourites' || s.name?.toLowerCase() === 'favorite'
  );

  // Create list of regular shelves (exclude Favourites for separate rendering)
  // This allows us to render Favourites first, then other shelves in order
  const regularShelves = availableShelves.filter(
    s => s.name?.toLowerCase() !== 'favourites' && s.name?.toLowerCase() !== 'favorite'
  );

  return (
    <div
      ref={modalRef}
      className="modalContent"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header - Title and close button */}
      {/* Semantic HTML with proper heading hierarchy */}
      <div className="modalHeader">
        {/* Modal title using h2 with ID for aria-labelledby (accessibility) */}
        <h2 id="modal-title" className="modalTitle">Add to Shelf</h2>
        {/* Close button - X icon to dismiss modal */}
        <button
          ref={closeButtonRef}
          className="closeButton"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <FiX size={24} aria-hidden="true" />
        </button>
      </div>

      {/* Status Message (error/success) - with aria-live for screen reader announcement */}
      {/* Only render if there's a message to display */}
      {message && (
        <div
          // Use error or success styles based on message type
          className={message.type === 'error' ? 'errorMessage' : 'successMessage'}
          role="alert"
          aria-live="polite"
        >
          {message.text}
        </div>
      )}

      {/* Loading Indicator */}
      {/* Shown while API call is in progress */}
      {loading && (
        <div className="loadingMessage" role="status" aria-live="polite">
          Loading...
        </div>
      )}

      {/* Empty State - No shelves available */}
      {/* User has no shelves created yet (but Favourites is always available) */}
      {!loading && regularShelves.length === 0 && !favouritesShelf && (
        <div className="loadingMessage" role="status">
          No shelves available
        </div>
      )}

      {/* Shelf Options List */}
      {/* Main content: list of shelves user can add work to */}
      {!loading && (availableShelves.length > 0 || true) && (
        <div className="shelfOptions" role="list">
          {/* Favourites Button - Always rendered first for consistent keyboard navigation */}
          {/* Favourites is always available, even if not in the user's shelves list yet */}
          {/* If Favourites shelf exists in list, use that; otherwise create a default one */}
          <ShelfOptionButton
            shelf={favouritesShelf || { name: 'Favourites', works: [] }}
            isFavourites={true}
            onClick={onAddToFavourites}
            // Ref for first focus target in keyboard navigation
            forwardRef={firstFocusableRef}
          />

          {/* Regular Shelves - Rendered after Favourites in order */}
          {/* User can add work to any of these shelves */}
          {regularShelves.map((shelf) => (
            <ShelfOptionButton
              key={shelf.shelfId}
              shelf={shelf}
              isFavourites={false}
              // Pass handler that includes the specific shelf ID
              onClick={() => onAddToShelf(shelf.shelfId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
