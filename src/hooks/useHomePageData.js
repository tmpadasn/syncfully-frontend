/**
 * useHomePageData.js
 *
 * Custom React hook for managing Home page state and data loading
 * Centralizes all API calls, state management, and data processing logic
 *
 * Handles:
 * - Popular works carousel data
 * - Following users' activity/liked albums
 * - Random recent movies and music selections
 * - Loading states for each section
 * - Welcome message on first login
 * - Mounted ref to prevent memory leaks
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { getPopularWorks, getAllWorks } from '../api/works';
import { getUserFollowing } from '../api/users';
import { testConnection } from '../api/client';
import { processPopularWorks, processFollowingData, getRandomWorks } from '../utils/homePageUtils';
import { WORK_TYPES, HOME_CAROUSEL_LIMIT, STORAGE_KEY_JUST_LOGGED_IN } from '../config/constants';
import logger from '../utils/logger';

/**
 * Hook: useHomePageData
 *
 * Manages all Home page data loading and state
 * Prevents state updates after unmount using isMountedRef
 */
export const useHomePageData = (currentUserId) => {
  const isMountedRef = useRef(true);

  const [popular, setPopular] = useState([]);
  const [following, setFollowing] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [recentMusic, setRecentMusic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingLoading, setFollowingLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  // Effect 1: Check if user just logged in and show welcome message
  // Reads STORAGE_KEY_JUST_LOGGED_IN from sessionStorage (set by login flow)
  // Clears flag after reading to avoid showing welcome on page refresh
  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY_JUST_LOGGED_IN) === 'true') {
      setShowWelcome(true);
      sessionStorage.removeItem(STORAGE_KEY_JUST_LOGGED_IN);
    }
  }, []);

  /**
   * Load all Home page data in parallel
   * Wrapped in isMountedRef checks to prevent state updates after unmount
   */
  const loadPage = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      // Reset all state to loading state
      setPopular([]);
      setFollowing([]);
      setRecentMovies([]);
      setRecentMusic([]);
      setLoading(true);
      setFollowingLoading(true);
      setRecentLoading(true);

      // Verify API connection is available
      await testConnection();

      // Load popular works and complete works catalog in parallel
      const [popularData, worksData] = await Promise.all([
        getPopularWorks(),
        getAllWorks()
      ]);

      if (!isMountedRef.current) return;

      // Process and set popular works carousel data
      setPopular(processPopularWorks(popularData));
      const allWorks = worksData?.works || [];

      // Load following data only for authenticated users
      if (currentUserId) {
        try {
          // Fetch list of users this user is following
          const followingResponse = await getUserFollowing(currentUserId);
          const followingList = followingResponse?.following || [];

          // Prevent update if component unmounted
          if (!isMountedRef.current) return;

          // Process following data: fetch their ratings and create friend activity cards
          const followingActivity = await processFollowingData(
            followingList,
            allWorks,
            isMountedRef
          );

          // Prevent update if component unmounted during async operation
          if (!isMountedRef.current) return;

          setFollowing(followingActivity);
        } catch (error) {
          logger.error('Failed to fetch following:', error);
          setFollowing([]);
        }
      } else {
        // Guest users see empty following section
        setFollowing([]);
      }

      // Mark popular and following carousels as loaded
      setLoading(false);
      setFollowingLoading(false);

      // Load random movies and music selections for bottom carousels
      const movies = getRandomWorks(allWorks, WORK_TYPES.MOVIE, HOME_CAROUSEL_LIMIT);
      const music = getRandomWorks(allWorks, WORK_TYPES.MUSIC, HOME_CAROUSEL_LIMIT);

      if (!isMountedRef.current) return;

      // Set random movies/music and mark section as loaded
      setRecentMovies(movies);
      setRecentMusic(music);
      setRecentLoading(false);
    } catch (error) {
      logger.error('Error loading home page:', error);
      if (isMountedRef.current) {
        setLoading(false);
        setFollowingLoading(false);
        setRecentLoading(false);
      }
    }
  }, [currentUserId]);

  // Effect 2: Trigger data loading on component mount
  // Cleanup: Mark component as unmounted to prevent state updates in async operations
  useEffect(() => {
    // Mark component as mounted
    isMountedRef.current = true;
    // Trigger data loading
    loadPage();

    // Cleanup: Mark as unmounted so loadPage won't update state if still executing
    return () => {
      isMountedRef.current = false;
    };
  }, [loadPage]);

  // Return all state to component for rendering
  return {
    popular,           // Popular works for main carousel
    following,         // Friend activity cards
    recentMovies,      // Random movies carousel
    recentMusic,       // Random music carousel
    loading,           // Popular section loading state
    followingLoading,  // Following section loading state
    recentLoading,     // Recent movies/music loading state
    showWelcome        // Show welcome message on first login
  };
};
