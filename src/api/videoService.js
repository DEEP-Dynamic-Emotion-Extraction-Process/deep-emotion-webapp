// src/api/videoService.js
import apiClient from './api';

/**
 * Pede à API uma URL pré-assinada para o upload de um arquivo.
 * @param {string} filename - O nome do arquivo a ser enviado.
 */
export const initializeUpload = async (filename) => {
  const response = await apiClient.post('/videos/upload/initialize', { filename });
  return response.data; // Espera-se { upload_url, s3_key }
};

/**
 * Notifica a API que o upload no S3 foi concluído e dispara o processamento.
 * @param {string} s3_key - A chave do objeto no S3.
 * @param {string} title - O título dado ao vídeo.
 */
export const finalizeUpload = async (s3_key, title) => {
  const response = await apiClient.post('/videos/upload/finalize', { s3_key, title });
  return response.data; // Espera-se o objeto do vídeo criado
};

/**
 * Busca a lista de vídeos de um usuário autenticado.
 */
export const getUserVideos = async () => {
    const response = await apiClient.get('/videos/');
    return response.data;
};

/**
 * Busca os detalhes de uma análise de vídeo específica.
 * @param {string} videoId - O ID do vídeo/análise.
 */
export const getVideoDetails = async (videoId) => {
    const response = await apiClient.get(`/videos/${videoId}`);
    return response.data;
}

/**
 * Atualiza os dados de uma análise, como o título.
 * @param {string} videoId - O ID da análise a ser atualizada.
 * @param {object} data - Os dados a serem atualizados (ex: { title: "Novo Título" }).
 */
export const updateVideoDetails = async (videoId, data) => {
  const response = await apiClient.patch(`/videos/${videoId}`, data);
  return response.data;
};