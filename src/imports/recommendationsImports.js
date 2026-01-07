// React imports
export { useEffect, useState } from 'react';
export { Link, useNavigate } from 'react-router-dom';

// Custom hooks
export { default as useAuth } from '../hooks/useAuth';
export { default as useNavigationWithClearFilters } from '../hooks/useNavigationWithClearFilters';

// API imports
export { getUserRecommendations } from '../api/users';
export { getAllWorks } from '../api/works';

// Components
export { WorkGridSkeleton } from '../components/SkeletonCards';
export { default as Carousel } from '../components/Carousel';

// Utils
export { default as logger } from '../utils/logger';
export {
  extractWorksFromResponse,
  normalizeWorks,
  shuffleArray,
} from '../utils/normalize';
