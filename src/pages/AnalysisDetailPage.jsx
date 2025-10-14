// src/pages/AnalysisDetailPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react'; // Adicione useCallback
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, Alert, Grid, Divider } from '@mui/material';

import { getVideoDetails, updateVideoDetails } from '../api/videoService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { VideoPlayer } from '../components/analysis/VideoPlayer';
import { EmotionTimeline } from '../components/analysis/EmotionTimeline';
import { InsightsCharts } from '../components/analysis/InsightsCharts';
import { EditableTitle } from '../components/analysis/EditableTitle';
import { useAnalyses } from '../contexts/AnalysisContext';

export const AnalysisDetailPage = () => {
  const { analysisId } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const { updateAnalysisTitle, justCompletedId, setJustCompletedId } = useAnalyses();

 const fetchDetails = useCallback(async () => {
    if (!analysisId) return;

    setError('');
    try {
      const data = await getVideoDetails(analysisId);
      setAnalysis(data);
    } catch (err) {
      setError('Não foi possível carregar os detalhes desta análise.');
    } finally {
      setIsLoading(false);
    }
  }, [analysisId]);

  useEffect(() => {
    setIsLoading(true);
    fetchDetails();
  }, [analysisId, fetchDetails]);

  useEffect(() => {
    if (justCompletedId === analysisId) {
      console.log(`Análise ${analysisId} concluída. A atualizar dados...`);
      fetchDetails(); 
      setJustCompletedId(null); 
    }
  }, [justCompletedId, analysisId, fetchDetails, setJustCompletedId]);

  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleTitleSave = async (newTitle) => {
    if (!analysis || newTitle === analysis.title) return;

    const oldTitle = analysis.title;
    setAnalysis({ ...analysis, title: newTitle });

    try {
      await updateVideoDetails(analysis.id, { title: newTitle });
      updateAnalysisTitle(analysis.id, newTitle);
    } catch (err) {
      console.error("Falha ao atualizar o título", err);
      setAnalysis({ ...analysis, title: oldTitle });
    }
  };

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
        <EditableTitle 
          initialTitle={analysis.title} 
          onSave={handleTitleSave} 
        />
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={4} direction="column" alignItems="center">
          
          <Grid sx={{ width: '100%', maxWidth: '960px' }}>
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
          
          <Grid sx={{ width: '100%', maxWidth: '960px' }}>
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