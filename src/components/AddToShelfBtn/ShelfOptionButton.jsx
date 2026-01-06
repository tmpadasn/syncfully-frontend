/**
 * Shelf Option Button Sub-component
 * Reusable shelf selection button with hover effects
 */

import { useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import '../../styles/addToShelfStyles.css';

export function ShelfOptionButton({
  shelf,
  isFavourites = false,
  onClick,
  forwardRef,
}) {
  // Track hover state using React state (more reliable than direct DOM manipulation)
  const [isHovered, setIsHovered] = useState(false);

  // Calculate work count for display and accessibility label
  const workCount = shelf.works?.length || 0;
  // Use special label for Favourites, otherwise use shelf name
  const shelfName = isFavourites ? 'Favourites' : (shelf.name || 'Unnamed Shelf');
  // Build descriptive label for screen readers (includes work count)
  const ariaLabel = `Add to ${shelfName} shelf, contains ${workCount} work${workCount !== 1 ? 's' : ''}`;

  return (
    <button
      // Ref for keyboard focus management (optional - used for first focusable)
      ref={forwardRef}
      // Apply CSS class with optional hover class based on hover state
      className={`shelfOption${isHovered ? ' shelfOption:hover' : ''}`}
      // Set hover state to true when mouse enters
      onMouseEnter={() => setIsHovered(true)}
      // Set hover state to false when mouse leaves
      onMouseLeave={() => setIsHovered(false)}
      // Trigger parent handler when shelf selected
      onClick={onClick}
      // Full description for screen readers
      aria-label={ariaLabel}
      // Semantic role for accessibility (list item in shelf options list)
      role="listitem"
    >
      <div className="shelfOptionName">
        {/* Favourites icon - only show for Favourites shelf */}
        {isFavourites && (
          <FiHeart
            size={16}
            // Filled heart icon with brown color (#9a4207)
            style={{ color: '#9a4207', fill: '#9a4207', verticalAlign: 'middle' }}
            // Icon is decorative - already described in text/aria-label
            aria-hidden="true"
          />
        )}
        {/* Shelf name text */}
        {shelfName}
      </div>
      {/* Shelf work count - shows number of works in this shelf */}
      <div className="shelfOptionDesc">
        {workCount} work{workCount !== 1 ? 's' : ''}
      </div>
    </button>
  );
}
