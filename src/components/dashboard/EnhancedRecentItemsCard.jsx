import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  Visibility as ViewIcon,
  AutoAwesome,
  Flag,
  TrendingUp,
  Chat as ChatIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const RecentItemContainer = styled(Box)(({ theme, itemtype }) => ({
  backgroundColor: 'white',
  borderRadius: '16px',
  border: `3px solid ${itemtype === 'lost' ? '#fed7aa' : '#bbf7d0'}`,
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    borderColor: itemtype === 'lost' ? '#fb923c' : '#4ade80',
    '&::before': {
      width: '100%',
    }
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '0%',
    height: '4px',
    background: itemtype === 'lost' 
      ? 'linear-gradient(90deg, #f97316, #ea580c)' 
      : 'linear-gradient(90deg, #10b981, #059669)',
    transition: 'width 0.3s ease',
  }
}));

const ItemAvatar = styled(Avatar)(({ itemtype }) => ({
  backgroundColor: itemtype === 'lost' ? '#fef3c7' : '#d1fae5',
  color: itemtype === 'lost' ? '#d97706' : '#059669',
  fontWeight: 'bold',
  width: 48,
  height: 48,
  fontSize: '1.2rem',
  border: `3px solid ${itemtype === 'lost' ? '#fde68a' : '#a7f3d0'}`,
}));

const EnhancedRecentItemsCard = ({ items = [], onViewMatches, onFlagContent }) => {
  const navigate = useNavigate();

  const handleViewItem = (item) => {
    navigate(`/items/${item.id}`);
  };

  const handleStartChat = (item) => {
    navigate(`/chat?item=${item.id}`);
  };

  const handleShareItem = (item) => {
    const shareUrl = `${window.location.origin}/items/${item.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Item link copied to clipboard!');
  };

  if (items.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 6, 
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '3px dashed #e2e8f0'
      }}>
        <AutoAwesome sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#475569', mb: 1 }}>
          No recent activity
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
          Report a lost or found item to get started
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/report-item')}
          sx={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            fontWeight: 800,
            borderRadius: '12px',
            px: 3,
            py: 1.2
          }}
        >
          Report Item
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {items.map((item, index) => (
        <RecentItemContainer 
          key={item.id || index} 
          itemtype={item.type}
          sx={{
            animation: `slideIn 0.3s ease ${index * 0.1}s both`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
              <ItemAvatar itemtype={item.type}>
                {item.type === 'lost' ? '❓' : '✅'}
              </ItemAvatar>
              
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 800, 
                    color: '#1e1b4b',
                    fontSize: '1rem',
                    lineHeight: 1.2
                  }}>
                    {item.title}
                  </Typography>
                  
                  {item.hasMatches && (
                    <Tooltip title="Smart matches found">
                      <Chip 
                        icon={<AutoAwesome sx={{ fontSize: 12 }} />}
                        label="Matches"
                        size="small"
                        sx={{ 
                          backgroundColor: 'rgba(139, 92, 246, 0.15)',
                          color: '#7c3aed',
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          height: 20,
                          '& .MuiChip-icon': { fontSize: 12 }
                        }}
                        onClick={() => onViewMatches && onViewMatches(item)}
                      />
                    </Tooltip>
                  )}
                  
                  {item.isFlagged && (
                    <Chip 
                      icon={<Flag sx={{ fontSize: 12 }} />}
                      label="Flagged"
                      size="small"
                      sx={{ 
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#dc2626',
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        height: 20
                      }}
                    />
                  )}
                  
                  {item.urgent && (
                    <Chip 
                      label="URGENT"
                      size="small"
                      sx={{ 
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        fontWeight: 900,
                        fontSize: '0.6rem',
                        height: 18
                      }}
                    />
                  )}
                </Box>
                
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
                  <Chip 
                    icon={<LocationIcon sx={{ fontSize: 12 }} />}
                    label={item.location}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      color: '#1d4ed8',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 22
                    }}
                  />
                  
                  <Chip 
                    icon={<CalendarIcon sx={{ fontSize: 12 }} />}
                    label={item.timeAgo}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      color: '#7c3aed',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 22
                    }}
                  />
                  
                  {item.category && (
                    <Chip 
                      icon={<CategoryIcon sx={{ fontSize: 12 }} />}
                      label={item.category}
                      size="small"
                      sx={{ 
                        backgroundColor: item.category === 'Electronics' ? 'rgba(139, 92, 246, 0.1)' :
                                        item.category === 'Documents' ? 'rgba(59, 130, 246, 0.1)' :
                                        item.category === 'Clothing' ? 'rgba(6, 182, 212, 0.1)' :
                                        'rgba(16, 185, 129, 0.1)',
                        color: item.category === 'Electronics' ? '#7c3aed' :
                               item.category === 'Documents' ? '#1d4ed8' :
                               item.category === 'Clothing' ? '#0e7490' :
                               '#059669',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 22
                      }}
                    />
                  )}
                  
                  <Typography variant="caption" sx={{ 
                    color: '#94a3b8',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}>
                    by {item.reportedBy || 'Anonymous'}
                  </Typography>
                </Stack>
                
                {item.description && (
                  <Typography variant="caption" sx={{ 
                    color: '#64748b',
                    mt: 1,
                    display: 'block',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.description}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="View Details">
                <IconButton
                  size="small"
                  onClick={() => handleViewItem(item)}
                  sx={{
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    color: '#8b5cf6',
                    '&:hover': {
                      backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    }
                  }}
                >
                  <ViewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Find Matches">
                <IconButton
                  size="small"
                  onClick={() => onViewMatches && onViewMatches(item)}
                  sx={{
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    color: '#06b6d4',
                    '&:hover': {
                      backgroundColor: 'rgba(6, 182, 212, 0.2)',
                    }
                  }}
                >
                  <AutoAwesome fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Start Chat">
                <IconButton
                  size="small"
                  onClick={() => handleStartChat(item)}
                  sx={{
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                    '&:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    }
                  }}
                >
                  <ChatIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Share">
                <IconButton
                  size="small"
                  onClick={() => handleShareItem(item)}
                  sx={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    '&:hover': {
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    }
                  }}
                >
                  <ShareIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Flag Content">
                <IconButton
                  size="small"
                  onClick={() => onFlagContent && onFlagContent(item)}
                  sx={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    '&:hover': {
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    }
                  }}
                >
                  <Flag fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          {/* Status Indicator */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mt: 2,
            pt: 2,
            borderTop: '1px solid #e2e8f0'
          }}>
            <Typography variant="caption" sx={{ 
              color: '#94a3b8',
              fontSize: '0.7rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}>
              <TrendingUp sx={{ fontSize: 12 }} />
              {item.views || 0} views • ID: {item.id || 'N/A'}
            </Typography>
            
            <Button
              size="small"
              onClick={() => handleViewItem(item)}
              sx={{
                color: '#8b5cf6',
                fontWeight: 700,
                fontSize: '0.7rem',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                }
              }}
            >
              Full Details →
            </Button>
          </Box>
        </RecentItemContainer>
      ))}
      
      {/* View All Button */}
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/items')}
          sx={{
            borderColor: '#8b5cf6',
            color: '#8b5cf6',
            fontWeight: 700,
            borderRadius: '12px',
            px: 4,
            '&:hover': {
              borderColor: '#7c3aed',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
            }
          }}
        >
          View All Items
        </Button>
      </Box>
    </Box>
  );
};

export default EnhancedRecentItemsCard;