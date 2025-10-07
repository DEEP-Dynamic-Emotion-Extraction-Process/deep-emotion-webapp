// src/components/analysis/InsightsCharts.jsx
import React, { useMemo } from 'react';
import { Typography, Box, useTheme, Grid, Paper } from '@mui/material';

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
  'Feliz': '#4caf50',
  'Triste': '#2196f3',
  'Raiva': '#f44336',
  'Surpreso': '#ff9800',
  'Neutro': '#9e9e9e',
  'Medo': '#9c27b0',
  'Nojo': '#cddc39',
};

const ALL_EMOTIONS = ['HAPPY', 'SAD', 'ANGRY', 'SURPRISED', 'NEUTRAL', 'FEAR', 'DISGUST'];

export const InsightsCharts = ({ frames }) => {

  console.log(frames);

  return (
    <>
    
    </>
  );
};