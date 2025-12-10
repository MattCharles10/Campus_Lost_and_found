import React from 'react';
import { Box } from '@mui/material';

const AnimatedBackground = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'ivory',
        zIndex: -1,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at 15% 50%, rgba(41, 128, 185, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 85% 30%, rgba(155, 89, 182, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(243, 156, 18, 0.05) 0%, transparent 50%)
          `,
        },
      }}
    />
  );
};

export default AnimatedBackground;