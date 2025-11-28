import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT, DEFAULT_HEADERS } from '../config/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: DEFAULT_HEADERS,
  timeout: API_TIMEOUT,
  withCredentials: false,
  validateStatus: (status) => status >= 200 && status < 500,
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

/**
 * Extract response data from backend format
 * Backend returns: {success: true, data: {...}, message: "..."}
 */
export const extractResponseData = (response) => {
  if (!response?.data) return null;
  return response.data.data || response.data;
};

/**
 * Test API connection
 */
export const testConnection = async () => {
  try {
    await axios.get(`${API_BASE_URL}/users`);
    return true;
  } catch (error) {
    return false;
  }
};

export default api;
