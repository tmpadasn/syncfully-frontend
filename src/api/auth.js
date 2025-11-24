import api from './client';

// Simple login
export const login = async (identifier, password) => {
  const res = await api.post('/auth/login', { identifier, password });
  return res.data;   // Return full response { success, data, message } for AuthContext to process
};

// Simple signup
export const signup = async (userData) => {
  const res = await api.post('/auth/signup', userData);
  return res.data;   // Return full response { success, data, message } for AuthContext to process
};
