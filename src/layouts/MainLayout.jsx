// src/layouts/MainLayout.jsx
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

export const MainLayout = () => {
  return (
    <Box>
      <Navbar />
      <Toolbar /> {/* Espaçador para o conteúdo não ficar atrás da Navbar fixa */}
      <main>
        <Outlet />
      </main>
    </Box>
  );
};