import React from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  Stack,
  IconButton
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Visibility as VisibilityIcon,
  Message as MessageIcon,
  Category as CategoryIcon,      // Added
  Place as PlaceIcon            // Added
} from '@mui/icons-material';
import GlassCard from '../../common/UI/GlassCard';

const RecentItemsCard = ({ items, onViewItem, getStatusColor, getStatusIcon }) => {
  return (
    <GlassCard sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          Recent Activity
        </Typography>
        <Button
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            color: 'white',
            '&:hover': { background: 'rgba(255, 255, 255, 0.1)' }
          }}
        >
          View All
        </Button>
      </Box>
      
      <Stack spacing={2}>
        {items.map((item) => (
          <Box
            key={item.id}
            sx={{
              p: 2,
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateX(4px)',
                cursor: 'pointer'
              }
            }}
            onClick={() => onViewItem(item.id)}
          >
            <Avatar
              src={item.image}
              variant="rounded"
              sx={{ width: 60, height: 60 }}
            >
              {item.type === 'lost' ? '❓' : '✅'}
            </Avatar>
            
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {item.title}
                </Typography>
                <Chip
                  label={item.type}
                  size="small"
                  sx={{
                    background: item.type === 'lost' 
                      ? 'rgba(255, 107, 107, 0.2)' 
                      : 'rgba(78, 205, 196, 0.2)',
                    color: 'white',
                    textTransform: 'capitalize'
                  }}
                />
                <Chip
                  icon={getStatusIcon(item.status)}
                  label={item.status}
                  size="small"
                  color={getStatusColor(item.status)}
                  sx={{ textTransform: 'capitalize' }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CategoryIcon fontSize="small" />
                  {item.category}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PlaceIcon fontSize="small" />
                  {item.location}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  {item.date}
                </Typography>
              </Box>
            </Box>
            
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                <MessageIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        ))}
      </Stack>
    </GlassCard>
  );
};

export default RecentItemsCard;