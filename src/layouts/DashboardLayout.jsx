// src/layouts/DashboardLayout.jsx
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { AnalysisSidebar } from '../components/dashboard/AnalysisSidebar'; // A importação correta

export const DashboardLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <AnalysisSidebar /> 
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};