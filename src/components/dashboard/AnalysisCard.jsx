// src/components/dashboard/AnalysisCard.jsx
import React from 'react';
import { ListItem, ListItemButton, ListItemText, ListItemIcon, Chip } from '@mui/material';
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
    <ListItem disablePadding>
      <ListItemButton
        component={Link}
        to={`/dashboard/analysis/${analysis.id}`}
        selected={isActive}
      >
        <ListItemIcon>
          <MovieIcon />
        </ListItemIcon>
        <ListItemText
          primary={analysis.title}
          secondary={<Chip label={statusInfo.label} color={statusInfo.color} size="small" />}
        />
      </ListItemButton>
    </ListItem>
  );
};