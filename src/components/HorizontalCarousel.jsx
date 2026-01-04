/* HorizontalCarousel: reusable horizontal scroll container with left/right controls. */
/* Delegates scroll state to `useHorizontalScroll` so callers provide only children and styles. */
import React from 'react';
import useHorizontalScroll from '../hooks/useHorizontalScroll';
import { getScrollButtonHandlers } from '../utils/scrollButtonHandlers';
import { carouselWrapper, scrollContainer, scrollButton, hideScrollbarCSS as sharedHideScrollbar } from '../utils/carouselUI';

/* HorizontalCarousel: provides a reusable horizontal scroll container with left/right controls. */
/* Delegates scroll state to `useHorizontalScroll` so callers supply only children and styles. */
export default function HorizontalCarousel({ children, scrollChunk = 3, wrapperStyle, containerStyle, buttonStyle, deps = [] }) {
  const { scrollContainerRef, canScrollLeft, canScrollRight, scrollBy } = useHorizontalScroll({ scrollChunk, deps });
  const leftHandlers = getScrollButtonHandlers(canScrollLeft);
  const rightHandlers = getScrollButtonHandlers(canScrollRight);
  const hideScrollbarCSS = sharedHideScrollbar;

  return (
    <div style={wrapperStyle || carouselWrapper}>
      <button
        onClick={() => scrollBy('left')}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
        style={(buttonStyle || scrollButton)(canScrollLeft)}
        {...leftHandlers}
      >
        ‹
      </button>

      <div ref={scrollContainerRef} style={containerStyle || scrollContainer}>
        <style>{hideScrollbarCSS}</style>
        {children}
      </div>

      <button
        onClick={() => scrollBy('right')}
        disabled={!canScrollRight}
        aria-label="Scroll right"
        style={(buttonStyle || scrollButton)(canScrollRight)}
        {...rightHandlers}
      >
        ›
      </button>
    </div>
  );
}
