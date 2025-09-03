// src/pages/AnalysisDetailPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, Alert, Grid, Divider } from '@mui/material';

import { getVideoDetails, updateVideoDetails } from '../api/videoService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { VideoPlayer } from '../components/analysis/VideoPlayer';
import { EmotionTimeline } from '../components/analysis/EmotionTimeline';
import { InsightsCharts } from '../components/analysis/InsightsCharts';
import { EditableTitle } from '../components/analysis/EditableTitle';

export const AnalysisDetailPage = () => {
  const { analysisId } = useParams(); // Obtém o ID da análise a partir da URL
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const videoRef = useRef(null); // Cria uma ref para o leitor de vídeo

  useEffect(() => {
    // Função para buscar os detalhes da análise na API
    const fetchDetails = async () => {
      if (!analysisId) return;

      setIsLoading(true);
      setError('');
      try {
        const data = await getVideoDetails(analysisId);
        setAnalysis(data);
      } catch (err) {
        setError('Não foi possível carregar os detalhes desta análise.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [analysisId]); // Re-executa se o ID na URL mudar

  // Função para ser passada para a linha do tempo para navegar no vídeo
  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  // Função para guardar o novo título da análise
  const handleTitleSave = async (newTitle) => {
    if (!analysis || newTitle === analysis.title) return;

    try {
      // Atualiza o estado local imediatamente para uma UI mais rápida
      const updatedAnalysis = { ...analysis, title: newTitle };
      setAnalysis(updatedAnalysis);
      
      // Envia a alteração para a API em segundo plano
      await updateVideoDetails(analysis.id, { title: newTitle });
    } catch (err) {
      console.error("Falha ao atualizar o título", err);
      // Reverte para o título antigo em caso de erro na API
      setAnalysis(analysis); 
    }
  };

  // Renderizações condicionais para os estados de carregamento e erro
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!analysis) {
    return <Typography>Análise não encontrada.</Typography>;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        {/* Componente de Título Editável */}
        <EditableTitle 
          initialTitle={analysis.title} 
          onSave={handleTitleSave} 
        />
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={4}>
          {/* Coluna Esquerda: Vídeo e Linha do Tempo */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ mb: 2, overflow: 'hidden' }}>
              <VideoPlayer ref={videoRef} videoUrl={analysis.video_url} />
            </Paper>
            <Paper>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6">Linha do Tempo das Emoções</Typography>
                <Box sx={{ mt: 2 }}>
                  <EmotionTimeline
                    frames={analysis.frames}
                    duration={analysis.duration_seconds}
                    onSeek={handleSeek}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          {/* Coluna Direita: Gráficos de Insights */}
          <Grid item xs={12} md={4}>
            <Paper>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6">Insights da Análise</Typography>
                <InsightsCharts frames={analysis.frames} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};