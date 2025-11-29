// src/components/dashboard/AnalysisCard.jsx
import React from 'react';
import { ListItem, ListItemButton, ListItemText, ListItemIcon, Chip, Box, LinearProgress } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const AnalysisCard = ({ analysis }) => {
  const { t } = useTranslation();
  
  const statusStyles = {
    COMPLETED: { label: t('status.COMPLETED'), color: 'success' },
    PROCESSING: { label: t('status.PROCESSING'), color: 'warning' },
    PENDING: { label: t('status.PENDING'), color: 'info' },
    FAILED: { label: t('status.FAILED'), color: 'error' },
  };

  const location = useLocation();
  const isActive = location.pathname === `/dashboard/analysis/${analysis.id}`;
  const statusInfo = statusStyles[analysis.status] || { label: analysis.status, color: 'default' };

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        component={Link}
        to={`/dashboard/analysis/${analysis.id}`}
        selected={isActive}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          <MovieIcon />
        </ListItemIcon>
        <ListItemText
          primary={analysis.title}
        />
      </ListItemButton>
      {analysis.status === 'PROCESSING' && (
        <Box sx={{ px: 2, pb: 1 }}>
          <LinearProgress variant="determinate" value={analysis.progress || 0} />
        </Box>
      )}
    </ListItem>
  );
};