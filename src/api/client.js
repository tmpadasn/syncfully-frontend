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

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging and better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    console.log('📦 Response data:', response.data);
    
    // Check for OpaqueResponseBlocking issues
    if (!response.data || response.data === '') {
      console.warn('⚠️ Empty response received - possible CORS or server issue');
    }
    
    return response;
  },
  (error) => {
    // Handle OpaqueResponseBlocking specifically
    if (error.message && error.message.includes('opaque')) {
      console.error('🚨 OPAQUE RESPONSE BLOCKING detected!');
      console.error('💡 This usually means:');
      console.error('   1. CORS is not configured properly on backend');
      console.error('   2. Backend is returning HTML instead of JSON');
      console.error('   3. Backend route doesn\'t exist');
      console.error('💡 Check your backend CORS configuration');
    }
    
    if (error.response) {
      console.error(`❌ API Response Error: ${error.response.status} ${error.response.statusText}`);
      console.error('❌ Error data:', error.response.data);
    } else if (error.request) {
      console.error('❌ Network Error - No response received:', error.request);
      console.error('💡 Current backend URL:', baseURL);
      
      // Handle specific error codes
      if (error.code === 'ECONNREFUSED' || error.message.includes('NS_BINDING_ABORTED')) {
        console.error('🚨 CONNECTION REFUSED - Backend server is not running!');
        console.error('💡 SOLUTION: Start your backend server:');
        console.error('   cd syncfully-backend');
        console.error('   npm start');
      }
    } else {
      console.error('❌ Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Test connection function
export const testConnection = async () => {
  try {
    console.log('🔍 Testing backend API connection...');
    // Test the actual API endpoint instead of root
    const response = await axios.get('http://localhost:3000/api/users');
    console.log('✅ Backend API is working!', response.status);
    return true;
  } catch (error) {
    // 404 on root is normal, but API endpoints should work
    if (error.response?.status === 404 && error.config?.url === 'http://localhost:3000/') {
      console.log('ℹ️ Root endpoint returns 404 (normal), testing API endpoint...');
      try {
        const apiResponse = await axios.get('http://localhost:3000/api/users');
        console.log('✅ Backend API is working!', apiResponse.status);
        return true;
      } catch (apiError) {
        console.error('❌ Backend API is not working:', apiError.message);
        return false;
      }
    }
    
    console.error('❌ Backend server is NOT running:', error.message);
    console.error('💡 Start backend: cd syncfully-backend && npm start');
    return false;
  }
};

export default api;
