import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('weprovision_admin_token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('weprovision_admin_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // Validate token on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await api.getMe();
          if (res.success && res.data && (res.data.role === 'admin' || res.data.role === 'superadmin')) {
            setUser(res.data);
            localStorage.setItem('weprovision_admin_user', JSON.stringify(res.data));
          } else {
            logout();
          }
        } catch (err) {
          console.warn('Auth token validation error:', err.message);
          // If token fails or server is unreachable, keep cached user if valid admin
          if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
            logout();
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success && res.token && res.user) {
      if (res.user.role !== 'admin' && res.user.role !== 'superadmin') {
        throw new Error(`Access denied. User role '${res.user.role}' does not have admin permissions.`);
      }
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('weprovision_admin_token', res.token);
      localStorage.setItem('weprovision_admin_user', JSON.stringify(res.user));
      return res.user;
    } else {
      throw new Error(res.message || 'Login failed');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('weprovision_admin_token');
    localStorage.removeItem('weprovision_admin_user');
  };

  const value = {
    token,
    user,
    loading,
    isAuthenticated: !!token && !!user && (user.role === 'admin' || user.role === 'superadmin'),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
