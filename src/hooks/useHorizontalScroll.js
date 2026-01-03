
// Provides a ref and simple helpers to make horizontal carousels work.
// Call it in a carousel component. Attach `scrollContainerRef` to the scroll element.
import { useCallback, useEffect, useRef, useState } from 'react';

export default function useHorizontalScroll({ scrollChunk = 3, cardWidth = 180, gap = 16, deps = [] } = {}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollPosition = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  useEffect(() => {
    checkScrollPosition();
    const el = scrollContainerRef.current;
    if (!el) return undefined;

    el.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      el.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  // deps controls when to re-run (e.g. children length)
  }, [checkScrollPosition, ...deps]);

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
