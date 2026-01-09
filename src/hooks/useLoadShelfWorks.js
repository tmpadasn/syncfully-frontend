import { useCallback } from 'react';
import { getWork } from '../api';
import logger from '../utils/logger';

/**
 * useLoadShelfWorks Hook
 *
 * Handles asynchronous loading of work details for a shelf.
 * Fetches work data from API when a shelf is expanded for the first time.
 *
 * Features:
 * - Lazy loading: Only loads works when shelf is expanded
 * - Caching: Works are cached to avoid re-fetching
 * - Error handling: Gracefully handles API errors and returns default data
 * - Flexible data: Handles both work ID strings/numbers and work objects
 * - Fallback values: Provides sensible defaults for missing fields
 *
 * @param {array} shelves - All shelf objects with their work IDs
 * @param {object} shelfWorks - Currently cached works (shelfId -> works array)
 * @param {function} setShelfWorks - Setter to update cached works
 * @param {function} setLoadingWorks - Setter for loading state per shelf
 * @returns {function} Async function to load works for a given shelfId
 */
export function useLoadShelfWorks(shelves, shelfWorks, setShelfWorks, setLoadingWorks) {
  const loadShelfWorks = useCallback(
    async (shelfId) => {
      // Skip if already loaded (cache hit)
      if (shelfWorks[shelfId]) return;

      setLoadingWorks(prev => ({ ...prev, [shelfId]: true }));
      try {
        // Find the shelf and its work IDs
        const shelf = shelves.find(s => s.shelfId === shelfId);
        if (!shelf?.works || shelf.works.length === 0) {
          setLoadingWorks(prev => ({ ...prev, [shelfId]: false }));
          setShelfWorks(prev => ({ ...prev, [shelfId]: [] }));
          return;
        }

        // Fetch all work details in parallel
        const workDetails = await Promise.all(
          shelf.works.map(async (workId) => {
            try {
              // Handle both ID strings/numbers and work objects
              const actualWorkId = typeof workId === 'object' ? workId.workId : workId;
              const workData = await getWork(actualWorkId);

              // Normalize work data with fallbacks
              return {
                workId: workData.workId || actualWorkId,
                title: workData.title || workData.name || `Work #${actualWorkId}`,
                coverUrl: workData.coverUrl || workData.cover || '/album_covers/default.jpg',
                type: workData.type || 'unknown',
                creator: workData.creator || workData.author || workData.artist,
                year: workData.year || workData.releaseYear,
                averageRating: workData.averageRating || workData.rating || 0
              };
            } catch (err) {
              logger.error(`Error loading work ${workId}:`, err);
              // Return minimal work data on error
              const actualWorkId = typeof workId === 'object' ? workId.workId : workId;
              return {
                workId: actualWorkId,
                title: `Work #${actualWorkId}`,
                coverUrl: '/album_covers/default.jpg',
                type: 'unknown',
                averageRating: 0
              };
            }
          })
        );

        // Cache the loaded works
        setShelfWorks(prev => ({ ...prev, [shelfId]: workDetails }));
      } catch (err) {
        logger.error('Error loading shelf works:', err);
        setShelfWorks(prev => ({ ...prev, [shelfId]: [] }));
      } finally {
        setLoadingWorks(prev => ({ ...prev, [shelfId]: false }));
      }
    },
    [shelves, shelfWorks, setShelfWorks, setLoadingWorks]
  );

  return loadShelfWorks;
}
