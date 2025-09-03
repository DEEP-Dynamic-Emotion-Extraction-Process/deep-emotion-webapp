// src/pages/DashboardPage.jsx
import { Container, Typography, Box } from '@mui/material';
import { VideoUploader } from '../components/dashboard/VideoUploader';

export const DashboardPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <VideoUploader />
      </Box>
    </Container>
  );
};