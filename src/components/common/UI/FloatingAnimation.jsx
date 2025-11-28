import React from 'react';
import { Box } from '@mui/material';

const FloatingAnimation = ({ children, delay = 0 }) => {
  return (
    <Box
      sx={{
        animation: `float 3s ease-in-out ${delay}s infinite`,
      }}
    >
      {children}
    </Box>
  );
};

export default FloatingAnimation;