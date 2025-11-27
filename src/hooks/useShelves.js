import { useState, useEffect } from 'react';
import logger from '../utils/logger';
import {
  getUserShelves,
  createShelf,
  updateShelf,
  deleteShelf,
  addWorkToShelf,
  removeWorkFromShelf,
  getOrCreateFavouritesShelf
} from '../api/shelves';
import { SHELF_NAMES } from '../config/constants';

/**
 * Custom hook for managing user shelves
 */
export default function useShelves(userId) {
  const [shelves, setShelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load shelves on mount or when userId changes
  useEffect(() => {
    if (!userId) {
      setShelves([]);
      setLoading(false);
      return;
    }

    const loadShelves = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getUserShelves(userId);
        setShelves(response.data?.shelves || []);
      } catch (err) {
        setError(err.message);
        logger.error('Error loading shelves:', err);
      } finally {
        setLoading(false);
      }
    };

    loadShelves();
  }, [userId]);

  // Create new shelf
  const createNewShelf = async (name, description = '') => {
    try {
      setError(null);
      const response = await createShelf(userId, { name, description });
      const newShelf = response.data;
      setShelves([...shelves, newShelf]);
      return newShelf;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update existing shelf
  const updateExistingShelf = async (shelfId, name, description) => {
    try {
      setError(null);
      const response = await updateShelf(shelfId, { name, description });
      const updated = response.data;
      setShelves(shelves.map(s => s.shelfId === shelfId ? updated : s));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete shelf
  const deleteExistingShelf = async (shelfId) => {
    try {
      setError(null);
      await deleteShelf(shelfId);
      setShelves(shelves.filter(s => s.shelfId !== shelfId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Add work to shelf
  const addWorkToExistingShelf = async (shelfId, workId) => {
    try {
      setError(null);
      const response = await addWorkToShelf(shelfId, workId);
      setShelves(shelves.map(s => s.shelfId === shelfId ? response.data : s));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Remove work from shelf
  const removeWorkFromExistingShelf = async (shelfId, workId) => {
    try {
      setError(null);
      const response = await removeWorkFromShelf(shelfId, workId);
      setShelves(shelves.map(s => s.shelfId === shelfId ? response.data : s));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Get or create Favourites shelf
  const getOrCreateFavourites = async () => {
    try {
      setError(null);
      const favourites = await getOrCreateFavouritesShelf(userId, shelves);
      
      // Check if a Favourites shelf already exists by name (case-insensitive)
      const existingFavourites = shelves.find(s => 
        s.name?.toLowerCase() === SHELF_NAMES.FAVOURITES
      );
      
      // Only add if we don't have any Favourites shelf yet
      if (!existingFavourites) {
        setShelves([...shelves, favourites]);
      }
      
      return favourites;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    shelves,
    loading,
    error,
    createNewShelf,
    updateExistingShelf,
    deleteExistingShelf,
    addWorkToExistingShelf,
    removeWorkFromExistingShelf,
    getOrCreateFavourites,
    refetch: () => {
      if (userId) {
        const loadShelves = async () => {
          try {
            const response = await getUserShelves(userId);
            setShelves(response.data?.shelves || []);
          } catch (err) {
            setError(err.message);
          }
        };
        loadShelves();
      }
    }
  };
}
