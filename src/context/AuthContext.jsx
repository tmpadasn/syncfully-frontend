import { createContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup } from '../api/auth';
import {
  DEFAULT_PROFILE_PICTURE,
  STORAGE_KEY_AUTH_USER,
  ERROR_CODE_USER_NOT_FOUND,
  ERROR_CODE_BAD_CREDENTIALS,
  ERROR_MESSAGES,
  ERROR_KEYWORDS
} from '../config/constants';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Normalize backend response → extract ONLY user data and ensure profilePicUrl
  const normalizeUser = (res) => {
    if (!res) return null;

    // Prefer axios-style response payload
    const payload = res.data ?? res;

    // Helper to ensure a user object has a profilePicUrl (map common keys)
    const ensureProfilePic = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      // Map common alternate keys to profilePicUrl
      if (!obj.profilePicUrl) {
        if (obj.profile_pic_url) obj.profilePicUrl = obj.profile_pic_url;
        else if (obj.avatarUrl) obj.profilePicUrl = obj.avatarUrl;
        else if (obj.avatar_url) obj.profilePicUrl = obj.avatar_url;
        else obj.profilePicUrl = DEFAULT_PROFILE_PICTURE;
      }
    };

    if (payload && typeof payload === 'object') {
      if (Object.prototype.hasOwnProperty.call(payload, 'success')) {
        if (payload.success) {
          const candidate = payload.data || payload;
          ensureProfilePic(candidate);
          return candidate;
        }

        // Map common backend messages to friendly client messages
        const rawMsg = (payload.message || '').toString();
        const m = rawMsg.toLowerCase();

        if (ERROR_KEYWORDS.USER_NOT_FOUND.some(keyword => m.includes(keyword))) {
          const err = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
          err.code = ERROR_CODE_USER_NOT_FOUND;
          throw err;
        }

        if (ERROR_KEYWORDS.BAD_CREDENTIALS.some(keyword => m.includes(keyword))) {
          const err = new Error(ERROR_MESSAGES.BAD_CREDENTIALS);
          err.code = ERROR_CODE_BAD_CREDENTIALS;
          throw err;
        }

        const err = new Error(payload.message || ERROR_MESSAGES.AUTH_FAILED);
        throw err;
      }

      // If payload already looks like a user object, ensure profile pic and return it
      if (payload.userId || payload.id || payload.username) {
        ensureProfilePic(payload);
        return payload;
      }

      // If payload.data looks like a user object, handle that too
      if (payload.data && (payload.data.userId || payload.data.id || payload.data.username)) {
        ensureProfilePic(payload.data);
        return payload.data;
      }
    }

    return null;
  };

  // Restore session
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_AUTH_USER);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.userId) {
            setUser(parsed);
          }
        }
      } catch (err) {
        // Silently fail if localStorage is unavailable
      } finally {
        setAuthLoading(false);
      }
    };
    
    restoreSession();
  }, []);

  const login = async (identifier, password) => {
    const raw = await apiLogin(identifier, password);
    const u = normalizeUser(raw);
    // normalizeUser will throw for unsuccessful logins — allow that to propagate
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(u));
    } catch (err) {
      // ignore localStorage errors
    }
    return u;
  };

  const signup = async (data) => {
    const raw = await apiSignup(data);
    const u = normalizeUser(raw);
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(u));
    } catch (err) {
      // ignore localStorage errors
    }
    return u;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_AUTH_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isGuest: !user,
        authLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
