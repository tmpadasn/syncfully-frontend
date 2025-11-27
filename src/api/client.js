import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
  withCredentials: false,
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  }
});

// Simple error handling
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// Test connection function
export const testConnection = async () => {
  try {
    await axios.get(`${baseURL}/users`);
    return true;
  } catch (error) {
    return false;
  }
};

export default api;
