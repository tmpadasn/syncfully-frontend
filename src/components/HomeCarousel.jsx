import { useEffect, useRef, useState } from 'react';
import ErrorBoundary from './ErrorBoundary';

/**
 * Generic horizontal carousel/scroller for Home page.
 * Accepts any children and wraps them in a scrollable container with nav buttons.
 */
function HomeCarouselInner({ children, scrollChunk = 3 }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
  }, [children]);

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
        {children}
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

export default function HomeCarousel(props) {
  return (
    <ErrorBoundary
      fallback={
        <div style={{
          padding: '20px',
          background: '#f8d7da',
          borderRadius: '8px',
          border: '1px solid #f5c6cb',
          textAlign: 'center',
          fontSize: '14px',
          color: '#721c24'
        }}>
          Unable to load carousel
        </div>
      }
    >
      <HomeCarouselInner {...props} />
    </ErrorBoundary>
  );
}
