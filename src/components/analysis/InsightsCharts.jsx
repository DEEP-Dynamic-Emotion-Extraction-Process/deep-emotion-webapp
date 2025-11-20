// src/components/analysis/InsightsCharts.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';
import { BarChart, Gauge, RadarChart, RadarAxis } from '@mui/x-charts';

const ALL_EMOTIONS = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprised'];

const EMOTION_MAP = {
    angry: 'Angry',
    disgust: 'Disgust',
    fear: 'Fear',
    happy: 'Happy',
    neutral: 'Neutral',
    sad: 'Sad',
    surprised: 'Surprised'
};

const EMOTION_COLORS = {
    'Angry': '#f44336',
    'Disgust': '#cddc39',
    'Fear': '#9c27b0',
    'Happy': '#4caf50',
    'Neutral': '#9e9e9e',
    'Sad': '#2196f3',
    'Surprised': '#ff9800'
};

const lightenColor = (color, percent) => {
    const num = parseInt(color.slice(1), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
    return `#${(0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)}`;
};

const getGaugeColor = (value) => {
    if (value < 40) return '#f44336'; // Red
    if (value < 70) return '#ff9800'; // Yellow/Orange
    return '#4caf50'; // Green
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

        const maxStreaksInFrames = {};
        ALL_EMOTIONS.forEach(emotion => {
            maxStreaksInFrames[emotion] = 0;
        });
        let currentStreakEmotion = null;
        let currentStreakLength = 0;
        const FPS = 24;

        frames.forEach(frame => {
            let primaryEmotionThisFrame = null;

            if (frame && frame.emotions && frame.confidences) {
                const sortedEmotions = frame.emotions
                    .map((emotion, index) => ({ emotion, confidence: frame.confidences[index] }))
                    .sort((a, b) => b.confidence - a.confidence);

                if (sortedEmotions.length > 0) {
                    const primary = sortedEmotions[0];
                    primaryEmotionThisFrame = primary.emotion;
                    emotionStats[primary.emotion].primaryCount++;
                    emotionStats[primary.emotion].primaryConfidenceSum += primary.confidence;
                }
                if (sortedEmotions.length > 1) {
                    const secondary = sortedEmotions[1];
                    emotionStats[secondary.emotion].secondaryCount++;
                }
            }

            if (primaryEmotionThisFrame === currentStreakEmotion) {
                currentStreakLength++;
            } else {
                if (currentStreakEmotion !== null) {
                    if (currentStreakLength > maxStreaksInFrames[currentStreakEmotion]) {
                        maxStreaksInFrames[currentStreakEmotion] = currentStreakLength;
                    }
                }
                currentStreakEmotion = primaryEmotionThisFrame;
                currentStreakLength = primaryEmotionThisFrame !== null ? 1 : 0;
            }
        });

        if (currentStreakEmotion !== null) {
            if (currentStreakLength > maxStreaksInFrames[currentStreakEmotion]) {
                maxStreaksInFrames[currentStreakEmotion] = currentStreakLength;
            }
        }

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

        const durationChartData = [];
        ALL_EMOTIONS.forEach(emotion => {
            if (maxStreaksInFrames[emotion] > 0) {
                durationChartData.push({
                    emotion: EMOTION_MAP[emotion],
                    duration: parseFloat((maxStreaksInFrames[emotion] / FPS).toFixed(2)),
                    color: EMOTION_COLORS[EMOTION_MAP[emotion]]
                });
            }
        });
        durationChartData.sort((a, b) => b.duration - a.duration);

        setChartData({
            frameCount,
            predominantEmotion,
            averageConfidence: totalAverage,
            emotionPercentages,
            durationChart: {
                labels: durationChartData.map(d => d.emotion),
                data: durationChartData.map(d => d.duration),
                colors: durationChartData.map(d => d.color)
            }
        });
        setIsLoading(false);
    }, [frames]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <CircularProgress /> <Typography sx={{ ml: 2 }}>Analyzing data...</Typography>
            </Box>
        );
    }

    if (!chartData) {
        return <Typography>There is not enough data to display insights.</Typography>;
    }

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

    const barSeries = ALL_EMOTIONS.flatMap((emotion, index) => {
        const primaryValue = chartData.emotionPercentages[index][0] || 0;
        const secondaryValue = chartData.emotionPercentages[index][1] || 0;

        return [
            {
                data: ALL_EMOTIONS.map((_, i) =>
                    i === index ? parseFloat(primaryValue.toFixed(2)) : 0
                ),
                label: `Primary (${EMOTION_MAP[emotion]})`,
                id: `pvId-${index}`,
                yAxisId: 'leftAxisId',
                color: EMOTION_COLORS[EMOTION_MAP[emotion]],
                stack: 'pv-stack',
                highlightScope: { highlight: 'item' },
                valueFormatter: (value) => `${value.toFixed(2)}%`,
            },
            {
                data: ALL_EMOTIONS.map((_, i) =>
                    i === index ? +secondaryValue.toFixed(2) : 0
                ),
                label: `Secondary (${EMOTION_MAP[emotion]})`,
                id: `uvId-${index}`,
                yAxisId: 'leftAxisId',
                color: lightenColor(EMOTION_COLORS[EMOTION_MAP[emotion]], 20),
                stack: 'uv-stack',
                highlightScope: { highlight: 'item' },
                valueFormatter: (value) => `${value.toFixed(2)}%`,
            }
        ];
    });

    const radarMetrics = [];
    const radarPrimaryData = [];
    const radarSecondaryData = [];

    chartData.emotionPercentages.forEach(([primary, secondary], index) => {
        if (primary > 0 || secondary > 0) {
            radarMetrics.push(EMOTION_MAP[ALL_EMOTIONS[index]]);
            radarPrimaryData.push(parseFloat(primary.toFixed(2)));
            radarSecondaryData.push(parseFloat(secondary.toFixed(2)));
        }
    });

    const radarSeries = [
        {
            data: radarPrimaryData,
            label: 'Primary',
            area: true,
            fillArea: true,
            color: 'rgba(76, 175, 80, 0.6)',
            valueFormatter: (value) => `${value.toFixed(2)}%`
        },
        {
            data: radarSecondaryData,
            label: 'Secondary',
            area: true,
            fillArea: true,
            color: 'rgba(255, 193, 7, 0.6)',
            valueFormatter: (value) => `${value.toFixed(2)}%`
        }
    ];

    return (
        <>
            <Box sx={componentStyles.kpiContainer}>
                <Box sx={componentStyles.kpiItem}>
                    <Typography variant="h6" sx={componentStyles.kpiTitle}>Predominant Emotion</Typography>
                    <Typography variant="h3" sx={{ ...componentStyles.kpiValue, color: EMOTION_COLORS[EMOTION_MAP[chartData.predominantEmotion]] }}>
                        {EMOTION_MAP[chartData.predominantEmotion]}
                    </Typography>
                </Box>

                <Box sx={componentStyles.kpiItem}>
                    <Typography variant="h6" sx={componentStyles.kpiTitle}>Images Analyzed</Typography>
                    <Typography variant="h3" sx={componentStyles.kpiValue}>
                        {chartData.frameCount}
                    </Typography>
                </Box>

                <Box sx={componentStyles.kpiItem}>
                    <Typography variant="h6" sx={componentStyles.kpiTitle}>Confidence</Typography>
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
                    <Typography variant="h5" sx={{ ...componentStyles.chartTitle, mb: 6 }}>Frequency of <br />Detected Emotions</Typography>
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

                <Box sx={componentStyles.sideContainer}>

                    <Box sx={componentStyles.sideChartContainer}>
                        <Typography variant="h6" sx={componentStyles.chartTitle}>Frequency Radar</Typography>
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
                            <Typography>No data for the radar.</Typography>
                        )}
                    </Box>

                    <Box sx={componentStyles.sideChartContainer}>
                        <Typography variant="h6" sx={componentStyles.chartTitle}>
                            Peak Duration (Seconds)
                        </Typography>
                        {chartData.durationChart && chartData.durationChart.labels.length > 0 ? (
                            <BarChart
                                xAxis={[{
                                    data: chartData.durationChart.labels,
                                    scaleType: 'band',
                                    id: 'x-axis-id' 
                                }
                                ]}

                                yAxis={[{
                                    id: 'y-axis-id', 
                                    label: 'Seconds'
                                }]}

                                series={[{
                                    data: chartData.durationChart.data,
                                    xAxisId: 'x-axis-id', 
                                    yAxisId: 'y-axis-id', 
                                    valueFormatter: (value) => value ? `${value.toFixed(1)}s` : '0s',
                                }]}
                                

                                height={220}
                                sx={componentStyles.chartStyling}
                                hideLegend={true}
                            />
                        ) : (
                            <Typography>No duration data to display.</Typography>
                        )}
                    </Box>

                </Box>
            </Box>
        </>
    );
};