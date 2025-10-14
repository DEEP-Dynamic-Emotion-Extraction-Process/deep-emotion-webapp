// src/components/analysis/InsightsCharts.jsx
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';
import { RadarChart, Gauge, BarChart } from '@mui/x-charts';

// --- Constantes (sem alterações) ---
const EMOTION_MAP = {
  HAPPY: 'Feliz', SAD: 'Triste', ANGRY: 'Raiva', SURPRISED: 'Surpreso',
  NEUTRAL: 'Neutro', FEAR: 'Medo', DISGUST: 'Nojo', UNDEFINED: 'Não Identificado'
};
const EMOTION_COLORS = {
  'Feliz': '#4caf50',
  'Triste': '#2196f3',
  'Raiva': '#f44336',
  'Surpreso': '#ff9800',
  'Neutro': '#9e9e9e',
  'Medo': '#9c27b0',
  'Nojo': '#cddc39',
  'Não Identificado': '#607d8b'
};

const ALL_EMOTIONS = ['HAPPY', 'SAD', 'ANGRY', 'SURPRISED', 'NEUTRAL', 'FEAR', 'DISGUST', 'UNDEFINED'];

const styles = (theme) => ({
  kpiContainer: {
    mt: 4,
    mb: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    flexWrap: 'wrap',
    gap: 3
  },
  kpiItem: {
    textAlign: 'center',
    flex: '1 1 250px',
    maxWidth: '300px',
    backgroundColor: 'rgba(40, 40, 40, 0.8)',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', '&:hover':
      { transform: 'translateY(-4px)', boxShadow: `0 8px 16px rgba(0,0,0,0.2)` }
  },
  kpiTitle: {
    color: theme.palette.text.secondary,
    fontWeight: '500'
  },
  kpiValue: {
    fontWeight: 'bold',
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chartsContainer: {
    mt: 4,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 3
  },
  mainChartContainer: {
    flex: '2 1 500px',
    backgroundColor: 'rgba(40, 40, 40, 0.8)',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '12px',
    padding: '24px'
  },
  sideContainer: {
    flex: '1 1 300px',
    display: 'flex',
    flexDirection: 'column',
    gap: 3
  },
  sideChartContainer: {
    backgroundColor: 'rgba(40, 40, 40, 0.8)',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '12px',
    padding: '24px',
    flexGrow: 1
  },
  chartTitle: {
    textAlign: 'center',
    marginBottom: '16px',
    color: theme.palette.text.primary
  },
  chartStyling: {
    '& .MuiChartsAxis-tickLabel': { fill: theme.palette.text.secondary },
    '& .MuiChartsAxis-line': { stroke: theme.palette.divider },
    '& .MuiChartsGrid-line': { stroke: 'rgba(255, 255, 255, 0.08)' }
  },
});

export const InsightsCharts = ({ frames }) => {
  const theme = useTheme();
  const componentStyles = styles(theme);

  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('Frames recebidos para análise:', frames);

  useEffect(() => {
    if (!frames || frames.length === 0) {
      setIsLoading(false);
      setChartData(null);
      return;
    }

    const emotionCounts = {};
    let totalConfidence = 0;
    let validFrameCount = 0;

    ALL_EMOTIONS.forEach(e => { emotionCounts[e] = 0; });

    frames.forEach(frame => {
      if (frame && frame.emotion && ALL_EMOTIONS.includes(frame.emotion) && typeof frame.confidence === 'number') {
        emotionCounts[frame.emotion]++;
        totalConfidence += frame.confidence;
        validFrameCount++; 
      }
    });

    if (validFrameCount === 0) {
      setIsLoading(false);
      setChartData(null);
      return; 
    }

    const predominantEmotion = Object.keys(emotionCounts).reduce((a, b) =>
      emotionCounts[a] > emotionCounts[b] ? a : b
    );

    const averageConfidence = (totalConfidence / validFrameCount) * 100;
    const emotionPercentages = ALL_EMOTIONS.map(emotion =>
      (emotionCounts[emotion] / validFrameCount) * 100
    );

    setChartData({
      frameCount: frames.length,
      predominantEmotion,
      averageConfidence,
      emotionPercentages,
    });

    setIsLoading(false);
  }, [frames]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress /> <Typography sx={{ ml: 2 }}>Analisando dados...</Typography>
      </Box>
    );
  }

  if (!chartData) {
    return <Typography>Não há dados suficientes para exibir os insights.</Typography>;
  }

  const barChartXAxisData = ALL_EMOTIONS.map(e => EMOTION_MAP[e]);
  const barSeriesDataWithColor = chartData.emotionPercentages.map((percentage, index) => ({
    percentage: percentage,
    color: EMOTION_COLORS[barChartXAxisData[index]] || '#808080',
  }));

  return (
    <>
      <Box sx={componentStyles.kpiContainer}>
        <Box sx={componentStyles.kpiItem}>
          <Typography variant="h6" sx={componentStyles.kpiTitle}>Emoção Predominante</Typography>
          <Typography variant="h3" sx={{ ...componentStyles.kpiValue, color: EMOTION_COLORS[EMOTION_MAP[chartData.predominantEmotion]] }}>
            {EMOTION_MAP[chartData.predominantEmotion]}
          </Typography>
        </Box>

        <Box sx={componentStyles.kpiItem}>
          <Typography variant="h6" sx={componentStyles.kpiTitle}>Frames Analisados</Typography>
          <Typography variant="h3" sx={componentStyles.kpiValue}>
            {chartData.frameCount}
          </Typography>
        </Box>

        <Box sx={componentStyles.kpiItem}>
          <Typography variant="h6" sx={componentStyles.kpiTitle}>Confiabilidade Média</Typography>
          <Gauge height={130} value={Math.round(chartData.averageConfidence)} startAngle={-110} endAngle={110}
            sx={{ ...componentStyles.chartStyling, ['& .MuiGauge-valueText']: { fontSize: 32, transform: 'translate(0, -10px)', fill: '#FFF' } }}
            text={({ value }) => `${value}%`}
          />
        </Box>
      </Box>

      <Box sx={componentStyles.chartsContainer}>
        <Box sx={componentStyles.mainChartContainer}>
          <Typography variant="h6" sx={componentStyles.chartTitle}>Frequência de Emoções Detectadas</Typography>
          <BarChart
            height={450}
            series={[{ data: barSeriesDataWithColor.map(value => value.percentage) }]}
            xAxis={[{
              data: barChartXAxisData, scaleType: 'band', label: 'Emoções',
              colorMap: {
                type: 'ordinal',
                colors: barSeriesDataWithColor.map(value => value.color)
              }
            }]}
            yAxis={[{ max: 100, min: 0 }]}
            grid={{ horizontal: true }}
            sx={componentStyles.chartStyling}
          />
        </Box>
        <Box sx={componentStyles.sideContainer}>
          <Box sx={componentStyles.sideChartContainer}>
            <Typography variant="h6" sx={componentStyles.chartTitle}>Radar de Frequência</Typography>
            <RadarChart
              series={[{ data: chartData.emotionPercentages, area: true, color: theme.palette.primary.main }]}
              shape='circular' height={220}
              radar={{ max: 100, metrics: ALL_EMOTIONS.map(emotion => EMOTION_MAP[emotion]) }}
              sx={componentStyles.chartStyling}
            />
          </Box>
          <Box sx={componentStyles.sideChartContainer}>
            <Typography variant="h6" sx={componentStyles.chartTitle}>Radar de Frequência</Typography>
            <RadarChart
              series={[{ data: chartData.emotionPercentages, area: true, color: theme.palette.primary.main }]}
              shape='circular' height={220}
              radar={{ max: 100, metrics: ALL_EMOTIONS.map(emotion => EMOTION_MAP[emotion]) }}
              sx={componentStyles.chartStyling}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};