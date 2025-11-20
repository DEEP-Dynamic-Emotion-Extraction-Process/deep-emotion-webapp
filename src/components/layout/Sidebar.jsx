// src/components/layout/Sidebar.jsx
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

const drawerWidth = 240;

export const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { text: 'New Analysis', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'My Analyses', icon: <VideoLibraryIcon />, path: '/dashboard/analyses' }, 
  ];

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
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} to={item.path} selected={location.pathname === item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
           <ListItem disablePadding>
              <ListItemButton component={Link} to="/settings" selected={location.pathname === '/settings'}>
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};