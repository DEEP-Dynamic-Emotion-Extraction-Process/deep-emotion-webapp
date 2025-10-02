// src/components/analysis/EmotionTimeline.jsx
import React from 'react';
import { Box, Tooltip, useTheme } from '@mui/material';

const emotionColorMapping = {
  HAPPY: '#2e7d32', // Verde
  SAD: '#1976d2',   // Azul
  ANGRY: '#d32f2f',  // Vermelho
  SURPRISED: '#ed6c02', // Laranja
  NEUTRAL: '#757575', // Cinzento
  FEAR: '#8e24aa',  // Roxo
  DISGUST: '#cddc39', // Lima
  default: '#424242'
};

export const EmotionTimeline = ({ frames, duration, onSeek }) => {
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
    <Tooltip title="Clique para navegar no vídeo" followCursor>
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
          const nextFrame = frames[index + 1];
          const startTime = frame.video_timestamp_sec;
          const endTime = nextFrame ? nextFrame.video_timestamp_sec : duration;
          const segmentDuration = endTime - startTime;
          
          const segmentWidth = (segmentDuration / duration) * 100;
          const color = emotionColorMapping[frame.emotion] || emotionColorMapping.default;

          return (
            <Tooltip key={frame.id} title={`${frame.emotion} em ${startTime.toFixed(2)}s`}>
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