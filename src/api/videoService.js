// src/api/videoService.js
import apiClient from './api';

/**
 * Função unificada para upload de vídeo.
 * Decide entre o fluxo local e o S3 com base nas variáveis de ambiente.
 */
export const uploadVideo = async (file, title, onUploadProgress) => {
  const storageType = import.meta.env.VITE_STORAGE_TYPE || 's3';

  if (storageType === 'local') {
    // --- FLUXO LOCAL ---
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    const response = await apiClient.post('/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;

  } else {
    // --- FLUXO S3 ---
    // 1. Obter URL pré-assinada
    const { upload_url, s3_key } = await apiClient.post('/videos/upload', { filename: file.name });

    // 2. Upload direto para S3 (usando axios puro, sem o token da nossa API)
    await axios.put(upload_url, file, {
      headers: { 'Content-Type': file.type },
      onUploadProgress,
    });

    // 3. Finalizar e disparar análise
    const response = await apiClient.post('/videos/upload/finalize', { s3_key, title });
    return response.data;
  }
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
    const data = response.data;

    // Constrói a URL do vídeo para o player localmente
    if (import.meta.env.VITE_STORAGE_TYPE === 'local' && data.s3_key) {
        // Remove o prefixo 'uploads/user_id/' para obter apenas o nome do ficheiro
        const filename = data.s3_key.split('/').pop();
        // Constrói a URL para o novo endpoint de stream
        data.video_url = `${apiClient.defaults.baseURL}/videos/stream/${filename}`;
    }

    return data;
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