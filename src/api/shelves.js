import api from './client';
import logger from '../utils/logger';

/**
 * Get all shelves for a user
 */
export const getUserShelves = async (userId) => {
  try {
    const res = await api.get(`/users/${userId}/shelves`);
    return res.data;
  } catch (error) {
    logger.error('Error fetching user shelves:', error);
    return { shelves: [] };
  }
};

/**
 * Get a specific shelf by ID
 */
export const getShelfById = async (shelfId) => {
  try {
    const res = await api.get(`/shelves/${shelfId}`);
    return res.data;
  } catch (error) {
    logger.error('Error fetching shelf:', error);
    throw error;
  }
};

/**
 * Create a new shelf
 */
export const createShelf = async (userId, shelfData) => {
  try {
    const res = await api.post(`/users/${userId}/shelves`, shelfData);
    return res.data;
  } catch (error) {
    logger.error('Error creating shelf:', error);
    throw error;
  }
};

/**
 * Update a shelf
 */
export const updateShelf = async (shelfId, shelfData) => {
  try {
    const res = await api.put(`/shelves/${shelfId}`, shelfData);
    return res.data;
  } catch (error) {
    logger.error('Error updating shelf:', error);
    throw error;
  }
};

/**
 * Delete a shelf
 */
export const deleteShelf = async (shelfId) => {
  try {
    const res = await api.delete(`/shelves/${shelfId}`);
    return res.data;
  } catch (error) {
    logger.error('Error deleting shelf:', error);
    throw error;
  }
};

/**
 * Get works in a shelf with optional filters
 */
export const getShelfWorks = async (shelfId, filters = {}) => {
  try {
    const params = new URLSearchParams();
    const filterMap = { workType: 'work-type', genre: 'genre', year: 'year', rating: 'rating' };
    
    Object.entries(filterMap).forEach(([key, param]) => {
      if (filters[key]) params.append(param, filters[key]);
    });

    const url = params.toString() 
      ? `/shelves/${shelfId}/works?${params}`
      : `/shelves/${shelfId}/works`;

    const res = await api.get(url);
    return res.data;
  } catch (error) {
    logger.error('Error fetching shelf works:', error);
    return { works: [] };
  }
};

/**
 * Add a work to a shelf
 */
export const addWorkToShelf = async (shelfId, workId) => {
  try {
    const res = await api.post(`/shelves/${shelfId}/works/${workId}`);
    return res.data;
  } catch (error) {
    logger.error('Error adding work to shelf:', error);
    throw error;
  }
};

/**
 * Remove a work from a shelf
 */
export const removeWorkFromShelf = async (shelfId, workId) => {
  try {
    const res = await api.delete(`/shelves/${shelfId}/works/${workId}`);
    return res.data;
  } catch (error) {
    logger.error('Error removing work from shelf:', error);
    throw error;
  }
};

/**
 * Get or create the default "Favourites" shelf for a user
 */
export const getOrCreateFavouritesShelf = async (userId, userShelves) => {
  const favouritesShelf = userShelves?.find(
    shelf => shelf.name?.toLowerCase() === 'favourites'
  );

  if (favouritesShelf) return favouritesShelf;

  try {
    const res = await createShelf(userId, {
      name: 'Favourites',
      description: 'My favorite works'
    });
    return res.data || res;
  } catch (error) {
    logger.error('Error creating Favourites shelf:', error);
    throw error;
  }
};