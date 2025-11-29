// src/components/dashboard/AnalysisSidebar.jsx
import React from 'react'; // Remova useState e useEffect
import { Box, Drawer, List, Toolbar, Divider, Typography, Button, CircularProgress, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings';

import { useAnalyses } from '../../contexts/AnalysisContext'; 
import { AnalysisCard } from './AnalysisCard';
import { useTranslation } from 'react-i18next';

const drawerWidth = 280;

export const AnalysisSidebar = () => {
  const { t } = useTranslation();
  const { analyses, isLoading, error } = useAnalyses();

  let content;
  if (isLoading) {
    content = <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress size={24} /></Box>;
  } else if (error) {
    content = <Typography color="error" sx={{ p: 2 }}>{error}</Typography>;
  } else {
    content = (
      <List sx={{ p: 0 }}>
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
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column' 
        },
      }}
    >
      <Toolbar />
      <Box sx={{ p: 2, flexShrink: 0 }}>
        <Button 
          variant="contained" 
          fullWidth 
          startIcon={<AddCircleOutlineIcon />}
          component={Link}
          to="/dashboard"
        >
          {t('app.newAnalysis')}
        </Button>
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {content}
      </Box>
      <Box sx={{ flexShrink: 0 }}>
        <Divider />
        <List>
            <ListItem disablePadding>
                <ListItemButton component={Link} to="/settings">
                    <ListItemIcon><SettingsIcon /></ListItemIcon>
                    <ListItemText primary={t('app.settings')} />
                </ListItemButton>
            </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};