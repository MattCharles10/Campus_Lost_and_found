import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ size = 60, text = 'Loading...', showText = false, fullScreen = false }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: fullScreen ? '100vh' : '200px',
        width: '100%',
        background: fullScreen ? 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' : 'transparent',
        p: fullScreen ? 4 : 0
      }}
    >
      <CircularProgress 
        size={size}
        sx={{
          color: '#667eea',
          animationDuration: '0.8s',
          mb: showText ? 2 : 0
        }}
      />
      {showText && (
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            mt: 2,
            fontWeight: 500,
            fontSize: '1.1rem'
          }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;