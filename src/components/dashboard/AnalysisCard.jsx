// src/components/dashboard/AnalysisCard.jsx
import React from 'react';
import { ListItem, ListItemButton, ListItemText, ListItemIcon, Chip, Box, LinearProgress } from '@mui/material'; // Adicione Box e LinearProgress
import MovieIcon from '@mui/icons-material/Movie';
import { Link, useLocation } from 'react-router-dom';

const statusStyles = {
  COMPLETED: { label: 'Concluído', color: 'success' },
  PROCESSING: { label: 'A processar', color: 'warning' },
  PENDING: { label: 'Pendente', color: 'info' },
  FAILED: { label: 'Falhou', color: 'error' },
};

export const AnalysisCard = ({ analysis }) => {
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
      {/* --- BARRA DE PROGRESSO --- */}
      {analysis.status === 'PROCESSING' && (
        <Box sx={{ px: 2, pb: 1 }}>
          <LinearProgress variant="determinate" value={analysis.progress || 0} />
        </Box>
      )}
    </ListItem>
  );
};