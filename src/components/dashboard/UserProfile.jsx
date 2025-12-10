import React from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Divider,
  Stack,
  IconButton
} from '@mui/material';
import {
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Edit as EditIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import GlassCard from '../common/UI/GlassCard';

const UserProfile = ({ user, onLogout }) => {
  return (
    <GlassCard sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          sx={{
            width: 60,
            height: 60,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            mr: 2
          }}
        >
          {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {user?.email}
          </Typography>
          {user?.studentId && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <VerifiedIcon fontSize="small" sx={{ color: '#4ecdc4', mr: 0.5 }} />
              <Typography variant="caption" sx={{ color: '#4ecdc4' }}>
                Student ID: {user.studentId}
              </Typography>
            </Box>
          )}
        </Box>
        <IconButton 
          size="small" 
          sx={{ 
            ml: 'auto', 
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': { color: '#667eea' }
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />

      <Stack spacing={1}>
        <Button
          fullWidth
          startIcon={<SettingsIcon />}
          sx={{
            justifyContent: 'flex-start',
            color: 'rgba(255, 255, 255, 0.8)',
            textTransform: 'none',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Account Settings
        </Button>
        
        <Button
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={onLogout}
          sx={{
            justifyContent: 'flex-start',
            color: '#ff6b6b',
            textTransform: 'none',
            '&:hover': {
              background: 'rgba(255, 107, 107, 0.1)'
            }
          }}
        >
          Logout
        </Button>
      </Stack>

      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Member since Jan 2024
        </Typography>
      </Box>
    </GlassCard>
  );
};

export default UserProfile;