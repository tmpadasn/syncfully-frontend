import { AddToShelfBtn } from '../index';

/**
 * Right sidebar component for work ratings and shelf management
 * Displays:
 * - Add to shelf button
 * - User rating input (5-star)
 * - Rating success message
 * - Rating distribution histogram
 * - Total rating count
 *
 */

export default function WorkDetailsRatings({
  isGuest,
  workId,
  shelves,
  ratingSubmittedMessage,
  userRatingScore,
  score,
  hoverScore,
  bucketCounts,
  ratings,
  onRatingChange,
  onRatingHover,
  renderDist,
}) {
  return (
    <aside
      style={{
        borderLeft: '1px solid #eee',
        paddingLeft: 16,
        minWidth: 240,
        maxWidth: 380,
      }}
    >
      {/* Add to shelf button - only shown for logged-in users with shelves */}
      {!isGuest && shelves.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <AddToShelfBtn
            workId={parseInt(workId)}
            userShelves={shelves}
          />
        </div>
      )}

      {/* Ratings section header */}
      <div style={{ display: 'inline-block', marginBottom: 16 }}>
        <h3 className="section-title">RATINGS</h3>
      </div>

      {/* User rating input and success message section */}
      <div style={{ marginBottom: 20 }}>
        {/* Success message shown after user submits a rating */}
        {ratingSubmittedMessage && (
          <div
            style={{
              background: '#e8f5e9',
              border: '1px solid #81c784',
              color: '#2e7d32',
              padding: '8px 12px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 12,
              textAlign: 'center',
            }}
          >
            ✓ Rating saved!
          </div>
        )}

        {/* "Your rating" label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
            Your rating
          </h4>
        </div>

        {/* 5-star rating input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginBottom: 16,
            opacity: userRatingScore ? 1 : 0.5,
          }}
        >
          {/* Render 5 star buttons (1-5) */}
          {[1, 2, 3, 4, 5].map((i) => {
            // Determine if star should be filled based on current score and hover
            const filled = i <= (hoverScore || Math.round(score));
            return (
              // Star rating button
              <button
                key={i}
                type="button"
                disabled={isGuest}
                onClick={() => onRatingChange(i)}
                onMouseEnter={() => onRatingHover(i)}
                onMouseLeave={() => onRatingHover(0)}
                aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 4,
                  margin: 0,
                  cursor: isGuest ? 'not-allowed' : 'pointer',
                  fontSize: 24,
                  lineHeight: 1,
                  color: filled ? '#9a4207' : '#888',
                  opacity: isGuest ? 0.4 : 1,
                  transition: 'color 0.2s ease',
                  fontWeight: filled ? 'normal' : 'bold',
                  textShadow: filled ? 'none' : `0 0 1px #666`,
                }}
              >
                {filled ? '★' : '☆'}
              </button>
            );
          })}
          {/* "Rated" badge shown when user has already rated */}
          {userRatingScore && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: '#e8f5e9',
                padding: '4px 8px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
                color: '#2e7d32',
              }}
            >
              <span>✓ Rated</span>
            </div>
          )}
        </div>
      </div>

      {/* Rating distribution histogram section */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: 14, fontWeight: 600 }}>
          Rating Distribution
        </h4>
        {/* Empty state or distribution bars */}
        {ratings.length === 0 ? (
          <p style={{ fontSize: 13, color: '#666', margin: 0 }}>No ratings yet.</p>
        ) : (
          // Render rating distribution histogram
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {bucketCounts.map(renderDist)}
            {/* Total rating count */}
            <div
              style={{
                fontSize: 11,
                color: '#666',
                marginTop: 4,
                textAlign: 'center',
              }}
            >
              {ratings.length} total rating{ratings.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
