// src/components/analysis/VideoPlayer.jsx
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

export const VideoPlayer = React.forwardRef(({ videoUrl }, ref) => {

  return (
    <Box sx={{ position: 'relative', paddingTop: '56.25%', backgroundColor: 'black' }}>
      <video
        ref={ref}
        controls
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        src={videoUrl}
      >
        Your browser does not support the video tag.
      </video>
    </Box>
  );
});