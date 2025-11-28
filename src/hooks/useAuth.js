/**
 * Custom hook for accessing authentication context
 * Provides user, login, logout, and authentication state throughout the app
 * 
 * @returns {Object} Auth context containing:
 *   - user: Current authenticated user object or null
 *   - isGuest: Boolean indicating if user is not authenticated
 *   - authLoading: Boolean indicating auth state is being restored
 *   - login: Function to login with credentials
 *   - signup: Function to create new user account
 *   - logout: Function to clear auth state
 *   - setUser: Function to manually set user state
 */
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function useAuth() {
  return useContext(AuthContext);
}
