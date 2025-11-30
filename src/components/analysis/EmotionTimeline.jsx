// src/components/analysis/EmotionTimeline.jsx
import React from 'react';
import { Box, Tooltip, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

const emotionColorMapping = {
  HAPPY: '#2e7d32',       // Verde
  SAD: '#1976d2',         // Azul
  ANGRY: '#d32f2f',        // Vermelho
  SURPRISED: '#ed6c02',   // Laranja
  NEUTRAL: '#757575',     // Cinzento
  FEAR: '#8e24aa',        // Roxo
  DISGUST: '#cddc39',     // Lima
  DEFAULT: '#424242'      // Cinzento escuro
};

export const EmotionTimeline = ({ frames, duration, onSeek }) => {
  const { t } = useTranslation();

  const theme = useTheme();

  if (!frames || frames.length === 0) {
    return null;
  }

  const handleTimelineClick = (event) => {
    if (typeof onSeek !== 'function') return;

    const timeline = event.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const clickPosition = event.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    const seekTime = duration * percentage;
    
    onSeek(seekTime);
  };

  return (
    <Tooltip title={t('timeline.clickToView')} followCursor>
      <Box
        onClick={handleTimelineClick}
        sx={{
          width: '100%',
          height: '40px',
          backgroundColor: theme.palette.background.default,
          display: 'flex',
          cursor: 'pointer',
          borderRadius: '4px',
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        {frames.map((frame, index) => {
          let dominantEmotion = 'DEFAULT';
          if (frame.emotions && frame.confidences) {
            let maxConfidence = -1;
            let dominantIndex = -1;
            
            frame.confidences.forEach((confidence, idx) => {
              if (confidence > maxConfidence) {
                maxConfidence = confidence;
                dominantIndex = idx;
              }
            });

            if (dominantIndex !== -1) {
              dominantEmotion = frame.emotions[dominantIndex].toUpperCase();
            }
          }

          const nextFrame = frames[index + 1];
          const startTime = frame.video_timestamp_sec;
          const endTime = nextFrame ? nextFrame.video_timestamp_sec : duration;
          const segmentDuration = endTime - startTime;
          
          const segmentWidth = (segmentDuration / duration) * 100;
          const color = emotionColorMapping[dominantEmotion] || emotionColorMapping.DEFAULT;

          return (
            <Tooltip key={frame.id} title={`${t(`emotions.${dominantEmotion.toLowerCase()}`)} ${t('timeline.in')} ${startTime.toFixed(2)}s`}>
              <Box
                sx={{
                  width: `${segmentWidth}%`,
                  height: '100%',
                  backgroundColor: color,
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scaleY(1.1)',
                  }
                }}
              />
            </Tooltip>
          );
        })}
      </Box>
    </Tooltip>
  );
};