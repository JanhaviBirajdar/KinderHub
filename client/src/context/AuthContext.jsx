import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('kinderhub_token') || null);
  const [loading, setLoading] = useState(true);

  // Load current session or default to demo Super Admin for instant exploration
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const profile = await api.getMe();
          setUser(profile);
        } catch (err) {
          console.warn('Session expired or invalid, logging out:', err.message);
          logout();
        }
      } else {
        // Automatically login with demo Super Admin so user can test the app immediately!
        try {
          const res = await api.login({ email: 'admin@kinderhub.edu', password: 'Admin@123' });
          setToken(res.token);
          localStorage.setItem('kinderhub_token', res.token);
          setUser(res.user);
        } catch (e) {
          console.error('Initial login fallback error:', e);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    setToken(res.token);
    localStorage.setItem('kinderhub_token', res.token);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('kinderhub_token');
  };

  // Quick One-Click Demo Role Switcher
  const switchRole = async (targetRole) => {
    let email = 'admin@kinderhub.edu';
    let password = 'Admin@123';

    if (targetRole === 'school_admin') {
      email = 'principal@kinderhub.edu';
      password = 'Admin@123';
    } else if (targetRole === 'teacher') {
      email = 'clara.teacher@kinderhub.edu';
      password = 'Teacher@123';
    } else if (targetRole === 'parent') {
      email = 'sarah.parent@kinderhub.edu';
      password = 'Parent@123';
    }

    const res = await login(email, password);
    return res;
  };

  const updateProfile = (data) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || 'super_admin',
        loading,
        login,
        logout,
        switchRole,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
