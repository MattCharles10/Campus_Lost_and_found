import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Divider
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  Visibility as ViewIcon,
  Share as ShareIcon,
  Chat as ChatIcon,
  Notifications as NotificationsIcon,
  Flag as FlagIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Close,
  AutoAwesome
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../../services/itemService';

const StyledCard = styled(Card)(({ theme, itemtype, urgent }) => ({
  borderRadius: '16px',
  border: `3px solid ${itemtype === 'LOST' ? '#fdba74' : '#86efac'}`,
  backgroundColor: 'white',
  boxShadow: urgent 
    ? '0 10px 40px rgba(239, 68, 68, 0.3)' 
    : '0 10px 30px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: urgent 
      ? '0 15px 50px rgba(239, 68, 68, 0.4)' 
      : '0 15px 40px rgba(0, 0, 0, 0.15)',
    borderColor: itemtype === 'LOST' ? '#f97316' : '#10b981',
  },
  '&::before': urgent ? {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: 'linear-gradient(90deg, #ef4444, #dc2626)',
    animation: 'pulse 2s infinite'
  } : {},
}));

const ItemAvatar = styled(Avatar)(({ itemtype }) => ({
  backgroundColor: itemtype === 'LOST' ? '#fef3c7' : '#d1fae5',
  color: itemtype === 'LOST' ? '#d97706' : '#059669',
  fontWeight: 'bold',
  width: 56,
  height: 56,
  fontSize: '1.5rem',
}));

const EnhancedItemCard = ({ 
  item, 
  onViewDetails, 
  onClaim, 
  onShare, 
  onSetAlert,
  showUrgentBadge = false 
}) => {
  const navigate = useNavigate();
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleFlagItem = async () => {
    try {
      await itemService.flagItem(item.id, flagReason);
      alert('Item flagged for review. Thank you!');
      setShowFlagDialog(false);
      setFlagReason('');
    } catch (error) {
      alert('Failed to flag item. Please try again.');
    }
  };

  const handleSetAlert = async () => {
    try {
      await itemService.setItemAlert(item.id, alertMessage);
      alert('Alert set successfully! You will be notified of updates.');
      setShowAlertDialog(false);
      setAlertMessage('');
    } catch (error) {
      alert('Failed to set alert. Please try again.');
    }
  };

  const handleStartChat = () => {
    navigate(`/chat?item=${item.id}&user=${item.reportedById}`);
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <StyledCard itemtype={item.type} urgent={item.urgent || showUrgentBadge}>
        <CardContent sx={{ p: 3, flexGrow: 1 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <ItemAvatar itemtype={item.type}>
              {item.type === 'LOST' ? '❓' : '✅'}
            </ItemAvatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 800, 
                  color: '#1e1b4b',
                  mb: 0.5,
                  lineHeight: 1.3
                }}>
                  {item.title}
                </Typography>
                {(item.urgent || showUrgentBadge) && (
                  <Chip
                    label="URGENT"
                    size="small"
                    sx={{
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      fontWeight: 900,
                      fontSize: '0.7rem',
                      height: 20
                    }}
                  />
                )}
              </Box>
              
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  icon={<LocationIcon sx={{ fontSize: 12 }} />}
                  label={item.location}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    color: '#1d4ed8',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}
                />
                <Chip
                  icon={<CalendarIcon sx={{ fontSize: 12 }} />}
                  label={getTimeAgo(item.createdAt)}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    color: '#7c3aed',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}
                />
                {item.category && (
                  <Chip
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
                      fontSize: '0.75rem'
                    }}
                  />
                )}
              </Stack>

              {/* Description Preview */}
              {item.description && (
                <Typography variant="body2" sx={{ 
                  color: '#64748b',
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.5
                }}>
                  {item.description}
                </Typography>
              )}

              {/* Additional Details */}
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 1,
                mt: 2
              }}>
                {item.brand && (
                  <Box sx={{ 
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    p: 1,
                    textAlign: 'center'
                  }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                      Brand
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                      {item.brand}
                    </Typography>
                  </Box>
                )}
                {item.color && (
                  <Box sx={{ 
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    p: 1,
                    textAlign: 'center'
                  }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                      Color
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                      {item.color}
                    </Typography>
                  </Box>
                )}
                {item.status && (
                  <Box sx={{ 
                    backgroundColor: item.status === 'RESOLVED' ? '#f0fdf4' : 
                                   item.status === 'IN_PROGRESS' ? '#fef3c7' : '#f8fafc',
                    borderRadius: '8px',
                    p: 1,
                    textAlign: 'center'
                  }}>
                    <Typography variant="caption" sx={{ 
                      color: item.status === 'RESOLVED' ? '#059669' :
                             item.status === 'IN_PROGRESS' ? '#d97706' : '#94a3b8',
                      display: 'block'
                    }}>
                      Status
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 700, 
                      color: item.status === 'RESOLVED' ? '#059669' :
                             item.status === 'IN_PROGRESS' ? '#d97706' : '#1e1b4b'
                    }}>
                      {item.status}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Footer Stats */}
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto',
            pt: 2,
            borderTop: '2px dashed #e2e8f0'
          }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <VisibilityIcon sx={{ fontSize: 14 }} />
                {item.views || 0} views
              </Typography>
              {item.hasMatches && (
                <Typography variant="caption" sx={{ 
                  color: '#8b5cf6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontWeight: 600
                }}>
                  <AutoAwesome sx={{ fontSize: 14 }} />
                  Matches found
                </Typography>
              )}
            </Box>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              ID: {item.id}
            </Typography>
          </Box>
        </CardContent>

        <Divider sx={{ mx: 3 }} />

        {/* Action Buttons */}
        <CardActions sx={{ p: 2, pt: 1.5 }}>
          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
            <Button
              size="small"
              variant="contained"
              startIcon={<ViewIcon />}
              onClick={onViewDetails}
              sx={{
                flex: 1,
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white',
                fontWeight: 700,
                borderRadius: '10px',
                fontSize: '0.75rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                }
              }}
            >
              View
            </Button>
            
            {item.type === 'FOUND' ? (
              <Button
                size="small"
                variant="outlined"
                startIcon={<CheckCircleIcon />}
                onClick={onClaim}
                sx={{
                  flex: 1,
                  borderColor: '#10b981',
                  color: '#10b981',
                  fontWeight: 600,
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  '&:hover': {
                    borderColor: '#059669',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  }
                }}
              >
                Claim
              </Button>
            ) : (
              <Button
                size="small"
                variant="outlined"
                startIcon={<NotificationsIcon />}
                onClick={() => setShowAlertDialog(true)}
                sx={{
                  flex: 1,
                  borderColor: '#f59e0b',
                  color: '#f59e0b',
                  fontWeight: 600,
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  '&:hover': {
                    borderColor: '#d97706',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  }
                }}
              >
                Alert
              </Button>
            )}

            <IconButton
              size="small"
              onClick={() => setShowFlagDialog(true)}
              sx={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                '&:hover': { backgroundColor: '#f1f5f9' }
              }}
            >
              <FlagIcon sx={{ fontSize: 18, color: '#ef4444' }} />
            </IconButton>

            <IconButton
              size="small"
              onClick={onShare}
              sx={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                '&:hover': { backgroundColor: '#f1f5f9' }
              }}
            >
              <ShareIcon sx={{ fontSize: 18, color: '#3b82f6' }} />
            </IconButton>
          </Stack>
        </CardActions>
      </StyledCard>

      {/* Flag Dialog */}
      <Dialog
        open={showFlagDialog}
        onClose={() => setShowFlagDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Flag Item for Review
          </Typography>
          <IconButton onClick={() => setShowFlagDialog(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2, borderRadius: '8px' }}>
            Please specify why you are flagging this item. Our admin team will review it.
          </Alert>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason for flagging"
            placeholder="Why are you flagging this item? (e.g., inappropriate content, suspicious activity, incorrect information)"
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFlagDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleFlagItem}
            disabled={!flagReason.trim()}
          >
            Flag Item
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Dialog */}
      <Dialog
        open={showAlertDialog}
        onClose={() => setShowAlertDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Set Alert for This Item
          </Typography>
          <IconButton onClick={() => setShowAlertDialog(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2, borderRadius: '8px' }}>
            You will receive notifications when there are updates to this item.
          </Alert>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Custom alert message (optional)"
            placeholder="Add any specific details about what updates you want to be notified about..."
            value={alertMessage}
            onChange={(e) => setAlertMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAlertDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSetAlert}
            sx={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white'
            }}
          >
            Set Alert
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EnhancedItemCard;