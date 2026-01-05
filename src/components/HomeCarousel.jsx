/**
 * HomeCarousel - Reusable horizontal carousel wrapper for displaying scrollable card lists.
 * Provides error boundary protection and configurable scroll behavior with memoized children dependency.
 */
import { useMemo } from 'react';
import ErrorBoundary from './ErrorBoundary';
import HorizontalCarousel from './HorizontalCarousel';
import { carouselWrapper, scrollContainer, scrollButton } from '../utils/carouselUI';

// ========== ERROR FALLBACK: Styled container displayed when carousel rendering fails ==========
const errorFallback = { padding: '20px', background: '#f8d7da', borderRadius: '8px', border: '1px solid #f5c6cb', textAlign: 'center', fontSize: '14px', color: '#721c24' };

// ========== HOME CAROUSEL: Wrapper component providing error boundary and scroll functionality ==========
// Memoizes children dependency to prevent unnecessary re-renders and maintain carousel scroll position
export default function HomeCarousel({ children, scrollChunk = 3 }) {
  // Memoize children to track dependency changes in HorizontalCarousel
  const childrenDep = useMemo(() => children, [children]);

  // Wrap carousel with error boundary to safely handle rendering failures
  return (
    <ErrorBoundary fallback={<div style={errorFallback}>Unable to load carousel</div>}>
      <HorizontalCarousel
        scrollChunk={scrollChunk}
        wrapperStyle={carouselWrapper}
        containerStyle={scrollContainer}
        buttonStyle={scrollButton}
        deps={[childrenDep]}
      >
        {children}
      </HorizontalCarousel>
    </ErrorBoundary>
  );
}
