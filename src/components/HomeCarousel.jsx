import { useMemo } from 'react';
import ErrorBoundary from './ErrorBoundary';
import HorizontalCarousel from './HorizontalCarousel';
import { carouselWrapper, scrollContainer, scrollButton } from '../utils/carouselUI';

const errorFallback = { padding: '20px', background: '#f8d7da', borderRadius: '8px', border: '1px solid #f5c6cb', textAlign: 'center', fontSize: '14px', color: '#721c24' };

export default function HomeCarousel({ children, scrollChunk = 3 }) {
  const childrenDep = useMemo(() => children, [children]);

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
