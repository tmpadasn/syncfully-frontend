import api from './client';

// Get all users
export const getAllUsers = async () => {
  try {
    const res = await api.get('/users');
    // Backend returns: {success: true, data: [...], message: "..."}
    return res.data.data || res.data;
  } catch (error) {
    throw error;
  }
};

// Create a new user
export const createUser = async (userData) => {
  try {
    const res = await api.post('/users', userData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const res = await api.get(`/users/${userId}`);
    // Backend returns: {success: true, data: {...}, message: "..."}
    return res.data.data || res.data;
  } catch (error) {
    throw error;
  }
};

// Update user
export const updateUser = async (userId, userData) => {
  try {
    const res = await api.put(`/users/${userId}`, userData);
    // Backend returns: {success: true, data: {...}, message: "..."}
    return res.data.data || res.data;
  } catch (error) {
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const res = await api.delete(`/users/${userId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Get user's ratings
export const getUserRatings = async (userId) => {
  try {
    const res = await api.get(`/users/${userId}/ratings`);
    // Backend returns: {success: true, data: {...}, message: "..."}
    return res.data.data || res.data;
  } catch (error) {
    return { ratings: [] };
  }
};

// Add user rating for a work
export const addUserRating = async (userId, ratingData) => {
  try {
    const res = await api.post(`/users/${userId}/ratings`, ratingData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Get user recommendations
export const getUserRecommendations = async (userId) => {
  try {
    const res = await api.get(`/users/${userId}/recommendations`);
    // Backend returns: {success: true, data: {...}, message: "..."}
    return res.data.data || res.data;
  } catch (error) {
    return { recommendations: [] };
  }
};
