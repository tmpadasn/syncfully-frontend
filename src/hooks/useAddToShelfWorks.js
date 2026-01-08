/**
 * useAddToShelfWorks: Custom hook for managing works in a specific shelf
 * When user clicks "Add to Shelf" in SearchResults, this hook loads which works
 * are already in that target shelf (for visual feedback - show checkmark vs plus)
 *
 * Args:
 *   - addToShelfId: ID of the shelf to monitor (or empty string if not in add mode)
 *
 * Returns:
 *   - addedWorks: Set of work IDs already in the target shelf
 */
import { useCallback, useRef, useState, useEffect } from 'react';
import { getShelfWorks } from '../api/shelves';
import logger from '../utils/logger';

export function useAddToShelfWorks(addToShelfId) {
  const isMountedRef = useRef(true);
  const [addedWorks, setAddedWorks] = useState(new Set());

  // Load works in target shelf to show which are already added
  const loadShelfContents = useCallback(async () => {
    if (!addToShelfId || !isMountedRef.current) {
      setAddedWorks(new Set());
      return;
    }

    try {
      const shelfWorksResponse = await getShelfWorks(addToShelfId);
      if (!isMountedRef.current) return;

      let worksArray = [];

      if (Array.isArray(shelfWorksResponse)) {
        worksArray = shelfWorksResponse;
      } else if (Array.isArray(shelfWorksResponse?.data?.works)) {
        worksArray = shelfWorksResponse.data.works;
      } else if (Array.isArray(shelfWorksResponse?.works)) {
        worksArray = shelfWorksResponse.works;
      } else if (Array.isArray(shelfWorksResponse?.data)) {
        worksArray = shelfWorksResponse.data;
      } else if (Array.isArray(shelfWorksResponse?.data?.shelf?.works)) {
        worksArray = shelfWorksResponse.data.shelf.works;
      }

      const workIds = worksArray
        .map(work => {
          if (!work) return null;
          if (typeof work === 'string' || typeof work === 'number') {
            return String(work);
          }

          const nestedWork = typeof work.work === 'object' ? work.work : null;
          const nestedId = nestedWork
            ? (nestedWork.id || nestedWork.workId || nestedWork._id || nestedWork.entityId)
            : null;
          const directId = work.workId || work.id || work._id || work.entityId;
          const finalId = directId || nestedId;
          return finalId ? String(finalId) : null;
        })
        .filter(Boolean);

      if (isMountedRef.current) {
        setAddedWorks(new Set(workIds));
      }
    } catch (error) {
      logger.error('Failed to load works already in shelf:', error);
      if (isMountedRef.current) {
        setAddedWorks(new Set());
      }
    }
  }, [addToShelfId]);

  useEffect(() => {
    loadShelfContents();
  }, [loadShelfContents]);

  return { addedWorks, isMountedRef };
}
