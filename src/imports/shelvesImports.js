/**
 * Shelves Imports - Centralized Import File
 *
 * This file serves as a single point of entry for all shelves-related dependencies.
 *
 */

// React core hooks
export { useState, useEffect, useRef, useCallback } from 'react';

// Router hook
export { useNavigate } from 'react-router-dom';

// Custom authentication and shelf management hooks
export { default as useAuth } from '../hooks/useAuth';
export { default as useShelves } from '../hooks/useShelves';

// API functions for data operations
export { getWork } from '../api/works';
export { getUserRatings } from '../api/users';
export { removeWorkFromShelf } from '../api/shelves';

// UI components and icons
export { FiPlus } from 'react-icons/fi';
export { Skeleton } from '../components/SkeletonBase';

// Utilities
export { default as logger } from '../utils/logger';

// Shelf sub-components
export { default as ShelfHeader } from '../components/Shelves/ShelfHeader.jsx';
export { default as ShelfContent } from '../components/Shelves/ShelfContent.jsx';
export { default as ShelfModal } from '../components/Shelves/ShelfModal.jsx';

// Custom hooks for shelf logic
export { useShelfState } from '../hooks/useShelfState';
export { useShelfHandlers } from '../hooks/useShelfHandlers';
export { useLoadShelfWorks } from '../hooks/useLoadShelfWorks';
export { useShelfOperations } from '../hooks/useShelfOperations';
