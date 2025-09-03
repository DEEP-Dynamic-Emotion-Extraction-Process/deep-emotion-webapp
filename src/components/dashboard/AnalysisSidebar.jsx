// src/components/dashboard/AnalysisSidebar.jsx
import React, { useState, useEffect } from 'react';
import { Box, Drawer, List, Toolbar, Divider, Typography, Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings';

import { getUserVideos } from '../../api/videoService'; // Este caminho está correto
import { AnalysisCard } from './AnalysisCard';

const drawerWidth = 280; // Aumentei um pouco a largura

export const AnalysisSidebar = () => {
  const [analyses, setAnalyses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const userVideos = await getUserVideos();
        setAnalyses(userVideos);
      } catch (err) {
        setError('Não foi possível carregar as análises.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyses();
  }, []); // O array vazio garante que isto só é executado uma vez

  let content;
  if (isLoading) {
    content = <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress size={24} /></Box>;
  } else if (error) {
    content = <Typography color="error" sx={{ p: 2 }}>{error}</Typography>;
  } else {
    content = (
      <List>
        {analyses.map((analysis) => (
          <AnalysisCard key={analysis.id} analysis={analysis} />
        ))}
      </List>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ p: 2 }}>
        <Button 
          variant="contained" 
          fullWidth 
          startIcon={<AddCircleOutlineIcon />}
          component={Link}
          to="/dashboard"
        >
          Nova Análise
        </Button>
      </Box>
      <Divider />
      {content}
      <Box sx={{ marginTop: 'auto' }}> {/* Empurra o item para o fundo */}
        <Divider />
        <List>
            <ListItem disablePadding>
                <ListItemButton component={Link} to="/settings">
                    <ListItemIcon><SettingsIcon /></ListItemIcon>
                    <ListItemText primary="Configurações" />
                </ListItemButton>
            </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};