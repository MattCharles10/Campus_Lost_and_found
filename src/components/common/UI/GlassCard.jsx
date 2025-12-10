import React from 'react';
import { Paper } from '@mui/material';

const GlassCard = ({ children, ...props }) => {
  return (
    <Paper
      {...props}
      sx={{
        background: 'rgba(63, 40, 82, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
        ...props.sx,
      }}
    >
      {children}
    </Paper>
  );
};

export default GlassCard;