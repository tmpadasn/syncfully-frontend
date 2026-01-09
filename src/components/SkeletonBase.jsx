/**
 * Base Skeleton Component - Animated shimmer loading placeholder
 */

// ========== UTILITY FUNCTIONS ==========

/** Shimmer gradient animation effect */
const getSkeletonGradient = () => ({
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'skeleton-loading 1.5s ease-in-out infinite',
});

/** CSS animation for shimmer effect */
const skeletonKeyframes = `@keyframes skeleton-loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`;

// ========== BASE SKELETON COMPONENT ==========

/**
 * Base skeleton component with animated shimmer gradient
 * @param {string} width - Width of skeleton
 * @param {string} height - Height of skeleton
 * @param {number} borderRadius - Border radius
 * @param {object} style - Additional inline styles
 */
export function Skeleton({ width = '100%', height = '20px', borderRadius = 4, style = {} }) {
  return (
    <div style={{ ...getSkeletonGradient(), width, height, borderRadius, ...style }}>
      <style>{skeletonKeyframes}</style>
    </div>
  );
}

export default Skeleton;
