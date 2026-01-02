// Small helpers for carousel scroll button hover effects.
// Use these when rendering previous/next buttons.
export function getScrollButtonHandlers(isEnabled) {
  return {
    onMouseEnter: (e) => {
      if (isEnabled) {
        e.currentTarget.style.background = 'rgba(70, 40, 20, 1)';
        e.currentTarget.style.transform = 'scale(1.1)';
      }
    },
    onMouseLeave: (e) => {
      if (isEnabled) {
        e.currentTarget.style.background = 'rgba(70, 40, 20, 0.9)';
        e.currentTarget.style.transform = 'scale(1)';
      }
    },
  };
}
