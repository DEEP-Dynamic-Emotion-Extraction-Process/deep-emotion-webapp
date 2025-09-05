// src/components/analysis/InsightsCharts.jsx
import React, { useMemo } from 'react';
import { Typography, Box, useTheme, Grid } from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area
} from 'recharts';

// --- TRADUÇÃO E MAPEAMENTO DE CORES ---
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
  'Feliz': '#2e7d32',
  'Triste': '#1976d2',
  'Raiva': '#d32f2f',
  'Surpreso': '#ed6c02',
  'Neutro': '#757575',
  'Medo': '#8e24aa',
  'Nojo': '#cddc39',
};

const ALL_EMOTIONS = ['HAPPY', 'SAD', 'ANGRY', 'SURPRISED', 'NEUTRAL', 'FEAR', 'DISGUST'];

const processOverallData = (frames = []) => {
  const emotionCounts = frames.reduce((acc, frame) => {
    acc[frame.emotion] = (acc[frame.emotion] || 0) + 1;
    return acc;
  }, {});
  
  return ALL_EMOTIONS.map(emotion => ({
    name: EMOTION_MAP[emotion] || emotion,
    Contagem: emotionCounts[emotion] || 0,
  }));
};

const processTemporalData = (frames = []) => {
    if (!frames || frames.length === 0) return [];
    const secondsMap = {};
    frames.forEach(frame => {
        const second = Math.floor(frame.video_timestamp_sec);
        if (!secondsMap[second]) {
            secondsMap[second] = {};
            ALL_EMOTIONS.forEach(e => secondsMap[second][EMOTION_MAP[e]] = 0);
        }
        secondsMap[second][EMOTION_MAP[frame.emotion]] += 1;
    });
    return Object.entries(secondsMap).map(([second, counts]) => ({
        time: parseInt(second),
        ...counts
    }));
};

export const InsightsCharts = ({ frames }) => {
  const theme = useTheme();
  
  const overallData = useMemo(() => processOverallData(frames), [frames]);
  const temporalData = useMemo(() => processTemporalData(frames), [frames]);
  
  const pieChartData = overallData.filter(data => data.Contagem > 0);

  if (pieChartData.length === 0) {
    return <Typography color="text.secondary">Não há dados de emoção para exibir.</Typography>;
  }

  const tooltipStyle = {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary
  };

  // --- FUNÇÃO PARA RENDERIZAR A LEGENDA COLORIDA ---
  const renderColorfulLegendText = (value, entry) => {
    const { color } = entry;
    return <span style={{ color }}>{value}</span>;
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom align="center">Evolução no Tempo</Typography>
        <Box sx={{ height: 300, width: 400, mx: 'auto' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={temporalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="time" unit="s" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend formatter={renderColorfulLegendText} />
              {Object.values(EMOTION_MAP).map(translatedName => (
                <Area key={translatedName} type="monotone" dataKey={translatedName} name={translatedName} stackId="1" stroke={EMOTION_COLORS[translatedName]} fill={EMOTION_COLORS[translatedName]} fillOpacity={0.6} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom align="center">Distribuição</Typography>
        <Box sx={{ height: 300, width: 400, mx: 'auto' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pieChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} />
              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                contentStyle={tooltipStyle}
              />
              <Bar dataKey="Contagem" name="Contagem">
                  {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.name]} />
                  ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom align="center">Proporção</Typography>
        <Box sx={{ height: 300, width: 400, mx: 'auto' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="Contagem" nameKey="name">
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend formatter={renderColorfulLegendText} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom align="center">Perfil Emocional</Typography>
        <Box sx={{ height: 300, width: 400, mx: 'auto' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={overallData}>
              <PolarGrid stroke={theme.palette.divider} />
              <PolarAngleAxis dataKey="name" tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 'dataMax + 1']} tick={false} axisLine={false} />
              <Radar name="Frames" dataKey="Contagem" stroke={theme.palette.secondary.main} fill={theme.palette.secondary.main} fillOpacity={0.6} />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </Box>
      </Grid>
    </Grid>
  );
};