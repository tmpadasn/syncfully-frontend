import axios from 'axios';

// Backend is on port 3000, frontend on port 3001
const POSSIBLE_BACKEND_URLS = [
  'http://localhost:3000/api',  // Correct - backend on port 3000
  'http://localhost:3001/api',  // Frontend port (wrong)
  'http://localhost:5000/api',  // Alternative port
  'http://localhost:8000/api'   // Another alternative
];

const baseURL = process.env.REACT_APP_API_URL || POSSIBLE_BACKEND_URLS[0];

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  timeout: 15000, // Increase timeout to 15 seconds
  withCredentials: false, // Disable credentials to avoid CORS issues
  validateStatus: function (status) {
    // Accept any status code to avoid OpaqueResponseBlocking
    return status >= 200 && status < 500;
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Silently pass errors; let components handle them with nice messages
    return Promise.reject(error);
  }
);

// Test connection function
export const testConnection = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/users');
    return true;
  } catch (error) {
    if (error.response?.status === 404 && error.config?.url === 'http://localhost:3000/') {
      try {
        const apiResponse = await axios.get('http://localhost:3000/api/users');
        return true;
      } catch (apiError) {
        return false;
      }
    }
    return false;
  }
};

export default api;
