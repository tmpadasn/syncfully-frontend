/* WorkCardCarousel: carousel for work cards with hover, badges, and rating display */
import { useState } from 'react';
import HorizontalCarousel from './HorizontalCarousel';
import { carouselWrapper, scrollContainer, scrollButton } from '../utils/carouselUI';
import { Link } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

// Design tokens - centralized values for colors, spacing, sizes, and animations
const COLORS = { primary: '#9a4207', dark: '#392c2cff', accent: '#d4b895', muted: 'rgba(57, 44, 44, 0.7)', shadow: 'rgba(0,0,0,0.2)' };
const SPACING = { xs: 2, sm: 4, md: 8, lg: 10, xl: 14, xxl: 20, xxxl: 40, xxxxl: 60 };
const SIZES = { cardWidth: 180, cardHeight: 340, coverHeight: 230, borderRadius: 12 };
const ANIMATION = { scale: 1.02, transY: 8, duration: '0.3s cubic-bezier(0.4, 0, 0.2, 1)', shadowHover: 'rgba(154, 66, 7, 0.4)' };

// Styles
const styles = {
  carouselWrapper,
  scrollButton: (isEnabled) => ({ ...scrollButton(isEnabled), width: '48px', height: '48px', fontSize: '24px' }),
  scrollContainer,
  emptyState: { textAlign: 'center', padding: `${SPACING.xxxl}px ${SPACING.xxl}px`, color: '#666', fontSize: '16px' },
  cardWrapper: { position: 'relative', flexShrink: 0 },
  cardLink: { textDecoration: 'none', flexShrink: 0, display: 'block', position: 'relative' },
  cardContainer: {
    background: '#9a4207c8',
    padding: SPACING.xl,
    borderRadius: SIZES.borderRadius,
    transition: `all ${ANIMATION.duration}`,
    boxShadow: `0 4px 12px ${COLORS.shadow}`,
    height: SIZES.cardHeight, width: SIZES.cardWidth,
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden'
  },
  coverSection: { position: 'relative', borderRadius: 8, overflow: 'hidden', boxShadow: `0 2px 8px ${COLORS.shadow}` },
  coverImage: { width: '100%', height: SIZES.coverHeight, objectFit: 'cover', display: 'block' },
  ratingBadge: {
    position: 'absolute',
    top: SPACING.sm, right: SPACING.sm,
    background: COLORS.dark,
    color: COLORS.accent,
    padding: `${SPACING.xs}px ${SPACING.sm * 2.5}px`,
    borderRadius: 16,
    fontSize: 14, fontWeight: 'bold',
    display: 'flex', alignItems: 'center',
    gap: SPACING.xs
  },
  infoSection: {
    marginTop: SPACING.lg,
    color: COLORS.dark,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cardTitle: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: 15,
    marginBottom: SPACING.sm,
    textShadow: `0 1px 2px ${COLORS.shadow}`
  },
  userRating: { fontSize: 12, color: 'rgba(57, 44, 44, 0.9)', marginBottom: SPACING.xs },
  ratedDate: { fontSize: 11, color: COLORS.muted, marginBottom: SPACING.sm },
  metaPrimary: { fontSize: 12, color: 'rgba(57, 44, 44, 0.9)', marginBottom: SPACING.sm },
  metaSecondary: { fontSize: 11, color: COLORS.muted },
  errorFallback: {
    padding: `${SPACING.xxxl}px ${SPACING.xxl}px`,
    textAlign: 'center', background: '#fff3cd',
    borderRadius: '8px', border: '1px solid #ffc107'
  },
  errorMessage: { color: '#856404', marginBottom: SPACING.xl },
  reloadButton: {
    padding: `${SPACING.sm}px ${SPACING.md * 2}px`,
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

// Helper functions - reusable utilities for card display and interaction
const applyHover = (e, isHover) => {
  if (isHover) {
    e.style.transform = `translateY(-${ANIMATION.transY}px) scale(${ANIMATION.scale})`;
    e.style.boxShadow = `0 12px 24px ${ANIMATION.shadowHover}`;
  } else {
    e.style.transform = 'translateY(0) scale(1)';
    e.style.boxShadow = `0 4px 12px ${COLORS.shadow}`;
  }
};

// Helper: get rating display
const getRatingDisplay = (rating) => typeof rating === 'number' ? rating.toFixed(1) : rating;

// Helper: format date
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

function WorkCardCarouselInner({
  cards = [], emptyMessage = 'No items yet.',
  renderCardExtras, scrollChunk = 3, onCardMouseLeave
}) {
  const [hoveredCardId, setHoveredCardId] = useState(null);

  if (!cards || cards.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <HorizontalCarousel
      scrollChunk={scrollChunk}
      wrapperStyle={styles.carouselWrapper}
      containerStyle={styles.scrollContainer}
      buttonStyle={styles.scrollButton}
      deps={[cards.length]}
    >
      {cards.map((card) => {
        if (!card) return null;
        const Wrapper = card.link ? Link : 'div';
        const wrapperProps = card.link ? { to: card.link } : {};
        const title = card.title || 'Untitled Work';
        const cardId = card.id ?? `${title}-${card.link ?? ''}`;
        const isHovered = hoveredCardId === cardId;
        const extras = renderCardExtras ? renderCardExtras(card, { isHovered }) : card.extras;
        const cursor = card.onCardClick || card.link ? 'pointer' : 'default';

        return (
          <div key={cardId} style={styles.cardWrapper}>
            <Wrapper {...wrapperProps} style={styles.cardLink} onClick={card.onCardClick}>
              <div
                style={{ ...styles.cardContainer, cursor }}
                onMouseEnter={(e) => {
                  applyHover(e.currentTarget, true);
                  setHoveredCardId(cardId);
                }}
                onMouseLeave={(e) => {
                  applyHover(e.currentTarget, false);
                  setHoveredCardId((prev) => (prev === cardId ? null : prev));
                  if (onCardMouseLeave) onCardMouseLeave(card);
                }}
              >
                {extras}
                <div style={styles.coverSection}>
                  <img src={card.coverUrl || '/album_covers/default.jpg'}
                    alt={title} style={styles.coverImage}
                    onError={(e) => { e.target.src = '/album_covers/default.jpg'; }} />
                  {card.averageRating !== undefined && card.averageRating !== null && <div style={styles.ratingBadge}>★ {getRatingDisplay(card.averageRating)}</div>}
                </div>
                <div style={styles.infoSection}>
                  <strong style={styles.cardTitle} title={title}>{title}</strong>
                  {card.userRating !== undefined && <div style={styles.userRating}><strong>Your Rating:</strong> {card.userRating !== null ? `${card.userRating}★` : 'Not rated'}</div>}
                  {card.ratedAt && <div style={styles.ratedDate}><strong>Rated on:</strong> {formatDate(card.ratedAt)}</div>}
                  {card.metaPrimary && <div style={styles.metaPrimary}>{card.metaPrimary}</div>}
                  {card.metaSecondary && <div style={styles.metaSecondary}>{card.metaSecondary}</div>}
                </div>
              </div>
            </Wrapper>
          </div>
        );
      })}
    </HorizontalCarousel>
  );
}

/**
 * Public wrapper with ErrorBoundary to prevent carousel failures from crashing the page.
 */
export default function WorkCardCarousel(props) {
  return (
    <ErrorBoundary fallback={<div style={styles.errorFallback}><p style={styles.errorMessage}>Unable to load carousel</p><button onClick={() => window.location.reload()} style={styles.reloadButton}>Reload</button></div>}>
      <WorkCardCarouselInner {...props} />
    </ErrorBoundary>
  );
}
