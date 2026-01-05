// React imports
export { useEffect, useState } from 'react';
export { Link, useNavigate } from 'react-router-dom';

// Styles
import '../styles/recommendationModules.css';

// Custom hooks
export { default as useAuth } from '../hooks/useAuth';
export { default as useNavigationWithClearFilters } from '../hooks/useNavigationWithClearFilters';

// API imports
export { getUserRecommendations } from '../api/users';
export { getAllWorks } from '../api/works';

// Components
export { WorkGridSkeleton } from '../components/Skeleton';
export { default as HomeCarousel } from '../components/HomeCarousel';

// Utils
export { default as logger } from '../utils/logger';
export {
  extractWorksFromResponse,
  normalizeWorks,
  shuffleArray,
} from '../utils/normalize';
