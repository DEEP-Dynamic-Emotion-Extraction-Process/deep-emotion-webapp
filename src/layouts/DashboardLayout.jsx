// src/layouts/DashboardLayout.jsx
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { AnalysisSidebar } from '../components/dashboard/AnalysisSidebar';
import { AnalysisProvider } from '../contexts/AnalysisContext'; // <-- IMPORTE O PROVEDOR

export const DashboardLayout = () => {
  return (
    // Envolva o layout com o AnalysisProvider
    <AnalysisProvider>
      <Box sx={{ display: 'flex' }}>
        <Navbar />
        <AnalysisSidebar /> 
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </AnalysisProvider>
  );
};