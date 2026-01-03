import React from 'react';
import useHorizontalScroll from '../hooks/useHorizontalScroll';
import { getScrollButtonHandlers } from '../utils/scrollButtonHandlers';
import { carouselWrapper, scrollContainer, scrollButton, hideScrollbarCSS as sharedHideScrollbar } from '../utils/carouselUI';

/* HorizontalCarousel: centralizes horizontal scrolling UI and behavior.
   Keeps markup, scroll buttons, and hide-scrollbar CSS in one place so callers
   only provide children and style tokens. */
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
