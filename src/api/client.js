import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT, DEFAULT_HEADERS } from '../config/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: DEFAULT_HEADERS,
  timeout: API_TIMEOUT,
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
    await axios.get(`${API_BASE_URL}/users`);
    return true;
  } catch (error) {
    return false;
  }
};

export default api;
