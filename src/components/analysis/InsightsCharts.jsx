// src/components/analysis/InsightsCharts.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';
import { BarChart, Gauge, RadarChart, RadarAxis } from '@mui/x-charts';

// --- Constantes e Funções de Utilidade ---

const ALL_EMOTIONS = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprised'];

const EMOTION_MAP = {
  angry: 'Raiva',
  disgust: 'Nojo',
  fear: 'Medo',
  happy: 'Feliz',
  neutral: 'Neutro',
  sad: 'Triste',
  surprised: 'Surpreso'
};

const EMOTION_COLORS = {
  'Raiva': '#f44336',
  'Nojo': '#cddc39',
  'Medo': '#9c27b0',
  'Feliz': '#4caf50',
  'Neutro': '#9e9e9e',
  'Triste': '#2196f3',
  'Surpreso': '#ff9800'
};

// Função para clarear uma cor hexadecimal (para as barras secundárias)
const lightenColor = (color, percent) => {
  const num = parseInt(color.slice(1), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
  return `#${(0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)}`;
};

// Função para obter a cor do gradiente para o Gauge
const getGaugeColor = (value) => {
  if (value < 40) return '#f44336'; // Vermelho
  if (value < 70) return '#ff9800'; // Amarelo/Laranja
  return '#4caf50'; // Verde
};

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

  useEffect(() => {
    if (!frames || frames.length === 0) {
      setIsLoading(false);
      setChartData(null);
      return;
    }
    const emotionStats = {};
    ALL_EMOTIONS.forEach(emotion => {
      emotionStats[emotion] = {
        primaryCount: 0,
        secondaryCount: 0,
        primaryConfidenceSum: 0,
      };
    });
    const frameCount = frames.length;
    frames.forEach(frame => {
      if (frame && frame.emotions && frame.confidences) {
        const sortedEmotions = frame.emotions
          .map((emotion, index) => ({ emotion, confidence: frame.confidences[index] }))
          .sort((a, b) => b.confidence - a.confidence);
        if (sortedEmotions.length > 0) {
          const primary = sortedEmotions[0];
          emotionStats[primary.emotion].primaryCount++;
          emotionStats[primary.emotion].primaryConfidenceSum += primary.confidence;
        }
        if (sortedEmotions.length > 1) {
          const secondary = sortedEmotions[1];
          emotionStats[secondary.emotion].secondaryCount++;
        }
      }
    });
    const predominantEmotion = Object.keys(emotionStats).reduce((a, b) =>
      emotionStats[a].primaryCount > emotionStats[b].primaryCount ? a : b
    );
    const averageConfidencesByEmotion = ALL_EMOTIONS.map(emotion => {
      const stats = emotionStats[emotion];
      return stats.primaryCount === 0 ? 0 : stats.primaryConfidenceSum / stats.primaryCount;
    });
    const validAverages = averageConfidencesByEmotion.filter(avg => avg > 0);
    const totalAverage = validAverages.length > 0
      ? (validAverages.reduce((sum, avg) => sum + avg, 0) / validAverages.length) * 100
      : 0;
    const emotionPercentages = ALL_EMOTIONS.map(emotion => {
      const primaryPercentage = (emotionStats[emotion].primaryCount / frameCount) * 100;
      const secondaryPercentage = (emotionStats[emotion].secondaryCount / frameCount) * 100;
      return [primaryPercentage, secondaryPercentage];
    });
    setChartData({
      frameCount,
      predominantEmotion,
      averageConfidence: totalAverage,
      emotionPercentages,
    });
    setIsLoading(false);
  }, [frames]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress /> <Typography sx={{ ml: 2 }}>A analisar dados...</Typography>
      </Box>
    );
  }

  if (!chartData) {
    return <Typography>Não há dados suficientes para exibir os insights.</Typography>;
  }

  // Dados para o BarChart
  const barChartColors = ALL_EMOTIONS.flatMap((emotion, index) => [
    {
      angry: { primary: EMOTION_COLORS[EMOTION_MAP[emotion]], secondary: lightenColor(EMOTION_COLORS[EMOTION_MAP[emotion]], 20) },
      disgust: { primary: EMOTION_COLORS[EMOTION_MAP[emotion]], secondary: lightenColor(EMOTION_COLORS[EMOTION_MAP[emotion]], 20) },
      fear: { primary: EMOTION_COLORS[EMOTION_MAP[emotion]], secondary: lightenColor(EMOTION_COLORS[EMOTION_MAP[emotion]], 20) },
      happy: { primary: EMOTION_COLORS[EMOTION_MAP[emotion]], secondary: lightenColor(EMOTION_COLORS[EMOTION_MAP[emotion]], 20) },
      neutral: { primary: EMOTION_COLORS[EMOTION_MAP[emotion]], secondary: lightenColor(EMOTION_COLORS[EMOTION_MAP[emotion]], 20) },
      sad: { primary: EMOTION_COLORS[EMOTION_MAP[emotion]], secondary: lightenColor(EMOTION_COLORS[EMOTION_MAP[emotion]], 20) },
      surprised: { primary: EMOTION_COLORS[EMOTION_MAP[emotion]], secondary: lightenColor(EMOTION_COLORS[EMOTION_MAP[emotion]], 20) },
    }
  ])

  console.log('Bar Chart Series:', barChartColors);

  const barSeries = ALL_EMOTIONS.flatMap((emotion, index) => {
    // Pega os valores de porcentagem para evitar repetição
    const primaryValue = chartData.emotionPercentages[index][0] || 0;
    const secondaryValue = chartData.emotionPercentages[index][1] || 0;

    return [
      {
        data: ALL_EMOTIONS.map((_, i) =>
          // Converte para 2 casas decimais e depois de volta para número
          i === index ? parseFloat(primaryValue.toFixed(2)) : 0
        ),
        label: `Primária (${EMOTION_MAP[emotion]})`,
        id: `pvId-${index}`,
        yAxisId: 'leftAxisId',
        color: EMOTION_COLORS[EMOTION_MAP[emotion]],
        stack: 'pv-stack',
        highlightScope: { highlight: 'item' },
        // Opcional, mas recomendado: formata o valor no tooltip
        valueFormatter: (value) => `${value.toFixed(2)}%`,
      },
      {
        data: ALL_EMOTIONS.map((_, i) =>
          // Usando o operador unário (+) que é uma alternativa a parseFloat()
          i === index ? +secondaryValue.toFixed(2) : 0
        ),
        label: `Secundária (${EMOTION_MAP[emotion]})`,
        id: `uvId-${index}`,
        yAxisId: 'leftAxisId',
        color: lightenColor(EMOTION_COLORS[EMOTION_MAP[emotion]], 20),
        stack: 'uv-stack',
        highlightScope: { highlight: 'item' },
        // Opcional, mas recomendado: formata o valor no tooltip
        valueFormatter: (value) => `${value.toFixed(2)}%`,
      }
    ];
  });

  console.log('Bar Series:', barSeries);

  // Dados para o RadarChart (filtrando emoções com 0%)
  const radarMetrics = [];
  const radarPrimaryData = [];
  const radarSecondaryData = [];

  chartData.emotionPercentages.forEach(([primary, secondary], index) => {
    if (primary > 0 || secondary > 0) {
      radarMetrics.push(EMOTION_MAP[ALL_EMOTIONS[index]]);
      // CONVERSÃO: Converte para 2 casas decimais e mantém como NÚMERO
      radarPrimaryData.push(parseFloat(primary.toFixed(2)));
      radarSecondaryData.push(parseFloat(secondary.toFixed(2)));
    }
  });

  const radarSeries = [
    {
      data: radarPrimaryData,
      label: 'Primária',
      area: true,
      fillArea: true,
      color: 'rgba(76, 175, 80, 0.6)',
      valueFormatter: (value) => `${value.toFixed(2)}%`
    },
    {
      data: radarSecondaryData,
      label: 'Secundária',
      area: true,
      fillArea: true,
      color: 'rgba(255, 193, 7, 0.6)',
      valueFormatter: (value) => `${value.toFixed(2)}%`
    }
  ];

  return (
    <>
      <Box sx={componentStyles.kpiContainer}>
        {/* KPI: Emoção Predominante */}
        <Box sx={componentStyles.kpiItem}>
          <Typography variant="h6" sx={componentStyles.kpiTitle}>Emoção Predominante</Typography>
          <Typography variant="h3" sx={{ ...componentStyles.kpiValue, color: EMOTION_COLORS[EMOTION_MAP[chartData.predominantEmotion]] }}>
            {EMOTION_MAP[chartData.predominantEmotion]}
          </Typography>
        </Box>

        {/* KPI: Imagens Analisadas */}
        <Box sx={componentStyles.kpiItem}>
          <Typography variant="h6" sx={componentStyles.kpiTitle}>Imagens Analisadas</Typography>
          <Typography variant="h3" sx={componentStyles.kpiValue}>
            {chartData.frameCount}
          </Typography>
        </Box>

        {/* KPI: Confiabilidade com gradiente */}
        <Box sx={componentStyles.kpiItem}>
          <Typography variant="h6" sx={componentStyles.kpiTitle}>Confiabilidade</Typography>
          <Gauge
            height={130}
            value={Math.round(chartData.averageConfidence)}
            startAngle={-110}
            endAngle={110}
            sx={{
              ...componentStyles.chartStyling,
              '& .MuiGauge-valueArc': { fill: getGaugeColor(chartData.averageConfidence) },
              '& .MuiGauge-valueText': {
                fontSize: 32,
                transform: 'translate(0, -10px)',
                fill: getGaugeColor(chartData.averageConfidence),
              }
            }}
            text={({ value }) => `${value}%`}
          />
        </Box>
      </Box>

      <Box sx={componentStyles.chartsContainer}>
        <Box sx={componentStyles.mainChartContainer}>
          <Typography variant="h5" sx={{ ...componentStyles.chartTitle, mb: 6 }}>Frequência de <br />Emoções Detetadas</Typography>
          <BarChart
            height={500}
            series={barSeries}
            xAxis={[{ data: ALL_EMOTIONS.map(e => EMOTION_MAP[e]), id: 'x-axis-id', scaleType: 'band' }]}
            yAxis={[
              { max: 100, min: 0 },
              { id: 'leftAxisId' },
              { id: 'rightAxisId', position: 'right' },
            ]}
            sx={componentStyles.chartStyling}
            hideLegend={true}
            slotProps={{
              tooltip: {
                trigger: 'item',
              },
            }}
            margin={0}
          />
        </Box>
        {/* Gráfico de Radar */}
        <Box sx={componentStyles.sideContainer}>
          <Box sx={componentStyles.sideChartContainer}>
            <Typography variant="h6" sx={componentStyles.chartTitle}>Radar de Frequência</Typography>
            {radarPrimaryData.length > 0 ? (
              <RadarChart
                series={radarSeries}
                shape='circular' height={220}
                radar={{ max: 100, metrics: radarMetrics }}
                sx={componentStyles.chartStyling}
              >
                <RadarAxis
                  metric={radarMetrics[0]}
                  divisions={4}
                  labelOrientation="horizontal"
                  textAnchor="start"
                  angle="30"
                />
              </RadarChart>
            ) : (
              <Typography>Sem dados para o radar.</Typography>
            )}
          </Box>
          <Box sx={componentStyles.sideChartContainer}>
            <Typography variant="h6" sx={componentStyles.chartTitle}>Radar de Frequência</Typography>
            {radarPrimaryData.length > 0 ? (
              <RadarChart
                series={radarSeries}
                shape='circular' height={220}
                radar={{ max: 100, metrics: radarMetrics }}
                sx={componentStyles.chartStyling}
              >
                <RadarAxis
                  metric={radarMetrics[0]}
                  divisions={4}
                  labelOrientation="horizontal"
                  textAnchor="start"
                  angle="30"
                />
              </RadarChart>
            ) : (
              <Typography>Sem dados para o radar.</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};