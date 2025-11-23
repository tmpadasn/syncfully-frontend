import { createContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup } from '../api/auth';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Normalize backend response → extract ONLY user data
  const normalizeUser = (res) => {
    if (!res) return null;

    // backend always returns: { success, data: { userId, username, ... }, message }
    if (res.data) return res.data;

    return res;
  };

  // Restore session
  useEffect(() => {
    try {
      const stored = localStorage.getItem('authUser');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.userId) {
          setUser(parsed);
        }
      }
    } catch (err) {
      console.warn('Failed restoring authUser', err);
    }
  }, []);

  const login = async (identifier, password) => {
    const raw = await apiLogin(identifier, password);
    const u = normalizeUser(raw);
    setUser(u);
    localStorage.setItem('authUser', JSON.stringify(u));
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
        isGuest: !user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
