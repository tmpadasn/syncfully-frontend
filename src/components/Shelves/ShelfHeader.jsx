import { FiChevronDown, FiHeart, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

/**
 * ShelfHeader Component
 * Displays the header section of a shelf with name, description, and action buttons.
 * Shows a toggle chevron, shelf info, and management buttons (Add, Edit, Delete).
 * Favourites shelves are displayed with a heart icon and cannot be edited/deleted.
 */
export default function ShelfHeader({
  shelf,           // Shelf object with name, description, works
  isExpanded,      // Whether shelf content is currently expanded
  isFavourites,    // Whether this is the Favourites shelf
  onToggle,        // Callback to toggle shelf expansion
  onAdd,           // Callback to add works to shelf
  onEdit,          // Callback to edit shelf
  onDelete,        // Callback to delete shelf
}) {
  // Handle hover effects - change background color on hover
  const handleMouseEnter = (e) => {
    e.currentTarget.style.background = isFavourites ? '#fff9f0' : '#f5f5f5';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.background = '#fff';
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        background: '#fff',
        borderBottom: '1px solid #e0e0e0',
        cursor: 'pointer',
        transition: 'background 0.2s ease',
      }}
      onClick={onToggle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left section with shelf info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        {/* Toggle chevron indicator */}
        <div style={{ transition: 'transform 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <FiChevronDown size={24} color="#9a4207c8" />
        </div>

        {/* Shelf name, description, and work count */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: isFavourites ? '22px' : '20px',
            fontWeight: 'bold',
            color: isFavourites ? '#9a4207' : '#392c2c',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: isFavourites ? '8px' : '0px',
          }}>
            {isFavourites && <FiHeart size={20} style={{ color: '#9a4207', fill: '#9a4207' }} />}
            {shelf.name}
          </div>
          {shelf.description && (
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>{shelf.description}</div>
          )}
          <div style={{ fontSize: '12px', color: '#999' }}>
            {shelf.works?.length || 0} work{(shelf.works?.length || 0) !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Action buttons - show for all shelves */}
      <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
        {/* Add works button */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            background: '#6b8e23',
            color: 'white',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#557a1a'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#6b8e23'}
        >
          <FiPlus size={16} />
          Add
        </button>

        {/* Edit shelf button */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            background: '#d4b895',
            color: '#392c2c',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#c9a679'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#d4b895'}
        >
          <FiEdit2 size={16} />
          Edit
        </button>

        {/* Delete shelf button - only for non-Favourites shelves */}
        {!isFavourites && (
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              background: '#9a4207',
              color: 'white',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#7a3506'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#9a4207'}
          >
            <FiTrash2 size={16} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
