// src/api/authService.js
import apiClient from './api';

export const register = async (credentials) => {
  const response = await apiClient.post('/auth/register', credentials);
  return response.data;
};

export const login = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const getProfile = async () => {
  const response = await apiClient.get('/auth/profile');
  return response.data;
};