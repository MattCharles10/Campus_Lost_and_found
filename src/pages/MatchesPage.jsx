import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  LinearProgress,
  Alert,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CompareArrows as CompareIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Share as ShareIcon,
  Chat as ChatIcon,
  Notifications as NotificationsIcon,
  AutoAwesome,
  TrendingUp,
  Warning as WarningIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { matchingService } from '../services/matchingService';
import { itemService } from '../services/itemService';
import { LoadingSpinner } from '../components/common/UI/LoadingSpinner';

const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
}));

const MatchCard = styled(Card)(({ theme, matchscore }) => {
  const getColor = (score) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#3b82f6';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };
  
  const color = getColor(matchscore);
  
  return {
    borderRadius: '20px',
    border: `3px solid ${color}40`,
    backgroundColor: 'white',
    boxShadow: `0 15px 40px ${color}20`,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: `0 20px 50px ${color}30`,
    }
  };
});

const ScoreCircle = styled(Box)(({ score }) => {
  const getColor = (score) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#3b82f6';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };
  
  const color = getColor(score);
  
  return {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&::before': {
      content: '""',
      position: 'absolute',
      width: 100,
      height: 100,
      borderRadius: '50%',
      background: `conic-gradient(${color} ${score * 3.6}deg, ${color}20 0deg)`,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      width: 80,
      height: 80,
      borderRadius: '50%',
      backgroundColor: 'white',
    }
  };
});

const MatchesPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [stats, setStats] = useState({
    totalMatches: 0,
    highConfidence: 0,
    mediumConfidence: 0,
    recentMatches: 0
  });

  useEffect(() => {
    fetchMatches();
    fetchStats();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const itemId = searchParams.get('itemId');
      let data;
      
      if (itemId) {
        data = await matchingService.getMatchesForItem(itemId);
      } else {
        data = await matchingService.getAllMatches();
      }
      
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await matchingService.getMatchingStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleContactMatch = (match) => {
    setSelectedMatch(match);
    setShowContactDialog(true);
  };

  const handleStartChat = async () => {
    if (!selectedMatch) return;
    
    try {
      // Start chat with match
      // await chatService.startChat(selectedMatch.id);
      navigate(`/chat?match=${selectedMatch.id}`);
    } catch (error) {
      alert('Failed to start chat. Please try again.');
    }
  };

  const getMatchLevel = (score) => {
    if (score >= 85) return { label: 'Excellent Match', color: '#10b981' };
    if (score >= 70) return { label: 'High Match', color: '#3b82f6' };
    if (score >= 50) return { label: 'Medium Match', color: '#f59e0b' };
    return { label: 'Low Match', color: '#ef4444' };
  };

  if (loading && matches.length === 0) {
    return <LoadingSpinner fullScreen text="Finding matches..." />;
  }

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
          Back
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e1b4b', mb: 1 }}>
              🤝 Smart Matches
            </Typography>
            <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>
              AI-powered matching between lost and found items
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h2" sx={{ fontWeight: 900, color: '#8b5cf6' }}>
              {stats.totalMatches}
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Total Matches Found
            </Typography>
          </Box>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ p: 2, backgroundColor: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: '12px' }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46' }}>
                {stats.highConfidence}
              </Typography>
              <Typography variant="body2" sx={{ color: '#059669' }}>
                High Confidence
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ p: 2, backgroundColor: '#f0f9ff', border: '2px solid #bae6fd', borderRadius: '12px' }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#0369a1' }}>
                {stats.mediumConfidence}
              </Typography>
              <Typography variant="body2" sx={{ color: '#0ea5e9' }}>
                Medium Confidence
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ p: 2, backgroundColor: '#fef3c7', border: '2px solid #fde68a', borderRadius: '12px' }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#92400e' }}>
                {stats.recentMatches}
              </Typography>
              <Typography variant="body2" sx={{ color: '#d97706' }}>
                Recent (24h)
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ p: 2, backgroundColor: '#f5f3ff', border: '2px solid #ddd6fe', borderRadius: '12px' }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#5b21b6' }}>
                {Math.round((matches.filter(m => m.similarityScore >= 70).length / matches.length) * 100) || 0}%
              </Typography>
              <Typography variant="body2" sx={{ color: '#7c3aed' }}>
                Success Rate
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Matches List */}
      {matches.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8, 
          backgroundColor: 'white',
          borderRadius: '20px',
          border: '3px solid #e2e8f0'
        }}>
          <AutoAwesome sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#475569', mb: 1 }}>
            No matches found yet
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3, maxWidth: 500, mx: 'auto' }}>
            Our AI matching system runs every hour. Check back soon or report more items to increase match chances.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/report-item')}
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white',
                fontWeight: 800,
                borderRadius: '12px',
                px: 3
              }}
            >
              Report Item
            </Button>
            <Button
              variant="outlined"
              onClick={fetchMatches}
              sx={{
                borderColor: '#06b6d4',
                color: '#06b6d4',
                fontWeight: 700,
                borderRadius: '12px',
                px: 3
              }}
            >
              Refresh Matches
            </Button>
          </Box>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {matches.map((match, index) => {
            const matchLevel = getMatchLevel(match.similarityScore);
            
            return (
              <Grid item xs={12} key={index}>
                <MatchCard matchscore={match.similarityScore}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                      {/* Match Score */}
                      <ScoreCircle score={match.similarityScore}>
                        <Typography variant="h4" sx={{ 
                          fontWeight: 900, 
                          color: matchLevel.color,
                          position: 'relative',
                          zIndex: 1
                        }}>
                          {match.similarityScore}%
                        </Typography>
                      </ScoreCircle>

                      {/* Match Details */}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#1e1b4b', mb: 1 }}>
                              {match.title}
                            </Typography>
                            <Chip 
                              label={matchLevel.label}
                              sx={{ 
                                backgroundColor: `${matchLevel.color}20`,
                                color: matchLevel.color,
                                fontWeight: 800,
                                fontSize: '0.8rem'
                              }}
                            />
                          </Box>
                          <Stack direction="row" spacing={1}>
                            <IconButton onClick={() => handleContactMatch(match)}>
                              <ChatIcon />
                            </IconButton>
                            <IconButton>
                              <ShareIcon />
                            </IconButton>
                          </Stack>
                        </Box>

                        {/* Items Comparison */}
                        <Grid container spacing={3} sx={{ mb: 3 }}>
                          <Grid item xs={12} md={6}>
                            <Card sx={{ p: 2, backgroundColor: '#fef3c7', border: '2px solid #fde68a' }}>
                              <Typography variant="subtitle2" sx={{ color: '#92400e', fontWeight: 700, mb: 1 }}>
                                🎯 Lost Item
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e1b4b' }}>
                                {match.lostItem?.title || 'Unknown'}
                              </Typography>
                              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                <Chip 
                                  icon={<LocationIcon sx={{ fontSize: 12 }} />}
                                  label={match.lostItem?.location}
                                  size="small"
                                />
                                <Chip 
                                  icon={<CalendarIcon sx={{ fontSize: 12 }} />}
                                  label={new Date(match.lostItem?.createdAt).toLocaleDateString()}
                                  size="small"
                                />
                              </Stack>
                            </Card>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Card sx={{ p: 2, backgroundColor: '#d1fae5', border: '2px solid #a7f3d0' }}>
                              <Typography variant="subtitle2" sx={{ color: '#065f46', fontWeight: 700, mb: 1 }}>
                                ✅ Found Item
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e1b4b' }}>
                                {match.foundItem?.title || 'Unknown'}
                              </Typography>
                              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                <Chip 
                                  icon={<LocationIcon sx={{ fontSize: 12 }} />}
                                  label={match.foundItem?.location}
                                  size="small"
                                />
                                <Chip 
                                  icon={<CalendarIcon sx={{ fontSize: 12 }} />}
                                  label={new Date(match.foundItem?.createdAt).toLocaleDateString()}
                                  size="small"
                                />
                              </Stack>
                            </Card>
                          </Grid>
                        </Grid>

                        {/* Match Reasons */}
                        {match.matchReasons && match.matchReasons.length > 0 && (
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600, mb: 1 }}>
                              🤔 Why this is a match:
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                              {match.matchReasons.slice(0, 3).map((reason, idx) => (
                                <Chip 
                                  key={idx}
                                  label={reason}
                                  size="small"
                                  sx={{ 
                                    backgroundColor: `${matchLevel.color}10`,
                                    color: matchLevel.color,
                                    fontWeight: 500
                                  }}
                                />
                              ))}
                            </Stack>
                          </Box>
                        )}

                        {/* Actions */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '2px dashed #e2e8f0' }}>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                            Match #{index + 1} • Last updated: {new Date(match.updatedAt).toLocaleDateString()}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<CompareIcon />}
                              onClick={() => navigate(`/items/compare?lost=${match.lostItem?.id}&found=${match.foundItem?.id}`)}
                              sx={{
                                borderColor: matchLevel.color,
                                color: matchLevel.color,
                                fontWeight: 600,
                                borderRadius: '10px'
                              }}
                            >
                              Compare Details
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<ChatIcon />}
                              onClick={() => handleContactMatch(match)}
                              sx={{
                                background: `linear-gradient(135deg, ${matchLevel.color} 0%, ${matchLevel.color}cc 100%)`,
                                color: 'white',
                                fontWeight: 700,
                                borderRadius: '10px'
                              }}
                            >
                              Contact
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </MatchCard>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Contact Dialog */}
      <Dialog
        open={showContactDialog}
        onClose={() => setShowContactDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedMatch && (
          <>
            <DialogTitle>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Contact About Match
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Alert severity="info" sx={{ mb: 2, borderRadius: '8px' }}>
                You'll be connected through our secure messaging system.
              </Alert>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                Match: <strong>{selectedMatch.title}</strong>
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Similarity Score: <strong>{selectedMatch.similarityScore}%</strong>
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowContactDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleStartChat}
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  color: 'white'
                }}
              >
                Start Chat
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </PageContainer>
  );
};

export default MatchesPage;