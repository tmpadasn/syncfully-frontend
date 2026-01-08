/**
 * Carousel - Complete horizontal carousel with scroll controls and error boundary protection
 * Combines scroll functionality with error handling and memoized children for optimal performance
 * Supports optional custom styling for flexible carousel layouts
 * Can also act as a section carousel with title, loading state, and empty message
 */
import { useMemo } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { WorkGridSkeleton } from './SkeletonCards';
import useHorizontalScroll from '../hooks/useHorizontalScroll';
import { getScrollButtonHandlers } from '../utils/scrollButtonHandlers';

// ========== ERROR FALLBACK: Styled container displayed when carousel rendering fails ==========
const errorFallback = {
  padding: '20px',
  background: '#f8d7da',
  borderRadius: '8px',
  border: '1px solid #f5c6cb',
  textAlign: 'center',
  fontSize: '14px',
  color: '#721c24'
};

// ========== CAROUSEL: Complete carousel with scroll controls and error boundary ==========
// Provides error boundary protection, memoized children, scroll buttons, and configurable behavior
// Supports optional custom styles for wrapper, container, and buttons
// Can optionally include title, loading state, and empty message rendering
export default function Carousel({
  children,
  scrollChunk = 3,
  wrapperStyle,
  containerStyle,
  buttonStyle,
  // Section carousel optional props
  title,
  loading,
  skeletonCount = 6,
  emptyMessage,
  variant = 'default'
}) {
  // If section carousel mode is enabled (title provided), render with title and loading states
  if (title !== undefined) {
    // Default title style - can be overridden by passing custom wrapperStyle
    const defaultTitleStyle = { marginTop: 40 };

    return (
      <>
        <h3 className="section-title" style={defaultTitleStyle}>
          {title}
        </h3>

        {loading && (
          <WorkGridSkeleton
            count={skeletonCount}
            columns="repeat(auto-fill, minmax(180px, 1fr))"
          />
        )}
        {!loading && (!children || (Array.isArray(children) && children.length === 0)) && (
          emptyMessage ? <p>{emptyMessage}</p> : null
        )}
        {!loading && children && (Array.isArray(children) ? children.length > 0 : true) && (
          <CarouselBase
            children={children}
            scrollChunk={scrollChunk}
            wrapperStyle={wrapperStyle}
            containerStyle={containerStyle}
            buttonStyle={buttonStyle}
            variant={variant}
          />
        )}
      </>
    );
  }

  // Regular carousel mode without section styling
  return (
    <CarouselBase
      children={children}
      scrollChunk={scrollChunk}
      wrapperStyle={wrapperStyle}
      containerStyle={containerStyle}
      buttonStyle={buttonStyle}
      variant={variant}
    />
  );
}

// ========== CAROUSEL BASE: Core carousel implementation ==========
function CarouselBase({
  children,
  scrollChunk = 3,
  wrapperStyle,
  containerStyle,
  buttonStyle
}) {
  // Memoize children to prevent unnecessary re-renders and maintain carousel scroll position
  const childrenDep = useMemo(() => children, [children]);

  // Get scroll state and handlers
  const { scrollContainerRef, canScrollLeft, canScrollRight, scrollBy } = useHorizontalScroll({
    scrollChunk,
    deps: [childrenDep]
  });

  // Get button event handlers for accessibility
  const leftHandlers = getScrollButtonHandlers(canScrollLeft);
  const rightHandlers = getScrollButtonHandlers(canScrollRight);

  // Default carousel styles
  const defaultWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };
  // Default container style with horizontal scrolling
  const defaultContainerStyle = {
    display: 'flex',
    gap: 16,
    overflowX: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    padding: '16px 0',
    flex: 1,
    scrollBehavior: 'smooth',
  };
  // Default button style generator
  const defaultButtonStyle = (isEnabled) => ({
    flexShrink: 0,
    background: isEnabled ? 'rgba(70, 40, 20, 0.9)' : 'rgba(70, 40, 20, 0.3)',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    cursor: isEnabled ? 'pointer' : 'not-allowed',
    fontSize: '24px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    boxShadow: isEnabled ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none',
    opacity: isEnabled ? 1 : 0.5,
  });

  // Use custom styles if provided, otherwise use defaults
  // Merge custom styles with defaults to preserve layout
  const finalWrapperStyle = wrapperStyle ? { ...defaultWrapperStyle, ...wrapperStyle } : defaultWrapperStyle;
  const finalContainerStyle = containerStyle ? { ...defaultContainerStyle, ...containerStyle } : defaultContainerStyle;
  const finalButtonStyle = buttonStyle || defaultButtonStyle;

  return (
    <ErrorBoundary fallback={<div style={errorFallback}>Unable to load carousel</div>}>
      <div style={finalWrapperStyle}>
        {/* Left scroll button */}
        <button
          onClick={() => scrollBy('left')}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
          style={finalButtonStyle(canScrollLeft)}
          {...leftHandlers}
        >
          ‹
        </button>

        {/* Scrollable container */}
        <div ref={scrollContainerRef} style={finalContainerStyle}>
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          {children}
        </div>

        {/* Right scroll button */}
        <button
          onClick={() => scrollBy('right')}
          disabled={!canScrollRight}
          aria-label="Scroll right"
          style={finalButtonStyle(canScrollRight)}
          {...rightHandlers}
        >
          ›
        </button>
      </div>
    </ErrorBoundary>
  );
}
