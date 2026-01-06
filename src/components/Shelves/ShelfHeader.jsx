import { FiChevronDown, FiHeart, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from '../../styles/shelvesModules.module.css';

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
      className={`${styles.shelfHeader} ${isFavourites ? styles.shelfHeaderFavourites : ''}`}
      onClick={onToggle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left section with shelf info */}
      <div className={styles.shelfHeaderLeft}>
        {/* Toggle chevron indicator */}
        <div className={`${styles.shelfChevron} ${isExpanded ? styles.shelfChevronOpen : ''}`}>
          <FiChevronDown size={24} color="#9a4207c8" />
        </div>

        {/* Shelf name, description, and work count */}
        <div className={styles.shelfInfo}>
          <div className={isFavourites ? styles.favouritesShelfName : styles.shelfName}>
            {isFavourites && <FiHeart size={20} style={{ color: '#9a4207', fill: '#9a4207' }} />}
            {shelf.name}
          </div>
          {shelf.description && (
            <div className={styles.shelfDescription}>{shelf.description}</div>
          )}
          <div className={styles.workCount}>
            {shelf.works?.length || 0} work{(shelf.works?.length || 0) !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Action buttons - only show for non-Favourites shelves */}
      {!isFavourites && (
        <div className={styles.shelfActions} onClick={(e) => e.stopPropagation()}>
          {/* Add works button */}
          <button
            className={`${styles.actionButton} ${styles.addButton}`}
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
          >
            <FiPlus size={16} />
            Add
          </button>

          {/* Edit shelf button */}
          <button
            className={`${styles.actionButton} ${styles.editButton}`}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <FiEdit2 size={16} />
            Edit
          </button>

          {/* Delete shelf button */}
          <button
            className={`${styles.actionButton} ${styles.deleteButton}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <FiTrash2 size={16} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
