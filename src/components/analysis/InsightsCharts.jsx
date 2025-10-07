// src/components/analysis/InsightsCharts.jsx
import React, { useMemo } from 'react';
import { Typography, Box, useTheme, Grid, Paper } from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
  PieChart, Pie,
  AreaChart, Area
} from 'recharts';

// --- TRADUÇÃO E MAPEAMENTO DE CORES (Mantido do seu original) ---
const EMOTION_MAP = {
  HAPPY: 'Feliz',
  SAD: 'Triste',
  ANGRY: 'Raiva',
  SURPRISED: 'Surpreso',
  NEUTRAL: 'Neutro',
  FEAR: 'Medo',
  DISGUST: 'Nojo',
};

const EMOTION_COLORS = {
  'Feliz': '#4caf50',     // Verde mais vibrante
  'Triste': '#2196f3',    // Azul padrão
  'Raiva': '#f44336',     // Vermelho padrão
  'Surpreso': '#ff9800',  // Laranja
  'Neutro': '#9e9e9e',    // Cinzento
  'Medo': '#9c27b0',      // Roxo
  'Nojo': '#cddc39',      // Lima
};

const ALL_EMOTIONS = ['HAPPY', 'SAD', 'ANGRY', 'SURPRISED', 'NEUTRAL', 'FEAR', 'DISGUST'];

// --- PROCESSAMENTO DE DADOS (Ligeiramente ajustado) ---

// Prepara os dados para o Gráfico de Barras e Rosca
const processOverallData = (frames = []) => {
  const emotionCounts = frames.reduce((acc, frame) => {
    acc[frame.emotion] = (acc[frame.emotion] || 0) + 1;
    return acc;
  }, {});
  
  const data = ALL_EMOTIONS.map(emotion => ({
    name: EMOTION_MAP[emotion] || emotion,
    "Duração (frames)": emotionCounts[emotion] || 0,
  }));

  // Ordena os dados para que o gráfico de barras fique mais legível
  return data.sort((a, b) => b["Duração (frames)"] - a["Duração (frames)"]);
};

// Prepara os dados para a Linha do Tempo (Gráfico de Área)
const processTemporalData = (frames = []) => {
    if (!frames || frames.length === 0) return [];
    const secondsMap = {};
    frames.forEach(frame => {
        const second = Math.floor(frame.video_timestamp_sec);
        if (!secondsMap[second]) {
            secondsMap[second] = {};
            ALL_EMOTIONS.forEach(e => secondsMap[second][EMOTION_MAP[e]] = 0);
        }
        secondsMap[second][EMOTION_MAP[frame.emotion]] += 1; // Conta frames por segundo
    });
    return Object.entries(secondsMap).map(([second, counts]) => ({
        time: parseInt(second),
        ...counts
    }));
};


export const InsightsCharts = ({ frames }) => {
  const theme = useTheme();
  
  // Usamos useMemo para otimização, como já estava a fazer.
  const overallData = useMemo(() => processOverallData(frames), [frames]);
  const temporalData = useMemo(() => processTemporalData(frames), [frames]);
  
  const pieChartData = overallData.filter(data => data["Duração (frames)"] > 0);

  if (pieChartData.length === 0) {
    return <Typography color="text.secondary">Não há dados de emoção para exibir.</Typography>;
  }

  const tooltipStyle = {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary
  };

  const renderColorfulLegendText = (value, entry) => (
    <span style={{ color: entry.color }}>{value}</span>
  );

  return (
    <Grid container spacing={4} justifyContent="center">

      {/* GRÁFICO 1: Linha do Tempo Emocional (Área Empilhada) */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">Linha do Tempo Emocional</Typography>
            <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={temporalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="time" unit="s" stroke={theme.palette.text.secondary} />
                <YAxis label={{ value: 'Frames', angle: -90, position: 'insideLeft', fill: theme.palette.text.secondary }} stroke={theme.palette.text.secondary} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend formatter={renderColorfulLegendText} />
                {Object.entries(EMOTION_COLORS).map(([name, color]) => (
                    <Area key={name} type="monotone" dataKey={name} stackId="1" stroke={color} fill={color} fillOpacity={0.7} />
                ))}
                </AreaChart>
            </ResponsiveContainer>
            </Box>
        </Paper>
      </Grid>
      
      {/* GRÁFICO 2: Predominância das Emoções (Barras Horizontais) */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">Predominância das Emoções</Typography>
            <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={pieChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis type="number" stroke={theme.palette.text.secondary} />
                    <YAxis type="category" dataKey="name" width={80} stroke={theme.palette.text.secondary} />
                    <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} contentStyle={tooltipStyle} />
                    <Bar dataKey="Duração (frames)" fill="#8884d8">
                        {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.name]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            </Box>
        </Paper>
      </Grid>

      {/* GRÁFICO 3: Proporção Geral (Rosca/Donut) */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">Proporção Geral</Typography>
            <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="Duração (frames)" nameKey="name">
                        {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.name]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend formatter={renderColorfulLegendText} />
                </PieChart>
            </ResponsiveContainer>
            </Box>
        </Paper>
      </Grid>

    </Grid>
  );
};