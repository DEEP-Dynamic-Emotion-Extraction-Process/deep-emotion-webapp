// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMe } from '../api/authService';
import apiClient from '../api/api';

// 1. Cria o Contexto
const AuthContext = createContext(null);

// 2. Cria o Provedor (Provider)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Começa carregando

  useEffect(() => {
    // Função para verificar se existe um token válido no carregamento da página
    const validateToken = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const userData = await getMe();
          setUser(userData);
        } catch (error) {
          console.error("Token inválido ou expirado. Limpando...");
          localStorage.removeItem('access_token');
        }
      }
      setIsLoading(false);
    };

    validateToken();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  const loginAction = async (token) => {
    localStorage.setItem('access_token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const userData = await getMe();
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

// 3. Cria o Hook customizado para consumir o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};