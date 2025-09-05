// src/api/api.js
import axios from 'axios';

const apiClient = axios.create({
  // Lê a URL base do arquivo .env, ou usa o localhost por defeito
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api/v2',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adiciona um interceptor para injetar o token JWT em todas as requisições
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;