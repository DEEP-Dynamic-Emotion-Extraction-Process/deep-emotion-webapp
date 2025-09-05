// src/api/authService.js
import apiClient from './api';

/**
 * Envia as credenciais para a API e retorna os dados do usuário em caso de sucesso.
 * @param {object} credentials - { username, email, password }
 */
export const register = async (credentials) => {
  const response = await apiClient.post('/auth/register', credentials);
  return response.data;
};

/**
 * Envia as credenciais para a API e retorna um token de acesso.
 * @param {object} credentials - { email, password }
 */
export const login = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

/**
 * Busca os dados do usuário autenticado usando o token JWT armazenado.
 * Adaptado para o endpoint /auth/profile da sua API.
 */
export const getProfile = async () => {
  const response = await apiClient.get('/auth/profile');
  return response.data;
};