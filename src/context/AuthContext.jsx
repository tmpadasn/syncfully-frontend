import { createContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup } from '../api/auth';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Add a default profile picture URL
  const DEFAULT_PROFILE_PIC = 'http://localhost:3000/uploads/profiles/profile_picture.jpg';

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
        else obj.profilePicUrl = DEFAULT_PROFILE_PIC;
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

        if (m.includes('does not exist') || m.includes('no user') || m.includes('not found') || m.includes('not exist')) {
          const err = new Error('The user does not exist, please create an account');
          err.code = 'USER_NOT_FOUND';
          throw err;
        }

        if (m.includes('credentials') || m.includes('password') || m.includes('incorrect') || m.includes('wrong')) {
          const err = new Error('The credentials dont match');
          err.code = 'BAD_CREDENTIALS';
          throw err;
        }

        const err = new Error(payload.message || 'Authentication failed.');
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
        const stored = localStorage.getItem('authUser');
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
      localStorage.setItem('authUser', JSON.stringify(u));
    } catch (err) {
      // ignore localStorage errors
    }
    return u;
  };

  const signup = async (data) => {
    const raw = await apiSignup(data);
    const u = normalizeUser(raw);
    setUser(u);
    localStorage.setItem('authUser', JSON.stringify(u));
    return u;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
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
