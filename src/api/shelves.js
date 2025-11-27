import api from './client';
import logger from '../utils/logger';

/**
 * Get all shelves for a user
 */
export const getUserShelves = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/shelves`);
    return response.data;
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
    const response = await api.get(`/shelves/${shelfId}`);
    return response.data;
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
    const response = await api.post(`/users/${userId}/shelves`, shelfData);
    return response.data;
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
    const response = await api.put(`/shelves/${shelfId}`, shelfData);
    return response.data;
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
    const response = await api.delete(`/shelves/${shelfId}`);
    return response.data;
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
    if (filters.workType) params.append('work-type', filters.workType);
    if (filters.genre) params.append('genre', filters.genre);
    if (filters.year) params.append('year', filters.year);
    if (filters.rating) params.append('rating', filters.rating);

    const url = params.toString() 
      ? `/shelves/${shelfId}/works?${params.toString()}`
      : `/shelves/${shelfId}/works`;

    const response = await api.get(url);
    return response.data;
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
    const response = await api.post(`/shelves/${shelfId}/works/${workId}`);
    return response.data;
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
    const response = await api.delete(`/shelves/${shelfId}/works/${workId}`);
    return response.data;
  } catch (error) {
    logger.error('Error removing work from shelf:', error);
    throw error;
  }
};

/**
 * Get or create the default "Favourites" shelf for a user
 */
export const getOrCreateFavouritesShelf = async (userId, userShelves) => {
  // Check if Favourites shelf already exists
  const favouritesShelf = userShelves?.find(
    shelf => shelf.name?.toLowerCase() === 'favourites'
  );

  if (favouritesShelf) {
    return favouritesShelf;
  }

  // Create Favourites shelf if it doesn't exist
  try {
    const response = await createShelf(userId, {
      name: 'Favourites',
      description: 'My favorite works'
    });
    // Extract the shelf from response: {success: true, data: <shelf>, message: 'Success'}
    const newShelf = response.data || response;
    return newShelf;
  } catch (error) {
    logger.error('Error creating Favourites shelf:', error);
    throw error;
  }
};
