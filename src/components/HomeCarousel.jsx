/* HomeCarousel: generic horizontal carousel encapsulating scroll state and controls. */
import { useMemo } from 'react';
import ErrorBoundary from './ErrorBoundary';
import HorizontalCarousel from './HorizontalCarousel';
import { carouselWrapper, scrollContainer, scrollButton } from '../utils/carouselUI';

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
/* Memoize children and attach horizontal scroll hook to container. */
function HomeCarouselInner({ children, scrollChunk = 3 }) {
  const childrenDep = useMemo(() => children, [children]);

  return (
    <HorizontalCarousel
      scrollChunk={scrollChunk}
      wrapperStyle={styles.carouselWrapper}
      containerStyle={styles.scrollContainer}
      buttonStyle={styles.scrollButton}
      deps={[childrenDep]}
    >
      {children}
    </HorizontalCarousel>
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
