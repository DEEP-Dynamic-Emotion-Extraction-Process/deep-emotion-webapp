// src/components/dashboard/VideoUploader.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Box, Button, LinearProgress, Alert, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

import { uploadVideo } from '../../api/videoService';
import { useAnalyses } from '../../contexts/AnalysisContext';

const Input = styled('input')({
  display: 'none',
});

export const VideoUploader = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();
  const { addAnalysis } = useAnalyses();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setTitle(selectedFile.name.split('.').slice(0, -1).join('.'));
      setStatus({ message: '', type: '' });
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!file || !title) {
      setStatus({ message: 'Por favor, selecione um ficheiro e forneça um título.', type: 'error' });
      return;
    }

    setIsUploading(true);
    setStatus({ message: 'A iniciar upload...', type: 'info' });

    try {
      const analysisResult = await uploadVideo(file, title, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
        if (percent < 100) {
            setStatus({ message: `A enviar... ${percent}%`, type: 'info' });
        } else {
            setStatus({ message: 'Upload concluído! A solicitar análise...', type: 'info' });
        }
      });

      addAnalysis(analysisResult);

      setStatus({ message: 'Análise iniciada com sucesso!', type: 'success' });
      navigate(`/dashboard/analysis/${analysisResult.id}`);

    } catch (error) {
      console.error("Erro no processo de upload:", error);
      const errorMsg = error.response?.data?.error || 'Ocorreu um erro inesperado.';
      setStatus({ message: errorMsg, type: 'error' });
      setIsUploading(false);
    } finally {
       setIsUploading(false);
       setFile(null);
       setTitle('');
       setUploadProgress(0);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Iniciar Nova Análise
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Selecione um ficheiro de vídeo (até 30s) e dê um título à sua análise.
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
            <Typography variant="body2">Ficheiro selecionado: <strong>{file.name}</strong></Typography>
            <TextField
              fullWidth
              label="Título da Análise"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
            />
            <Button onClick={handleUpload} variant="contained" size="large" disabled={isUploading}>
              {isUploading ? 'A processar...' : 'Analisar'}
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