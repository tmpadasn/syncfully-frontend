import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Generic, reusable horizontal scroller that renders the rich work-card UI
 * used in both Account (rating history) and Shelves pages.
 */
export default function WorkCardCarousel({
  cards = [],
  emptyMessage = 'No items yet.',
  renderCardExtras,
  scrollChunk = 3,
  onCardMouseLeave
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;

    if (!container) return;

    container.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [cards.length]);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 180;
    const gap = 16;
    const scrollAmount = (cardWidth + gap) * scrollChunk;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!cards || cards.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#666',
        fontSize: '16px'
      }}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <button
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
        style={{
          flexShrink: 0,
          background: canScrollLeft ? 'rgba(70, 40, 20, 0.9)' : 'rgba(70, 40, 20, 0.3)',
          color: 'white',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          cursor: canScrollLeft ? 'pointer' : 'not-allowed',
          fontSize: '24px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: canScrollLeft ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none',
          opacity: canScrollLeft ? 1 : 0.5
        }}
        onMouseEnter={(e) => {
          if (canScrollLeft) {
            e.currentTarget.style.background = 'rgba(70, 40, 20, 1)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (canScrollLeft) {
            e.currentTarget.style.background = 'rgba(70, 40, 20, 0.9)';
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}
      >
        ‹
      </button>

      <div
        ref={scrollContainerRef}
        style={{
          display: 'flex',
          gap: 16,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          padding: '16px 0',
          flex: 1,
          scrollBehavior: 'smooth'
        }}
      >
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>
        {cards.map((card) => {
          if (!card) return null;
          const Wrapper = card.link ? Link : 'div';
          const wrapperProps = card.link ? { to: card.link } : {};
          const title = card.title || 'Untitled Work';
          const badge = card.badge;
          const cardId = card.id ?? `${title}-${card.link ?? ''}`;
          const isHovered = hoveredCardId === cardId;
          const extras = renderCardExtras ? renderCardExtras(card, { isHovered }) : card.extras;

          return (
            <div key={cardId} style={{ position: 'relative', flexShrink: 0 }}>
              <Wrapper
                {...wrapperProps}
                style={{ textDecoration: 'none', flexShrink: 0, display: 'block', position: 'relative' }}
                onClick={card.onCardClick}
              >
                <div
                  style={{
                    background: '#9a4207c8',
                    padding: 14,
                    borderRadius: 12,
                    cursor: card.onCardClick || card.link ? 'pointer' : 'default',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                    height: '340px',
                    width: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden'
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
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: 8,
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    <img
                      src={card.coverUrl || '/album_covers/default.jpg'}
                      alt={title}
                      style={{ width: '100%', height: '230px', objectFit: 'cover', display: 'block' }}
                      onError={(e) => {
                        e.target.src = '/album_covers/default.jpg';
                      }}
                    />
                    {badge?.text && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: badge.background || 'rgba(0, 0, 0, 0.8)',
                          color: badge.color || '#ff9f5a',
                          padding: '4px 10px',
                          borderRadius: 16,
                          fontSize: 14,
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2
                        }}
                      >
                        {badge.text}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      color: '#392c2cff',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <strong
                      style={{
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: 15,
                        marginBottom: 4,
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}
                      title={title}
                    >
                      {title}
                    </strong>
                    {card.metaPrimary && (
                      <div style={{ fontSize: 12, color: 'rgba(57, 44, 44, 0.9)', marginBottom: 4 }}>
                        {card.metaPrimary}
                      </div>
                    )}
                    {card.metaSecondary && (
                      <div style={{ fontSize: 11, color: 'rgba(57, 44, 44, 0.7)' }}>
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
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="Scroll right"
        style={{
          flexShrink: 0,
          background: canScrollRight ? 'rgba(70, 40, 20, 0.9)' : 'rgba(70, 40, 20, 0.3)',
          color: 'white',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          cursor: canScrollRight ? 'pointer' : 'not-allowed',
          fontSize: '24px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: canScrollRight ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none',
          opacity: canScrollRight ? 1 : 0.5
        }}
        onMouseEnter={(e) => {
          if (canScrollRight) {
            e.currentTarget.style.background = 'rgba(70, 40, 20, 1)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (canScrollRight) {
            e.currentTarget.style.background = 'rgba(70, 40, 20, 0.9)';
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}
      >
        ›
      </button>
    </div>
  );
}
