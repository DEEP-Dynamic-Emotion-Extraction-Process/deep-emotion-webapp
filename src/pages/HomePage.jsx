// src/pages/HomePage.jsx
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

/**
 * A página inicial (landing page) da aplicação.
 * Serve como uma introdução ao projeto e um ponto de entrada para os utilizadores.
 */
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
          minHeight: 'calc(100vh - 128px)', // Ocupa a altura da tela menos a navbar
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
          Bem-vindo ao DeepEmotion
        </Typography>

        <Typography 
          variant="h5" 
          color="text.secondary" 
          paragraph 
          sx={{ maxWidth: '600px' }}
        >
          A sua plataforma inteligente para extrair e visualizar emoções de vídeos de forma dinâmica e intuitiva.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/register" 
            size="large"
          >
            Comece Agora
          </Button>
        </Box>
      </Box>
    </Container>
  );
};