import { createContext, useEffect, useState, useCallback } from 'react';
import { loginUser, registerUser, fetchCurrentUser } from '../services/authService';
import { getErrorMessage } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('codesync_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  // On mount, verify any existing token is still valid and refresh the user profile
  useEffect(() => {
    const token = localStorage.getItem('codesync_token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetchCurrentUser()
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem('codesync_user', JSON.stringify(res.data.user));
      })
      .catch(() => {
        localStorage.removeItem('codesync_token');
        localStorage.removeItem('codesync_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = (data) => {
    localStorage.setItem('codesync_token', data.token);
    localStorage.setItem('codesync_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = useCallback(async (credentials) => {
    try {
      const res = await loginUser(credentials);
      persistSession(res.data);
      return { success: true };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
  }, []);

  const register = useCallback(async (payload) => {
    try {
      const res = await registerUser(payload);
      persistSession(res.data);
      return { success: true };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('codesync_token');
    localStorage.removeItem('codesync_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
