// src/components/dashboard/VideoUploader.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Paper, Typography, Box, Button, LinearProgress, Alert, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

import { initializeUpload, finalizeUpload } from '../../api/videoService';

const Input = styled('input')({
  display: 'none',
});

export const VideoUploader = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState({ message: '', type: '' }); // type: 'info', 'success', 'error'
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Usa o nome do arquivo como título inicial, removendo a extensão
      setTitle(selectedFile.name.split('.').slice(0, -1).join('.'));
      setStatus({ message: '', type: '' });
    }
  };

  const handleUpload = async () => {
    if (!file || !title) {
      setStatus({ message: 'Por favor, selecione um arquivo e forneça um título.', type: 'error' });
      return;
    }

    setIsUploading(true);
    setStatus({ message: 'Iniciando upload...', type: 'info' });

    try {
      // Passo 1: Obter a URL pré-assinada da nossa API
      const { upload_url, s3_key } = await initializeUpload(file.name);
      setStatus({ message: 'Enviando vídeo para o S3...', type: 'info' });

      // Passo 2: Fazer o upload do arquivo diretamente para o S3
      await axios.put(upload_url, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      // Passo 3: Finalizar o processo e disparar a análise
      setStatus({ message: 'Upload concluído! Solicitando análise...', type: 'info' });
      const analysisResult = await finalizeUpload(s3_key, title);

      setStatus({ message: 'Análise iniciada com sucesso! Redirecionando...', type: 'success' });

      // Redireciona para a página de detalhes da nova análise
      navigate(`/dashboard/analysis/${analysisResult.id}`);

    } catch (error) {
      console.error("Erro no processo de upload:", error);
      const errorMsg = error.response?.data?.error || 'Ocorreu um erro inesperado.';
      setStatus({ message: errorMsg, type: 'error' });
      setIsUploading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Iniciar Nova Análise
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Selecione um arquivo de vídeo (até 30s) e dê um título para sua análise.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <label htmlFor="video-upload-button">
          <Input accept="video/*" id="video-upload-button" type="file" onChange={handleFileChange} disabled={isUploading} />
          <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} disabled={isUploading}>
            {file ? 'Trocar Vídeo' : 'Selecionar Vídeo'}
          </Button>
        </label>

        {file && (
          <>
            <Typography variant="body2">Arquivo selecionado: <strong>{file.name}</strong></Typography>
            <TextField
              fullWidth
              label="Título da Análise"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
            />
            <Button onClick={handleUpload} variant="contained" size="large" disabled={isUploading}>
              {isUploading ? 'Processando...' : 'Analisar'}
            </Button>
          </>
        )}
      </Box>

      {(isUploading || status.message) && (
        <Box sx={{ width: '100%', mt: 3 }}>
          {isUploading && <LinearProgress variant="determinate" value={uploadProgress} />}
          {status.message && <Alert severity={status.type || 'info'} sx={{ mt: 2 }}>{status.message}</Alert>}
        </Box>
      )}
    </Paper>
  );
};