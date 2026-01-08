/**
 * useFavourites: Custom hook for managing user's favourite works
 * Loads the user's "Favourites" shelf and tracks which works are favourited
 * Used in SearchResults and other components to show favourite status
 *
 * Returns:
 *   - favouritedWorks: Set of work IDs that are in the favourites shelf
 *   - favouritesShelfId: ID of the favourites shelf (for API calls)
 *   - isMountedRef: Ref to prevent state updates on unmounted components
 */
import { useCallback, useRef, useState, useEffect } from 'react';
import {
  getUserShelves,
  getOrCreateFavouritesShelf,
  getShelfWorks,
} from '../api';
import {
  extractShelvesFromResponse,
  extractWorksFromResponse,
  extractWorkIdsFromShelf,
} from '../utils/normalize';
import logger from '../utils/logger';

export function useFavourites(user) {
  const isMountedRef = useRef(true);
  const [favouritedWorks, setFavouritedWorks] = useState(new Set());
  const [favouritesShelfId, setFavouritesShelfId] = useState(null);

  // Load user's favourite works on mount
  const loadFavourites = useCallback(async () => {
    if (!user || !isMountedRef.current) return;

    try {
      const shelvesData = await getUserShelves(user.userId);
      if (!isMountedRef.current) return;

      const shelves = extractShelvesFromResponse(shelvesData);
      const favourites = await getOrCreateFavouritesShelf(user.userId, shelves);
      if (!isMountedRef.current) return;

      setFavouritesShelfId(favourites.shelfId);

      const favouritesWorksData = await getShelfWorks(favourites.shelfId);
      if (!isMountedRef.current) return;

      const favouritesWorks = extractWorksFromResponse(favouritesWorksData);
      const workIds = extractWorkIdsFromShelf(favouritesWorks);

      if (isMountedRef.current) {
        setFavouritedWorks(workIds);
      }
    } catch (error) {
      logger.error('Failed to load favourites:', error);
    }
  }, [user]);

  // Toggle a work in favourites (optimistic update - updates immediately without page reload)
  const toggleFavourite = useCallback((workId) => {
    const workIdStr = String(workId);
    setFavouritedWorks(prev => {
      const updated = new Set(prev);
      if (updated.has(workIdStr)) {
        updated.delete(workIdStr);
      } else {
        updated.add(workIdStr);
      }
      return updated;
    });
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    loadFavourites();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadFavourites]);

  return { favouritedWorks, favouritesShelfId, isMountedRef, toggleFavourite };
}
