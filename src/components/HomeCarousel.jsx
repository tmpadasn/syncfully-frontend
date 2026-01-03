/* HomeCarousel: generic horizontal carousel encapsulating scroll state and controls. */
import { useMemo } from 'react';
import ErrorBoundary from './ErrorBoundary';
import useHorizontalScroll from '../hooks/useHorizontalScroll';
import { getScrollButtonHandlers } from '../utils/scrollButtonHandlers';
import { carouselWrapper, scrollContainer, scrollButton, hideScrollbarCSS as sharedHideScrollbar } from '../utils/carouselUI';

/* ===================== UI STYLES ===================== */
const styles = {
  /* ===================== CAROUSEL WRAPPER ===================== */
  carouselWrapper: carouselWrapper,

  /* ===================== SCROLL BUTTON ===================== */
  scrollButton: scrollButton,

  /* ===================== SCROLL CONTAINER ===================== */
  scrollContainer: scrollContainer,

  /* ===================== ERROR FALLBACK ===================== */
  errorFallback: {
    padding: '20px',
    background: '#f8d7da',
    borderRadius: '8px',
    border: '1px solid #f5c6cb',
    textAlign: 'center',
    fontSize: '14px',
    color: '#721c24',
  },
};

/* ===================== ANIMATIONS ===================== */
const hideScrollbarCSS = sharedHideScrollbar;
/* Memoize children and attach horizontal scroll hook to container. */
function HomeCarouselInner({ children, scrollChunk = 3 }) {
  const childrenDep = useMemo(() => children, [children]);
  const { scrollContainerRef, canScrollLeft, canScrollRight, scrollBy } = useHorizontalScroll({ scrollChunk, deps: [childrenDep] });
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
        {children}
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

/**
 * Public wrapper that adds an ErrorBoundary.
 * Keeps the page resilient if a single carousel fails to render.
 */
export default function HomeCarousel(props) {
  return (
    <ErrorBoundary
      fallback={
        <div style={styles.errorFallback}>
          Unable to load carousel
        </div>
      }
    >
      <HomeCarouselInner {...props} />
    </ErrorBoundary>
  );
}
