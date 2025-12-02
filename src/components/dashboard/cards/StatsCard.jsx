import React from 'react';
import {
  Box,
  Typography,
  Paper
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const StatsCard = ({ title, value, icon, color, trend }) => {
  const isPositive = trend && !trend.includes('-');
  
  return (
    <Paper
      sx={{
        p: 2.5,
        height: '100%',
        background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
        border: `1px solid ${color}30`,
        borderRadius: 3,
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 32px ${color}30`
        }
      }}
    >
      {/* Background Circle */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          background: `${color}10`,
          borderRadius: '50%'
        }}
      />
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mt: 0.5 }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              background: color,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            {icon}
          </Box>
        </Box>
        
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isPositive ? (
              <TrendingUp fontSize="small" sx={{ color: '#4ecdc4' }} />
            ) : (
              <TrendingDown fontSize="small" sx={{ color: '#ff6b6b' }} />
            )}
            <Typography 
              variant="caption" 
              sx={{ 
                color: isPositive ? '#4ecdc4' : '#ff6b6b',
                fontWeight: 500
              }}
            >
              {trend}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default StatsCard;