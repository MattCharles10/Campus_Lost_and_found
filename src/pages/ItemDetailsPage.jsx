import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Divider,
  Avatar,
  Stack,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  Share as ShareIcon,
  Chat as ChatIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Verified as VerifiedIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Map as MapIcon,
  AutoAwesome,
  TrendingUp,
  Security
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { itemService } from '../services/itemService';
import { matchingService } from '../services/matchingService';
import { chatService } from '../services/chatService';
import LoadingSpinner from '../components/common/UI/LoadingSpinner';

const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
}));

const DetailCard = styled(Card)(({ theme, color = '#8b5cf6' }) => ({
  borderRadius: '20px',
  border: `3px solid ${color}40`,
  boxShadow: `0 15px 40px ${color}20`,
  backgroundColor: 'white',
  overflow: 'visible',
  marginBottom: theme.spacing(3),
}));

const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [flagReason, setFlagReason] = useState('');
  const [similarItems, setSimilarItems] = useState([]);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchItemDetails();
    fetchSimilarItems();
    if (item?.type === 'LOST') {
      fetchMatches();
    }
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const data = await itemService.getItemById(id);
      setItem(data);
    } catch (error) {
      console.error('Error fetching item details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      const data = await matchingService.getMatchesForItem(id);
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const fetchSimilarItems = async () => {
    try {
      const data = await itemService.getSimilarItems(id);
      setSimilarItems(data);
    } catch (error) {
      console.error('Error fetching similar items:', error);
    }
  };

  const handleClaim = async () => {
    try {
      await itemService.claimItem(id, claimMessage);
      alert('Claim request sent successfully!');
      setShowClaimDialog(false);
      fetchItemDetails();
    } catch (error) {
      alert('Failed to submit claim. Please try again.');
    }
  };

  const handleFlag = async () => {
    try {
      await itemService.flagItem(id, flagReason);
      alert('Item flagged successfully. Admin will review it.');
      setShowFlagDialog(false);
    } catch (error) {
      alert('Failed to flag item. Please try again.');
    }
  };

  const handleStartChat = async () => {
    try {
      const chat = await chatService.startChat(item.id, item.reportedBy);
      navigate(`/chat/${chat.id}`);
    } catch (error) {
      alert('Failed to start chat. Please try again.');
    }
  };

  const getItemColor = (type) => {
    return type === 'LOST' ? '#f97316' : '#10b981';
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading item details..." />;
  }

  if (!item) {
    return (
      <PageContainer>
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          Item not found or has been removed.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="contained"
        >
          Go Back
        </Button>
      </PageContainer>
    );
  }

  const itemColor = getItemColor(item.type);

  return (
    <PageContainer maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            color: '#64748b',
            mb: 3,
            borderRadius: '10px',
            '&:hover': { backgroundColor: '#f1f5f9' }
          }}
        >
          Back to {item.type === 'LOST' ? 'Lost Items' : 'Found Items'}
        </Button>

        <DetailCard color={itemColor}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Chip 
                  label={item.type}
                  sx={{ 
                    backgroundColor: `${itemColor}20`,
                    color: itemColor,
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    mb: 2
                  }}
                />
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e1b4b', mb: 1 }}>
                  {item.title}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip
                    icon={<LocationIcon />}
                    label={item.location}
                    sx={{ backgroundColor: '#f0f9ff', color: '#0369a1' }}
                  />
                  <Chip
                    icon={<CalendarIcon />}
                    label={new Date(item.createdAt).toLocaleDateString()}
                    sx={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}
                  />
                  <Chip
                    icon={<CategoryIcon />}
                    label={item.category}
                    sx={{ backgroundColor: '#f0fdf4', color: '#065f46' }}
                  />
                </Stack>
              </Box>

              <Stack direction="row" spacing={1}>
                <IconButton onClick={() => navigator.clipboard.writeText(window.location.href)}>
                  <ShareIcon />
                </IconButton>
                <IconButton onClick={() => setShowFlagDialog(true)}>
                  <FlagIcon />
                </IconButton>
                {item.type === 'FOUND' && (
                  <Button
                    variant="contained"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => setShowClaimDialog(true)}
                    sx={{
                      background: `linear-gradient(135deg, ${itemColor} 0%, ${itemColor}cc 100%)`,
                      color: 'white',
                      fontWeight: 800,
                      borderRadius: '12px',
                      px: 3
                    }}
                  >
                    Claim Item
                  </Button>
                )}
              </Stack>
            </Box>

            {/* Status Bar */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Status: {item.status}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  {item.views || 0} views • Updated {new Date(item.updatedAt).toLocaleDateString()}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={item.status === 'RESOLVED' ? 100 : item.status === 'IN_PROGRESS' ? 50 : 25}
                sx={{ 
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e2e8f0',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: itemColor
                  }
                }}
              />
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Stack direction="row" spacing={2}>
                {['details', 'description', 'location', 'matches', 'similar'].map((tab) => (
                  <Button
                    key={tab}
                    variant={activeTab === tab ? 'contained' : 'text'}
                    onClick={() => setActiveTab(tab)}
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'capitalize',
                      fontWeight: activeTab === tab ? 700 : 600,
                      backgroundColor: activeTab === tab ? `${itemColor}20` : 'transparent',
                      color: activeTab === tab ? itemColor : '#64748b',
                      '&:hover': {
                        backgroundColor: `${itemColor}10`,
                      }
                    }}
                  >
                    {tab}
                  </Button>
                ))}
              </Stack>
            </Box>

            {/* Tab Content */}
            {activeTab === 'details' && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 2 }}>
                      📋 Item Specifications
                    </Typography>
                    <Grid container spacing={2}>
                      {[
                        { label: 'Brand', value: item.brand },
                        { label: 'Color', value: item.color },
                        { label: 'Model', value: item.model },
                        { label: 'Serial Number', value: item.serialNumber },
                        { label: 'Approx. Value', value: item.value },
                        { label: 'Condition', value: item.condition },
                      ].filter(spec => spec.value).map((spec, idx) => (
                        <Grid item xs={6} key={idx}>
                          <Box sx={{ 
                            backgroundColor: '#f8fafc',
                            borderRadius: '10px',
                            p: 2,
                            border: '1px solid #e2e8f0'
                          }}>
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                              {spec.label}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                              {spec.value}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    backgroundColor: `${itemColor}08`,
                    borderRadius: '12px',
                    p: 3,
                    border: `2px solid ${itemColor}20`
                  }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: itemColor, mb: 2 }}>
                      {item.type === 'LOST' ? '📢 Lost Item Alert' : '🎯 Found Item Info'}
                    </Typography>
                    
                    {item.type === 'LOST' ? (
                      <Typography variant="body1" sx={{ color: '#475569', mb: 3 }}>
                        If you found this item, please contact the owner immediately. 
                        Use the chat feature below to communicate securely.
                      </Typography>
                    ) : (
                      <Typography variant="body1" sx={{ color: '#475569', mb: 3 }}>
                        This item was found and is awaiting claim. If this belongs to you, 
                        please provide proof of ownership when claiming.
                      </Typography>
                    )}

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<ChatIcon />}
                      onClick={handleStartChat}
                      sx={{
                        background: `linear-gradient(135deg, ${itemColor} 0%, ${itemColor}cc 100%)`,
                        color: 'white',
                        fontWeight: 800,
                        borderRadius: '12px',
                        py: 1.5,
                        mb: 2
                      }}
                    >
                      {item.type === 'LOST' ? 'Contact Owner' : 'Contact Finder'}
                    </Button>

                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', textAlign: 'center' }}>
                      <Security sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                      All communications are secure and monitored
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            )}

            {activeTab === 'description' && item.description && (
              <Box sx={{ 
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                p: 3,
                border: '2px solid #e2e8f0'
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 2 }}>
                  📝 Full Description
                </Typography>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {item.description}
                </Typography>
              </Box>
            )}

            {activeTab === 'location' && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    p: 3,
                    border: '2px solid #e2e8f0',
                    height: '100%'
                  }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 2 }}>
                      🗺️ Location Details
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                          Specific Location
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                          {item.location}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                          Campus Zone
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                          {item.campusZone}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                          Building/Area
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                          {item.building || 'Not specified'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                          Floor/Room
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                          {item.floor || 'Not specified'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    backgroundColor: '#f0f9ff',
                    borderRadius: '12px',
                    p: 3,
                    border: '2px solid #bae6fd',
                    height: '100%',
                    textAlign: 'center'
                  }}>
                    <MapIcon sx={{ fontSize: 60, color: '#0369a1', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#0369a1', mb: 1 }}>
                      Campus Map View
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#475569', mb: 3 }}>
                      View this location on the interactive campus map
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<MapIcon />}
                      onClick={() => navigate('/map')}
                      sx={{
                        borderColor: '#0369a1',
                        color: '#0369a1',
                        fontWeight: 700,
                        borderRadius: '10px'
                      }}
                    >
                      Open Campus Map
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            )}

            {activeTab === 'matches' && item.type === 'LOST' && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 3 }}>
                  🤝 Potential Matches
                </Typography>
                {matches.length > 0 ? (
                  <Grid container spacing={2}>
                    {matches.map((match, idx) => (
                      <Grid item xs={12} key={idx}>
                        <Box sx={{ 
                          backgroundColor: '#f8fafc',
                          borderRadius: '12px',
                          p: 3,
                          border: '2px solid #e2e8f0',
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: '#f1f5f9' }
                        }}
                          onClick={() => navigate(`/items/${match.id}`)}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                              {match.title}
                            </Typography>
                            <Chip 
                              label={`${match.similarityScore || 85}% Match`}
                              sx={{ 
                                backgroundColor: '#10b98120',
                                color: '#065f46',
                                fontWeight: 700
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ color: '#475569', mb: 2 }}>
                            Found at {match.location} • {new Date(match.createdAt).toLocaleDateString()}
                          </Typography>
                          <Button
                            size="small"
                            startIcon={<AutoAwesome />}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/matches?item1=${item.id}&item2=${match.id}`);
                            }}
                            sx={{
                              color: '#8b5cf6',
                              fontWeight: 600
                            }}
                          >
                            Compare Details
                          </Button>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <AutoAwesome sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#475569', mb: 1 }}>
                      No matches found yet
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      Our AI is continuously searching for potential matches.
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {activeTab === 'similar' && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 3 }}>
                  🔍 Similar Items
                </Typography>
                {similarItems.length > 0 ? (
                  <Grid container spacing={2}>
                    {similarItems.map((similarItem, idx) => (
                      <Grid item xs={12} sm={6} key={idx}>
                        <Box sx={{ 
                          backgroundColor: '#f8fafc',
                          borderRadius: '12px',
                          p: 2,
                          border: '2px solid #e2e8f0',
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: '#f1f5f9' }
                        }}
                          onClick={() => navigate(`/items/${similarItem.id}`)}
                        >
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                            {similarItem.title}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Chip 
                              label={similarItem.type}
                              size="small"
                              sx={{ 
                                backgroundColor: similarItem.type === 'LOST' ? '#fef3c7' : '#d1fae5',
                                color: similarItem.type === 'LOST' ? '#d97706' : '#065f46'
                              }}
                            />
                            <Chip 
                              icon={<LocationIcon sx={{ fontSize: 12 }} />}
                              label={similarItem.location}
                              size="small"
                            />
                          </Stack>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center', py: 4 }}>
                    No similar items found.
                  </Typography>
                )}
              </Box>
            )}
          </CardContent>
        </DetailCard>
      </Box>

      {/* Reporter Info */}
      <DetailCard color="#3b82f6">
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 3 }}>
            👤 Reported By
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 60, height: 60, bgcolor: '#3b82f6' }}>
                  {item.reporterName?.charAt(0) || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                    {item.reporterName || 'Anonymous User'}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <VerifiedIcon sx={{ fontSize: 16, color: '#10b981' }} />
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Verified Campus Member
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.5 }}>
                    Member since {item.reporterJoinDate ? new Date(item.reporterJoinDate).toLocaleDateString() : '2023'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ color: '#64748b', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#475569' }}>
                    {item.reporterEmail || 'Email not shared'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon sx={{ color: '#64748b', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#475569' }}>
                    {item.reporterPhone || 'Phone not shared'}
                  </Typography>
                </Box>
                <Chip 
                  label={`${item.reporterItemsCount || 0} items reported`}
                  size="small"
                  sx={{ 
                    backgroundColor: '#f0f9ff',
                    color: '#0369a1',
                    fontWeight: 600,
                    alignSelf: 'flex-start'
                  }}
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </DetailCard>

      {/* Claim Dialog */}
      <Dialog
        open={showClaimDialog}
        onClose={() => setShowClaimDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Claim This Item
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2, borderRadius: '8px' }}>
            Please provide proof of ownership when you meet the finder.
          </Alert>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Additional Information"
            placeholder="Describe how you can prove this item belongs to you..."
            value={claimMessage}
            onChange={(e) => setClaimMessage(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClaimDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleClaim}
            disabled={!claimMessage.trim()}
          >
            Submit Claim
          </Button>
        </DialogActions>
      </Dialog>

      {/* Flag Dialog */}
      <Dialog
        open={showFlagDialog}
        onClose={() => setShowFlagDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Flag This Item
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2, borderRadius: '8px' }}>
            Please provide a reason for flagging this item. Our admin team will review it.
          </Alert>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason for Flagging"
            placeholder="Why are you flagging this item? (e.g., inappropriate content, suspicious activity)..."
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFlagDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleFlag}
            disabled={!flagReason.trim()}
          >
            Flag Item
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ItemDetailsPage;