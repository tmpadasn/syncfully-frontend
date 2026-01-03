/* Carousel UI tokens: shared layout and control styles for horizontal carousels. */
export const carouselWrapper = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

/* Scroll button style generator; reflects enabled/disabled affordance. */
export const scrollButton = (isEnabled) => ({
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

export const scrollContainer = {
  display: 'flex',
  gap: 16,
  overflowX: 'auto',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  padding: '16px 0',
  flex: 1,
  scrollBehavior: 'smooth',
};

/* Inline CSS fragment to suppress WebKit scrollbars (applied locally). */
export const hideScrollbarCSS = `
  div::-webkit-scrollbar { display: none; }
`;
