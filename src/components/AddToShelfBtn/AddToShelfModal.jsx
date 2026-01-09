/**
 * Add to Shelf Modal Content Sub-component
 * Displays shelf options, loading state, and messages
 *
 */

import { FiX } from 'react-icons/fi';
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
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header - Title and close button */}
      {/* Semantic HTML with proper heading hierarchy */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '2px solid #eee',
        }}
      >
        {/* Modal title using h2 with ID for aria-labelledby (accessibility) */}
        <h2
          id="modal-title"
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#392c2c',
          }}
        >
          Add to Shelf
        </h2>
        {/* Close button - X icon to dismiss modal */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            color: '#999',
            padding: '0',
            margin: '0',
            outline: '0',
          }}
          aria-label="Close dialog"
        >
          <FiX size={24} aria-hidden="true" />
        </button>
      </div>

      {/* Status Message (error/success) - with aria-live for screen reader announcement */}
      {/* Only render if there's a message to display */}
      {message && (
        <div
          style={{
            background: message.type === 'error' ? '#ffebee' : '#e8f5e9',
            color: message.type === 'error' ? '#c62828' : '#2e7d32',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '15px',
            fontSize: '14px',
            border: message.type === 'error' ? '1px solid #ef5350' : '1px solid #66bb6a',
          }}
          role="alert"
          aria-live="polite"
        >
          {message.text}
        </div>
      )}

      {/* Loading Indicator */}
      {/* Shown while API call is in progress */}
      {loading && (
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            color: '#666',
          }}
          role="status"
          aria-live="polite"
        >
          Loading...
        </div>
      )}

      {/* Empty State - No shelves available */}
      {/* User has no shelves created yet (but Favourites is always available) */}
      {!loading && regularShelves.length === 0 && !favouritesShelf && (
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            color: '#666',
          }}
          role="status"
        >
          No shelves available
        </div>
      )}

      {/* Main content: list of shelves user can add work to */}
      {!loading && (availableShelves.length > 0 || true) && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
          role="list"
        >
          {/* Favourites Button - Always rendered first for consistent keyboard navigation */}
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
