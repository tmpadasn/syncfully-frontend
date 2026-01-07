/**
 * HomeCarousels.jsx
 *
 * Collection of Home page-specific carousel components:
 * - FriendCard: Single friend activity card with avatar and liked album
 * - FriendCardsCarousel: Carousel wrapper for displaying friends' activities
 * - WorkCarousel: Generic carousel for displaying work collections
 *
 * Extracted from Home.jsx for better code organization and reusability
 */

import { Link } from 'react-router-dom';
import Carousel from './Carousel';
import WorkCard from './WorkCard';

/**
 * FriendCard component - Displays friend's recently liked work
 * Uses .friend-card-home CSS class for consistent Home page styling
 *
 */
const FriendCard = ({ friend }) => (
  <div className="friend-card-home">
    {/* Album cover image with link to work details page */}
    <Link to={`/works/${friend.likedAlbum.workId}`} style={{ flexShrink: 0, textDecoration: 'none', color: 'inherit' }}>
      <WorkCard work={friend.likedAlbum} flat hideInfo coverStyle={{ width: '100%', height: '200px' }} />
    </Link>

    {/* Friend info section: avatar, name, and album title they liked */}
    <div style={{ padding: '12px' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
        <img
          src={friend.avatar}
          style={{ width: 20, height: 20, borderRadius: '50%' }}
        />
        <span style={{ fontWeight: 600, fontSize: 13 }}>{friend.name}</span>
      </div>

      {/* Album title text - clamped to 2 lines to prevent overflow */}
      <div style={{
        fontSize: 12,
        lineHeight: 1.4,
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        liked <strong>{friend.likedAlbum.title}</strong>
      </div>
    </div>
  </div>
);

/**
 * FriendCardsCarousel component - Displays friend activity in a carousel
 * Maps friends array to FriendCard components with loading and empty states
 *
 */
export const FriendCardsCarousel = ({ friends, loading, title = "FRIENDS' FAVOURITES", emptyMessage = "You are not following anyone yet, or they haven't rated any works." }) => (
  <Carousel
    title={title}
    loading={loading}
    emptyMessage={emptyMessage}
    skeletonCount={4}
  >
    {friends.map(f => (
      <div key={f.id} style={{ flexShrink: 0, width: '180px' }}>
        <FriendCard friend={f} />
      </div>
    ))}
  </Carousel>
);

/**
 * WorkCarousel component - Reusable carousel for displaying work collections
 * Generic wrapper used for all work carousels (popular, recent movies, recent music, etc.)
 * Standardizes layout, styling, and linking across all usage
 *
 * @param {Object} props - Component props
 * @param {String} props.title - Carousel title to display
 * @param {Array} props.items - Array of work objects to display
 * @param {Boolean} props.loading - Loading state (shows skeleton)
 * @param {String} props.emptyMessage - Message when items array is empty
 * @param {String} props.variant - CSS variant for styling (e.g., 'popular', 'recent')
 * @returns {React.ReactNode} Carousel component with work cards
 */
export const WorkCarousel = ({ title, items, loading, emptyMessage, variant }) => (
  <Carousel
    title={title}
    loading={loading}
    emptyMessage={emptyMessage}
    variant={variant}
  >
    {/* Map each work to a card with link to work details page */}
    {items.map(w => (
      <div
        key={w.workId}
        className={`home-card ${variant}`}
        style={{ flexShrink: 0, width: '180px' }}
      >
        <Link to={`/works/${w.workId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <WorkCard work={w} flat hideInfo coverStyle={{ width: '180px', height: '260px' }} />
        </Link>
      </div>
    ))}
  </Carousel>
);
