// src/api/videoService.js
import apiClient from './api';

export const uploadVideo = async (file, title, onUploadProgress) => {
  const storageType = import.meta.env.VITE_STORAGE_TYPE || 's3';

  if (storageType === 'local') {
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
    const { upload_url, s3_key } = await apiClient.post('/videos/upload', { filename: file.name });

    await axios.put(upload_url, file, {
      headers: { 'Content-Type': file.type },
      onUploadProgress,
    });

    const response = await apiClient.post('/videos/upload/finalize', { s3_key, title });
    return response.data;
  }
};

export const getUserVideos = async () => {
    const response = await apiClient.get('/videos/');
    return response.data;
};


export const getVideoDetails = async (videoId) => {
    const response = await apiClient.get(`/videos/${videoId}`);
    const data = response.data;

    if (import.meta.env.VITE_STORAGE_TYPE === 'local' && data.s3_key) {
        const filename = data.s3_key.split('/').pop();
        data.video_url = `${apiClient.defaults.baseURL}/videos/stream/${filename}`;
    }

    return data;
}

export const updateVideoDetails = async (videoId, data) => {
  const response = await apiClient.patch(`/videos/${videoId}`, data);
  return response.data;
};