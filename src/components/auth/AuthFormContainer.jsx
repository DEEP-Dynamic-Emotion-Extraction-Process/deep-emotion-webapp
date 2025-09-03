// src/components/auth/AuthFormContainer.jsx
import { Container, Paper, Typography, Box } from '@mui/material';

export const AuthFormContainer = ({ title, children }) => {
  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={6} 
        sx={{ 
          marginTop: 8, 
          padding: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        <Typography component="h1" variant="h5">
          {title}
        </Typography>
        <Box sx={{ mt: 1 }}>
          {children}
        </Box>
      </Paper>
    </Container>
  );
};