/* Carousel UI Design System - Organized configuration for horizontal carousels */

// Carousel theme and color constants
const carouselTheme = {
  dark: 'rgba(70, 40, 20, 0.9)',
  darkDisabled: 'rgba(70, 40, 20, 0.3)',
  borderLight: 'rgba(255, 255, 255, 0.2)',
  white: 'white',
};

// Button dimensions and sizing
const buttonDimensions = {
  width: '48px',
  height: '48px',
  fontSize: '24px',
  borderRadius: '50%',
};

// Spacing and gap configuration
const spacing = {
  buttonGap: '12px',
  containerGap: 16,
  padding: '16px 0',
};

// Carousel wrapper component style
export const carouselWrapper = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: spacing.buttonGap,
};

// Scroll button style generator with enabled/disabled states
export const scrollButton = (isEnabled) => ({
  flexShrink: 0,
  background: isEnabled ? carouselTheme.dark : carouselTheme.darkDisabled,
  color: carouselTheme.white,
  border: `2px solid ${carouselTheme.borderLight}`,
  borderRadius: buttonDimensions.borderRadius,
  width: buttonDimensions.width,
  height: buttonDimensions.height,
  cursor: isEnabled ? 'pointer' : 'not-allowed',
  fontSize: buttonDimensions.fontSize,
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  boxShadow: isEnabled ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none',
  opacity: isEnabled ? 1 : 0.5,
});

// Scroll container component style (horizontally scrollable content area)
export const scrollContainer = {
  display: 'flex',
  gap: spacing.containerGap,
  overflowX: 'auto',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  padding: spacing.padding,
  flex: 1,
  scrollBehavior: 'smooth',
};

// Inline CSS fragment to suppress WebKit scrollbars (applied locally)
export const hideScrollbarCSS = `
  div::-webkit-scrollbar { display: none; }
`;
