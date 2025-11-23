import api from './client';

// Simple login
export const login = async (identifier, password) => {
  const res = await api.post('/auth/login', { identifier, password });
  return res.data.data;   // ONLY return the user object
};

// Simple signup
export const signup = async (userData) => {
  const res = await api.post('/auth/signup', userData);
  return res.data.data;   // ONLY return user
};
