import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { 
  Container, Typography, Box, Button, LinearProgress, Alert, 
  Paper, CssBaseline, Card, CardContent, Chip, List, ListItem, ListItemText, Divider
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// --- IMPORTAÇÕES PARA O GRÁFICO ---
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

import styled from '@emotion/styled';

const darkTheme = createTheme({
  palette: { mode: 'dark', primary: { main: '#90caf9' }, background: { default: '#121212', paper: '#1e1e1e' } },
});

const Input = styled('input')({ display: 'none' });

function App() {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const resetState = () => {
    setStatusMessage({ type: '', text: '' });
    setUploadProgress(0);
    setAnalysisResult(null);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      resetState();
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatusMessage({ type: 'error', text: 'Por favor, selecione um vídeo primeiro.' });
      return;
    }
    
    setIsUploading(true);
    resetState();
    setStatusMessage({ type: 'info', text: 'Enviando e processando... Isso pode levar um momento.' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });
      
      setStatusMessage({ type: 'success', text: response.data.message });
      setAnalysisResult(response.data.analysis);

    } catch (error) {
      const errorText = error.response?.data?.error || 'Erro de conexão. O servidor backend está rodando?';
      setStatusMessage({ type: 'error', text: `Erro: ${errorText}` });
    } finally {
      setIsUploading(false);
    }
  };

  // --- TRANSFORMAÇÃO DE DADOS PARA O GRÁFICO ---
  // useMemo evita que os dados sejam recalculados em cada renderização, apenas quando analysisResult muda.
  const chartData = useMemo(() => {
    if (!analysisResult?.emotion_counts) {
      return [];
    }
    // Transforma {happy: 50, sad: 10} em [{name: 'happy', Contagem: 50}, {name: 'sad', Contagem: 10}]
    return Object.entries(analysisResult.emotion_counts)
      .map(([emotion, count]) => ({
        name: emotion.charAt(0).toUpperCase() + emotion.slice(1), // Capitaliza a primeira letra
        Contagem: count,
      }))
      .sort((a, b) => b.Contagem - a.Contagem); // Ordena do maior para o menor
  }, [analysisResult]);


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>Analisador de Emoções em Vídeo</Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>Envie um vídeo (MP4, MOV) de até 30 segundos.</Typography>
            
            <Box sx={{ my: 3 }}>
              <label htmlFor="contained-button-file">
                <Input accept="video/*" id="contained-button-file" type="file" onChange={handleFileChange} />
                <Button variant="contained" component="span" startIcon={<CloudUploadIcon />} disabled={isUploading}>Selecionar Vídeo</Button>
              </label>
              {file && <Typography variant="body1" sx={{ mt: 2 }}>Arquivo: <strong>{file.name}</strong></Typography>}
            </Box>

            <Button variant="outlined" color="primary" onClick={handleUpload} disabled={!file || isUploading} size="large">
              {isUploading ? 'Analisando...' : 'Enviar e Analisar'}
            </Button>

            {(isUploading || statusMessage.text) && (
              <Box sx={{ width: '100%', mt: 3 }}>
                {isUploading && <LinearProgress variant={uploadProgress < 100 ? "determinate" : "indeterminate"} value={uploadProgress} />}
                {statusMessage.text && <Alert severity={statusMessage.type} sx={{ mt: 2, textAlign: 'left' }}>{statusMessage.text}</Alert>}
              </Box>
            )}
          </Paper>

          {/* ===== SEÇÃO DE RESULTADOS DA ANÁLISE COM GRÁFICO ===== */}
          {analysisResult && (
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>Resultado da Análise</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, my: 2 }}>
                  <Typography variant="h6">Emoção Dominante:</Typography>
                  <Chip label={analysisResult.dominant_emotion.toUpperCase()} color="primary" variant="filled" sx={{ fontSize: '1rem', padding: '10px' }} />
                </Box>
                
                {/* --- COMPONENTE DO GRÁFICO --- */}
                <Box sx={{ height: 300, mt: 4 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#333' }} />
                      <Legend />
                      <Bar dataKey="Contagem" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                
                <Divider sx={{ my: 3 }}>Detalhes por Frame</Divider>
                
                <List dense>
                  {chartData.map(({ name, Contagem }) => (
                      <ListItem key={name}>
                        <ListItemText primary={name} secondary={`Detectado em ${Contagem} frames`} />
                      </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;