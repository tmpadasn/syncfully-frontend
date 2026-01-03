import { useState } from 'react';
import useHorizontalScroll from '../hooks/useHorizontalScroll';
import { getScrollButtonHandlers } from '../utils/scrollButtonHandlers';
import { carouselWrapper, scrollContainer, scrollButton, hideScrollbarCSS as sharedHideScrollbar } from '../utils/carouselUI';
import { Link } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

/* ===================== UI STYLES ===================== */
const styles = {
  /* ===================== CAROUSEL WRAPPER ===================== */
  carouselWrapper: carouselWrapper,

  /* ===================== SCROLL BUTTON ===================== */
  scrollButton: scrollButton,

  /* ===================== SCROLL CONTAINER ===================== */
  scrollContainer: scrollContainer,

  /* ===================== EMPTY STATE ===================== */
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666',
    fontSize: '16px',
  },

  /* ===================== CARD WRAPPER ===================== */
  cardWrapper: {
    position: 'relative',
    flexShrink: 0,
  },

  /* ===================== CARD LINK ===================== */
  cardLink: {
    textDecoration: 'none',
    flexShrink: 0,
    display: 'block',
    position: 'relative',
  },

  /* ===================== CARD CONTAINER ===================== */
  cardContainer: {
    background: '#9a4207c8',
    padding: 14,
    borderRadius: 12,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
    height: '340px',
    width: '180px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },

  /* ===================== COVER IMAGE SECTION ===================== */
  coverSection: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },

  /* ===================== COVER IMAGE ===================== */
  coverImage: {
    width: '100%',
    height: '230px',
    objectFit: 'cover',
    display: 'block',
  },

  /* ===================== AVERAGE RATING BADGE ===================== */
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    background: '#392c2c',
    color: '#d4b895',
    padding: '4px 10px',
    borderRadius: 16,
    fontSize: 14,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },

  /* ===================== CARD INFO SECTION ===================== */
  infoSection: {
    marginTop: 10,
    color: '#392c2cff',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  /* ===================== CARD TITLE ===================== */
  cardTitle: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: 15,
    marginBottom: 4,
    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },

  /* ===================== USER RATING ===================== */
  userRating: {
    fontSize: 12,
    color: 'rgba(57, 44, 44, 0.9)',
    marginBottom: 2,
  },

  /* ===================== RATED DATE ===================== */
  ratedDate: {
    fontSize: 11,
    color: 'rgba(57, 44, 44, 0.7)',
    marginBottom: 4,
  },

  /* ===================== META PRIMARY ===================== */
  metaPrimary: {
    fontSize: 12,
    color: 'rgba(57, 44, 44, 0.9)',
    marginBottom: 4,
  },

  /* ===================== META SECONDARY ===================== */
  metaSecondary: {
    fontSize: 11,
    color: 'rgba(57, 44, 44, 0.7)',
  },

  /* ===================== ERROR FALLBACK ===================== */
  errorFallback: {
    padding: '40px 20px',
    textAlign: 'center',
    background: '#fff3cd',
    borderRadius: '8px',
    border: '1px solid #ffc107',
  },

  /* ===================== ERROR MESSAGE ===================== */
  errorMessage: {
    color: '#856404',
    marginBottom: '12px',
  },

  /* ===================== RELOAD BUTTON ===================== */
  reloadButton: {
    padding: '8px 16px',
    background: '#9a4207',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

/* ===================== ANIMATIONS ===================== */
const hideScrollbarCSS = sharedHideScrollbar;
function WorkCardCarouselInner({
  cards = [],
  emptyMessage = 'No items yet.',
  renderCardExtras,
  scrollChunk = 3,
  onCardMouseLeave
}) {
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const { scrollContainerRef, canScrollLeft, canScrollRight, scrollBy } = useHorizontalScroll({ scrollChunk, deps: [cards.length] });

  if (!cards || cards.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const leftHandlers = getScrollButtonHandlers(canScrollLeft);
  const rightHandlers = getScrollButtonHandlers(canScrollRight);

  return (
    <div style={styles.carouselWrapper}>
      <button
        onClick={() => scrollBy('left')}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
        style={styles.scrollButton(canScrollLeft)}
        {...leftHandlers}
      >
        ‹
      </button>

      <div ref={scrollContainerRef} style={styles.scrollContainer}>
        <style>{hideScrollbarCSS}</style>
        {cards.map((card) => {
          if (!card) return null;
          const Wrapper = card.link ? Link : 'div';
          const wrapperProps = card.link ? { to: card.link } : {};
          const title = card.title || 'Untitled Work';
          const cardId = card.id ?? `${title}-${card.link ?? ''}`;
          const isHovered = hoveredCardId === cardId;
          const extras = renderCardExtras ? renderCardExtras(card, { isHovered }) : card.extras;

          return (
            <div key={cardId} style={styles.cardWrapper}>
              <Wrapper {...wrapperProps} style={styles.cardLink} onClick={card.onCardClick}>
                <div
                  style={{
                    ...styles.cardContainer,
                    cursor: card.onCardClick || card.link ? 'pointer' : 'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(154, 66, 7, 0.4)';
                    setHoveredCardId(cardId);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
                    setHoveredCardId((prev) => (prev === cardId ? null : prev));
                    if (onCardMouseLeave) {
                      onCardMouseLeave(card);
                    }
                  }}
                >
                  {extras}
                  <div style={styles.coverSection}>
                    <img
                      src={card.coverUrl || '/album_covers/default.jpg'}
                      alt={title}
                      style={styles.coverImage}
                      onError={(e) => {
                        e.target.src = '/album_covers/default.jpg';
                      }}
                    />
                    {card.averageRating !== undefined && card.averageRating !== null && (
                      <div style={styles.ratingBadge}>
                        ★ {typeof card.averageRating === 'number' ? card.averageRating.toFixed(1) : card.averageRating}
                      </div>
                    )}
                  </div>
                  <div style={styles.infoSection}>
                    <strong style={styles.cardTitle} title={title}>
                      {title}
                    </strong>
                    {card.userRating !== undefined && (
                      <div style={styles.userRating}>
                        <strong>Your Rating:</strong> {card.userRating !== null ? `${card.userRating}★` : 'Not rated'}
                      </div>
                    )}
                    {card.ratedAt && (
                      <div style={styles.ratedDate}>
                        <strong>Rated on:</strong> {new Date(card.ratedAt).toLocaleDateString()}
                      </div>
                    )}
                    {card.metaPrimary && (
                      <div style={styles.metaPrimary}>
                        {card.metaPrimary}
                      </div>
                    )}
                    {card.metaSecondary && (
                      <div style={styles.metaSecondary}>
                        {card.metaSecondary}
                      </div>
                    )}
                  </div>
                </div>
              </Wrapper>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => scrollBy('right')}
        disabled={!canScrollRight}
        aria-label="Scroll right"
        style={styles.scrollButton(canScrollRight)}
        {...rightHandlers}
      >
        ›
      </button>
    </div>
  );
}

// Wrap with ErrorBoundary to prevent carousel crashes from breaking the entire page
export default function WorkCardCarousel(props) {
  return (
    <ErrorBoundary
      fallback={
        <div style={styles.errorFallback}>
          <p style={styles.errorMessage}>
            Unable to load carousel content
          </p>
          <button
            onClick={() => window.location.reload()}
            style={styles.reloadButton}
          >
            Reload Page
          </button>
        </div>
      }
    >
      <WorkCardCarouselInner {...props} />
    </ErrorBoundary>
  );
}
