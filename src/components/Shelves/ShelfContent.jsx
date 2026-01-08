import { FiX } from 'react-icons/fi';
import Shelf from '../Shelves/Shelf';
import { Skeleton } from '../SkeletonBase';

/**
 * ShelfContent Component
 * Displays the works contained in a shelf using a carousel layout.
 * Handles loading states, empty shelves, and provides remove functionality for works.
 * Shows user ratings for each work if available.
 */
export default function ShelfContent({
  shelfId,        // Current shelf ID
  works,          // Array of work objects to display
  userRatings,    // Map of user ratings by workId
  isLoading,      // Whether works are still loading
  removingWork,   // Object with shelfId and workId if marking work for removal
  onRemoveWork,   // Callback when user clicks remove button on a work
}) {
  // Show loading skeleton while fetching works
  if (isLoading) {
    return (
      <div style={{ padding: '20px', background: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} width="100%" height="240px" borderRadius="8px" />
          ))}
        </div>
      </div>
    );
  }

  // Show empty state if shelf has no works
  if (!works || works.length === 0) {
    return (
      <div style={{ padding: '20px', background: '#fff' }}>
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>This shelf is empty</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', background: '#fff' }}>
      {/* Carousel displaying all works in the shelf */}
      <Shelf
        cards={works.map(work => {
          if (!work) return null;
          const rating = userRatings[work.workId] || userRatings[String(work.workId)];
          const isMarkedForRemoval = removingWork?.shelfId === shelfId && removingWork?.workId === work.workId;

          return {
            id: `${shelfId}-${work.workId}`,
            title: work.title || `Work ${work.workId}`,
            coverUrl: work.coverUrl,
            averageRating: work.averageRating || work.rating || 0,
            userRating: rating?.score || null,
            ratedAt: rating?.ratedAt || rating?.createdAt || null,
            metaPrimary: work.creator || work.author || work.artist || 'Unknown Creator',
            metaSecondary: work.year ? `${work.type || 'Work'} • ${work.year}` : undefined,
            link: `/works/${work.workId}`,
            data: {
              shelfId: shelfId,
              workId: work.workId,
              isMarkedForRemoval
            }
          };
        }).filter(Boolean)}
        emptyMessage="This shelf is empty"
        // Render remove button overlay on card hover
        renderCardExtras={(card, { isHovered }) => {
          if (!card?.data) return null;
          const { shelfId: cardShelfId, workId: cardWorkId, isMarkedForRemoval } = card.data;
          const showButton = isHovered || isMarkedForRemoval;

          // Remove button with two-step confirmation (click to mark, click again to confirm)
          return (
            <button
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: isMarkedForRemoval ? '#d4b895' : '#9a4207',
                color: isMarkedForRemoval ? '#392c2c' : 'white',
                border: 'none',
                borderRadius: '6px',
                padding: isMarkedForRemoval ? '6px 10px' : '4px 6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                zIndex: 20,
                opacity: showButton ? 1 : 0,
                pointerEvents: showButton ? 'auto' : 'none',
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemoveWork(cardShelfId, cardWorkId);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isMarkedForRemoval ? '#c9a679' : '#7a3506';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isMarkedForRemoval ? '#d4b895' : '#9a4207';
              }}
              title={isMarkedForRemoval ? 'Confirm removal' : 'Remove from shelf'}
            >
              {isMarkedForRemoval ? '✓ Remove' : <FiX size={14} />}
            </button>
          );
        }}
        onCardMouseLeave={(card) => {
          // Reset removal state when mouse leaves the card
          if (card?.data?.isMarkedForRemoval && removingWork) {
            // This will be handled by parent component
          }
        }}
      />
    </div>
  );
}
