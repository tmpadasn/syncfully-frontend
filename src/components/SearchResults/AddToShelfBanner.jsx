/**
 * AddToShelfBanner: Fixed right-side banner for shelf operations
 * Appears when user clicks "Add to Shelf" from a shelf page
 * Shows which shelf is being added to and provides back/close options
 *
 * Props:
 *   - shelfName: String - name of the target shelf
 *   - onClose: Function - callback when user closes the banner
 *   - onBackToShelves: Function - callback when back button is clicked
 */
import { FiX, FiArrowLeft, FiPlus } from 'react-icons/fi';

export function AddToShelfBanner({
  shelfName,
  onClose,
  onBackToShelves
}) {
  return (
    <div style={{
      position: 'fixed',
      right: 20,
      top: 100,
      width: 320,
      background: '#9a4207',
      padding: '16px',
      zIndex: 1000,
      boxSizing: 'border-box',
      borderRadius: 10,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        color: 'white',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 15,
            fontWeight: '600',
          }}>
            <FiPlus size={18} />
            <span>Adding to shelf</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Shelf Name */}
        <div style={{
          fontSize: 14,
          fontWeight: '500',
          padding: '8px 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          "{shelfName}"
        </div>

        {/* Back Button */}
        <button
          onClick={onBackToShelves}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '10px 14px',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontSize: 14,
            fontWeight: '600',
            transition: 'background 0.2s ease',
            width: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <FiArrowLeft size={18} />
          Back to Shelves
        </button>
      </div>
    </div>
  );
}
