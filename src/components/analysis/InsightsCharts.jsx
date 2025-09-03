// src/components/analysis/InsightsCharts.jsx
import React, { useMemo } from 'react';
import { Typography, Box, useTheme } from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

/**
 * Processa os dados dos frames para agregar a contagem de cada emoção.
 * @param {Array} frames - A lista de frames com dados de emoção.
 * @returns {Array} - Um array de objetos para ser usado pelos gráficos.
 */
const processFrameData = (frames = []) => {
  if (!frames || frames.length === 0) {
    return [];
  }

  const emotionCounts = frames.reduce((acc, frame) => {
    acc[frame.emotion] = (acc[frame.emotion] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(emotionCounts).map(([emotion, count]) => ({
    name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
    Contagem: count,
  })).sort((a, b) => b.Contagem - a.Contagem);
};


export const InsightsCharts = ({ frames }) => {
  const theme = useTheme(); // Acede ao tema do MUI para usar as cores

  // useMemo garante que os dados só são reprocessados se os frames mudarem
  const chartData = useMemo(() => processFrameData(frames), [frames]);

  if (chartData.length === 0) {
    return <Typography color="text.secondary">Não há dados de emoção para exibir.</Typography>;
  }

  return (
    <Box>
      {/* Gráfico de Barras */}
      <Typography variant="h6" gutterBottom>Distribuição de Emoções</Typography>
      <Box sx={{ height: 300, mb: 4 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis type="number" stroke={theme.palette.text.secondary} />
            <YAxis type="category" dataKey="name" stroke={theme.palette.text.secondary} width={80} />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
              contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}
            />
            <Bar dataKey="Contagem" fill={theme.palette.primary.main} />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Gráfico de Radar */}
      <Typography variant="h6" gutterBottom>Perfil Emocional</Typography>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke={theme.palette.divider} />
            <PolarAngleAxis dataKey="name" stroke={theme.palette.text.secondary} />
            <PolarRadiusAxis angle={30} domain={[0, 'dataMax + 1']} tick={false} axisLine={false} />
            <Radar name="Frames" dataKey="Contagem" stroke={theme.palette.secondary.main} fill={theme.palette.secondary.main} fillOpacity={0.6} />
            <Tooltip 
              contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};