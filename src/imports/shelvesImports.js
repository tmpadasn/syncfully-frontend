/**
 * Shelves Imports - Centralized Import File
 *
 * This file serves as a single point of entry for all shelves-related dependencies.
 *
 */

// React core hooks
import { useState, useEffect, useRef, useCallback } from 'react';

// Router hook
import { useNavigate } from 'react-router-dom';

// Custom authentication and shelf management hooks
import useAuth from '../hooks/useAuth';
import useShelves from '../hooks/useShelves';

// API functions for data operations
import { getWork } from '../api/works';
import { getUserRatings } from '../api/users';
import { removeWorkFromShelf } from '../api/shelves';

// UI components and icons
import { FiPlus } from 'react-icons/fi';
import { Skeleton } from '../components/SkeletonBase';

// Utilities
import logger from '../utils/logger';

// Shelf sub-components
import ShelfHeader from '../components/Shelves/ShelfHeader.jsx';
import ShelfContent from '../components/Shelves/ShelfContent.jsx';
import ShelfModal from '../components/Shelves/ShelfModal.jsx';

// Custom hooks for shelf logic
import { useShelfState } from '../hooks/useShelfState';
import { useShelfHandlers } from '../hooks/useShelfHandlers';
import { useLoadShelfWorks } from '../hooks/useLoadShelfWorks';
import { useShelfOperations } from '../hooks/useShelfOperations';

export {
  // React hooks
  useState,
  useEffect,
  useRef,
  useCallback,

  // Router
  useNavigate,

  // Custom hooks - core functionality
  useAuth,
  useShelves,

  // Custom hooks - shelf logic (extracted from main component)
  useShelfState,
  useShelfHandlers,
  useLoadShelfWorks,
  useShelfOperations,

  // API functions
  getWork,
  getUserRatings,
  removeWorkFromShelf,

  // UI components
  FiPlus,
  Skeleton,
  ShelfHeader,
  ShelfContent,
  ShelfModal,

  // Utilities
  logger,
};
