// src/components/dashboard/cards/QuickActionsCard.jsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Stack
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import GlassCard from '../../common/UI/GlassCard';

const QuickActionsCard = ({ actions, onActionClick }) => {
  return (
    <GlassCard sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          Quick Actions
        </Typography>
        <Button
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            color: 'white',
            '&:hover': { background: 'rgba(255, 255, 255, 0.1)' }
          }}
        >
          More Actions
        </Button>
      </Box>
      
      <Grid container spacing={2}>
        {actions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              onClick={() => onActionClick(action.path)}
              sx={{
                p: 2.5,
                height: '100%',
                background: `linear-gradient(135deg, ${action.color}20 0%, ${action.color}10 100%)`,
                border: `1px solid ${action.color}30`,
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 32px ${action.color}30`,
                  background: `linear-gradient(135deg, ${action.color}30 0%, ${action.color}20 100%)`,
                }
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  background: action.color,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  mb: 2
                }}
              >
                {action.icon}
              </Box>
              
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                {action.title}
              </Typography>
              
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem' }}>
                {action.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </GlassCard>
  );
};

export default QuickActionsCard;