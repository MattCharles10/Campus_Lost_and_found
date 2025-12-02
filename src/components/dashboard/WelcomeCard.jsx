import React from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Chip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import GlassCard from '../common/UI/GlassCard';

const WelcomeCard = ({ user }) => {
  return (
    <GlassCard sx={{ mb: 3, p: 3, position: 'relative', overflow: 'hidden' }}>
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0
        }}
      />
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: 1 }}>
              Welcome back,
            </Typography>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
              {user?.firstName} {user?.lastName} 👋
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', maxWidth: '600px' }}>
              Track your lost items, help others find theirs, and make our campus community better together.
            </Typography>
          </Box>
          
          <Avatar
            sx={{
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}
          >
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </Avatar>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip
            icon={<NotificationsIcon />}
            label="3 new notifications"
            sx={{
              background: 'rgba(255, 107, 107, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 107, 107, 0.3)'
            }}
          />
          <Chip
            icon={<TimelineIcon />}
            label="Active for 14 days"
            sx={{
              background: 'rgba(78, 205, 196, 0.2)',
              color: 'white',
              border: '1px solid rgba(78, 205, 196, 0.3)'
            }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                borderColor: '#667eea',
                background: 'rgba(102, 126, 234, 0.1)'
              }
            }}
          >
            View Activity Log
          </Button>
        </Box>
      </Box>
    </GlassCard>
  );
};

export default WelcomeCard;