// src/components/analysis/VideoPlayer.jsx
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

// Usamos React.forwardRef para passar uma ref para o elemento <video>
export const VideoPlayer = React.forwardRef(({ videoUrl }, ref) => {
  if (!videoUrl) {
    // ... (código de erro continua igual) ...
  }

  return (
    <Box sx={{ position: 'relative', paddingTop: '56.25%', backgroundColor: 'black' }}>
      <video
        ref={ref} // Atribuímos a ref aqui
        controls
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        src={videoUrl}
      >
        O seu navegador não suporta a tag de vídeo.
      </video>
    </Box>
  );
});