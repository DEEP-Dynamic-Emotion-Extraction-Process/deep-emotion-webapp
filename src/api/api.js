// src/api/api.js
import axios from 'axios';

/**
 * Cria uma instância do Axios com configurações pré-definidas.
 * Isso nos permite ter um ponto central para todas as chamadas à API,
 * facilitando a manutenção e a adição de interceptors.
 */
const apiClient = axios.create({
  // A URL base da sua API Flask que está rodando (seja localmente ou em produção).
  // O prefixo /api/v1 já está incluído, conforme planejamos no backend.
  baseURL: 'http://127.0.0.1:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Futuramente, adicionaremos um interceptor aqui para injetar o token JWT
// em todas as requisições que precisarem de autenticação.

export default apiClient;