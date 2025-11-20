// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProfile } from '../api/authService';
import apiClient from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Começa carregando

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const userData = await getProfile();
          setUser(userData);
        } catch (error) {
          console.error("Invalid or expired token. Clearing...");
          localStorage.removeItem('access_token');
        }
      }
      setIsLoading(false);
    };

    validateToken();
  }, []); 

  const loginAction = async (token) => {
    localStorage.setItem('access_token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const userData = await getProfile();
    setUser(userData);
  };

  const logoutAction = () => {
    localStorage.removeItem('access_token');
    delete apiClient.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: loginAction,
    logout: logoutAction,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};