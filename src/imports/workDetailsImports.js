// React & Router
export { useEffect, useState, useCallback, useRef } from 'react';
export { useParams, Link, useNavigate } from 'react-router-dom';

// Components
export { default as WorkCard } from '../components/WorkCard';
export { default as Toast } from '../components/Toast';
export { default as AddToShelfBtn } from '../components/AddToShelfBtn';
export { WorkDetailsSkeleton } from '../components/Skeleton';

// Hooks
export { default as useNavigationWithClearFilters } from '../hooks/useNavigationWithClearFilters';
export { default as useAuth } from '../hooks/useAuth';
export { default as useShelves } from '../hooks/useShelves';

// API & Utils
export { getWork, getWorkRatings, postWorkRating, getSimilarWorks } from '../api/works';
export { getUserRecommendations } from '../api/users';
export { default as logger } from '../utils/logger';
export { extractWorkFromResponse, extractRatingsFromResponse, normalizeWork, normalizeWorks, normalizeGenres } from '../utils/normalize';

// Styles & Constants
export { workDetailsStyles, MAX_RECOMMENDATIONS, RATING_TOAST_TIMEOUT, EXTERNAL_LINK_HOVER_SHADOW, EXTERNAL_LINK_DEFAULT_SHADOW } from '../styles/workDetailsStyles';
