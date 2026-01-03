
// Hook: useHorizontalScroll
// Provides a ref and utilities for horizontal carousels.

// Centralising these concerns reduces duplicated listener and measurement code
// and enables consistent tuning of scroll behaviour via `cardWidth`, `gap`, and `scrollChunk`.
import { useCallback, useEffect, useRef, useState } from 'react';

export default function useHorizontalScroll({ scrollChunk = 3, cardWidth = 180, gap = 16, deps = [] } = {}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Determine whether horizontal overflow exists on either side of the viewport.
  // Uses element metrics to set navigation affordances used by carousel controls.
  const checkScrollPosition = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    // left available when scrolled away from 0
    setCanScrollLeft(scrollLeft > 0);
    // right available when there's hidden overflow on the right
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  // Attach scroll and resize listeners to keep the `canScroll*` state current.
  // The `deps` array signals when callers expect a re-evaluation (for example,
  // when the number of children changes and layout may have shifted).
  useEffect(() => {
    // Run once to initialize state after mount/layout
    checkScrollPosition();
    const el = scrollContainerRef.current;
    if (!el) return undefined;

    el.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      el.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  // `deps` is provided by callers to force a re-evaluation when layout-affecting data changes
  }, [checkScrollPosition, ...deps]);

  // Scroll by a fixed chunk: (cardWidth + gap) * scrollChunk.
  // Using card dimensions and gap yields predictable movement aligned to item widths.
  const scrollBy = useCallback((direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = (cardWidth + gap) * scrollChunk;
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  }, [scrollChunk, cardWidth, gap]);

  return {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollBy,
    checkScrollPosition,
  };
}
