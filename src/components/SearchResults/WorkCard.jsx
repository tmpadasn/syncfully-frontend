/**
 * WorkCard: Enhanced work item display for SearchResults
 * Shows work cover, title, rating, and action buttons
 * Supports adding to shelves and marking as favourite
 *
 * Props:
 *   - entity: Work data object with title, coverUrl, rating, etc.
 *   - isInShelf: Boolean - is work already in target shelf
 *   - isFavourited: Boolean - is work in user's favourites
 *   - addToShelfId: String - target shelf ID (if in add mode)
 *   - onAddToShelf: Function - callback when plus/check button clicked
 *   - onAddToFavourites: Function - callback when heart button clicked
 *   - onWorkClick: Function - callback when work is clicked
 *   - ResultHeader: Component - for rendering title/subtitle
 *   - isLast: Boolean - whether this is last item (for divider)
 */
import { FiHeart, FiPlus, FiCheck } from 'react-icons/fi';

export function WorkCard({
  entity,
  isInShelf,
  isProcessingWork,
  isFavourited,
  isFavouriting,
  addToShelfId,
  onAddToShelf,
  onAddToFavourites,
  onWorkClick,
  ResultHeader,
  isLast
}) {

  return (
    <div key={entity.entityId}>
      <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative' }}>
        {/* Heart button for Favourites - always shown */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToFavourites(entity.entityId);
          }}
          disabled={isFavouriting}
          style={{
            position: 'absolute',
            top: 8,
            right: addToShelfId ? 52 : 8,
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: 'none',
            background: isFavourited ? '#d4631f' : '#9a4207c8',
            color: 'white',
            cursor: isFavouriting ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.2s ease',
            zIndex: 10,
            opacity: isFavouriting ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!isFavouriting) {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.background = isFavourited ? '#c4521f' : '#7d3506';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = isFavourited ? '#d4631f' : '#9a4207c8';
          }}
        >
          <FiHeart
            size={16}
            fill={isFavourited ? 'currentColor' : 'none'}
            stroke={isFavourited ? 'white' : 'white'}
            strokeWidth={isFavourited ? '0' : '2'}
            style={{
              transition: 'all 0.2s ease',
              color: 'white'
            }}
          />
        </button>

        {/* Plus button for adding to shelf - only shown when in add mode */}
        {addToShelfId && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToShelf(entity.entityId);
            }}
            disabled={isProcessingWork}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: 'none',
              background: isInShelf ? '#4caf50' : '#9a4207c8',
              color: 'white',
              cursor: isProcessingWork ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              transition: 'all 0.2s ease',
              zIndex: 10,
              opacity: isProcessingWork ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (isProcessingWork) return;
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.background = isInShelf ? '#3d8b40' : '#7d3506';
            }}
            onMouseLeave={(e) => {
              if (isProcessingWork) return;
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = isInShelf ? '#4caf50' : '#9a4207c8';
            }}
          >
            {isInShelf ? <FiCheck size={18} /> : <FiPlus size={18} />}
          </button>
        )}

        {/* Cover Image */}
        <div
          onClick={onWorkClick}
          style={{
            flexShrink: 0,
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{
            width: 96,
            height: 140,
            overflow: 'hidden',
            borderRadius: 4,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f2f2f2'
          }}>
            <img src={entity.coverUrl} alt={entity.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* Work Info */}
        <div style={{ flex: 1, padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <ResultHeader
            title={entity.title}
            subtitle={entity.subtitle}
            meta={`★ ${entity.rating.toFixed(1)}`}
            onClick={onWorkClick}
          />
          <p style={{ margin: 0, color: '#888', fontSize: 13 }}>{entity.meta}</p>
          {entity.description && (
            <p style={{ margin: 0, color: '#555', fontSize: 13, lineHeight: 1.4, marginTop: 4 }}>{entity.description}</p>
          )}
        </div>
      </div>

      {/* Divider */}
      {!isLast && (
        <div style={{
          marginTop: 22,
          borderBottom: '2px solid #9a420776',
          paddingBottom: 6,
          marginBottom: 12
        }} />
      )}
    </div>
  );
}
