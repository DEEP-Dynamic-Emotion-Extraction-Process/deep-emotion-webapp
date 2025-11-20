// src/pages/HomePage.jsx
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: 'calc(100vh - 128px)', 
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(90deg, #90caf9, #f48fb1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Welcome to DeepEmotion
        </Typography>

        <Typography 
          variant="h5" 
          color="text.secondary" 
          paragraph 
          sx={{ maxWidth: '600px' }}
        >
          Your intelligent platform to extract and visualize emotions from videos in a dynamic and intuitive way.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/register" 
            size="large"
          >
            Get Started
          </Button>
        </Box>
      </Box>
    </Container>
  );
};