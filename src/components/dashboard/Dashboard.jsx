import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  useTheme,
  TextField,
  InputAdornment,
  Avatar,
  Stack,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  TrendingUp,
  TrendingDown,
  Map as MapIcon,
  LocationOn as LocationIcon,
  FilterList as FilterIcon,
  Layers as LayersIcon,
  Visibility as ViewIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  AutoAwesome,
  LocationSearching,
  Insights,
  Close,
  Chat as ChatIcon,
  AdminPanelSettings,
  VerifiedUser,
  Flag,
  Category,
  Person,
  Message,
  Report,
  Timeline,
  BarChart,
  PieChart,
  Security,
  Email,
  Phone,
  Block
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Your components
import LoadingSpinner from '../common/UI/LoadingSpinner';
import StatsCard from './cards/StatsCard';
import WelcomeCard from './WelcomeCard';
import ItemForm from '../items/ItemForm';

import { itemService } from '../../services/itemService';
import { useAuth } from '../../context/AuthContext';
import { matchingService } from '../../services/matchingService';
import { adminService } from '../../services/adminService';
import { chatService } from '../../services/chatService';
import EnhancedRecentItemsCard from './EnhancedRecentItemsCard';

// Import CSS
import '../../styles/components/dashboard.css';

// Styled Components
const DashboardContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
}));

const StatsCardStyled = styled(Card)(({ theme, color }) => ({
  background: color === 'purple' ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' :
              color === 'blue' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' :
              color === 'teal' ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' :
              color === 'red' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
              color === 'green' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
              color === 'orange' ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' :
              color === 'indigo' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' :
              'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
  color: 'white',
  borderRadius: '16px',
  position: 'relative',
  overflow: 'visible',
  height: '100%',
  transition: 'all 0.3s ease',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
  border: '2px solid white',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.25)',
  },
}));

// Main Box Component
const MainBox = styled(Box)(({ theme, color = 'white' }) => ({
  backgroundColor: color,
  borderRadius: '20px',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  border: '3px solid #e2e8f0',
  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #06b6d4)',
  },
}));

const EnhancedSectionBox = styled(Box)(({ theme, color }) => ({
  backgroundColor: color === 'purple' ? '#f5f3ff' :
                  color === 'blue' ? '#eff6ff' :
                  color === 'teal' ? '#ecfeff' :
                  color === 'green' ? '#f0fdf4' :
                  color === 'orange' ? '#fff7ed' :
                  color === 'pink' ? '#fdf2f8' :
                  color === 'yellow' ? '#fefce8' :
                  color === 'cyan' ? '#ecfeff' :
                  '#ffffff',
  border: `3px solid ${color === 'purple' ? '#ddd6fe' :
                      color === 'blue' ? '#93c5fd' :
                      color === 'teal' ? '#67e8f9' :
                      color === 'green' ? '#86efac' :
                      color === 'orange' ? '#fdba74' :
                      color === 'pink' ? '#f9a8d4' :
                      color === 'yellow' ? '#fde047' :
                      color === 'cyan' ? '#67e8f9' :
                      '#e2e8f0'}`,
  borderRadius: '16px',
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    borderColor: color === 'purple' ? '#8b5cf6' :
                color === 'blue' ? '#3b82f6' :
                color === 'teal' ? '#06b6d4' :
                color === 'green' ? '#10b981' :
                color === 'orange' ? '#f97316' :
                color === 'pink' ? '#ec4899' :
                color === 'yellow' ? '#eab308' :
                color === 'cyan' ? '#06b6d4' :
                '#94a3b8',
  },
}));

// SmartMatchesPanel Component - MUST BE DEFINED FIRST
// SmartMatchesPanel Component - MUST BE DEFINED FIRST
const SmartMatchesPanel = ({ open, onClose, itemId, itemType }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && itemId) {
      console.log('🔄 SmartMatchesPanel: Fetching matches for item', itemId, 'type:', itemType);
      fetchMatches();
    }
  }, [open, itemId]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Always return mock data for now
      const mockMatches = [
        {
          similarityScore: 92,
          matchLevel: "EXCELLENT",
          qualityColor: "#10b981",
          matchReasons: [
            "Same category: Electronics",
            "Same location: Library area",
            "Same brand: Apple",
            "Same color: Space Gray",
            "Reported within 2 hours difference"
          ],
          lostItem: {
            id: itemId || 1,
            title: "MacBook Pro 14-inch",
            type: "LOST",
            category: "ELECTRONICS",
            location: "Main Library",
            campusZone: "ACADEMIC",
            building: "Main Library",
            color: "Space Gray",
            brand: "Apple",
            model: "M3 Pro",
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
            description: "Lost my MacBook in the library yesterday. It has a sticker on the back."
          },
          foundItem: {
            id: 2,
            title: "Found MacBook laptop in library",
            type: "FOUND",
            category: "ELECTRONICS",
            location: "Library computer lab",
            campusZone: "ACADEMIC",
            building: "Main Library",
            color: "Space Gray",
            brand: "Apple",
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
            description: "Found a MacBook near the computers. Has a space gray finish."
          }
        },
        {
          similarityScore: 78,
          matchLevel: "HIGH",
          qualityColor: "#3b82f6",
          matchReasons: [
            "Same category: Electronics",
            "Similar description keywords",
            "Same brand: Apple",
            "Reported within 3 days"
          ],
          lostItem: {
            id: itemId || 1,
            title: "MacBook Pro 14-inch",
            type: "LOST",
            category: "ELECTRONICS",
            location: "Main Library",
            campusZone: "ACADEMIC",
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
            description: "Lost my MacBook in the library yesterday."
          },
          foundItem: {
            id: 3,
            title: "Found MacBook Air in cafeteria",
            type: "FOUND",
            category: "ELECTRONICS",
            location: "Cafeteria",
            campusZone: "DINING",
            building: "Student Center",
            color: "Silver",
            brand: "Apple",
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
            description: "Found a MacBook Air in the cafeteria near the food court."
          }
        },
        {
          similarityScore: 58,
          matchLevel: "MEDIUM",
          qualityColor: "#f59e0b",
          matchReasons: [
            "Same category: Electronics",
            "Both reported in academic zone",
            "Similar time window"
          ],
          lostItem: {
            id: itemId || 1,
            title: "MacBook Pro 14-inch",
            type: "LOST",
            category: "ELECTRONICS",
            location: "Main Library",
            campusZone: "ACADEMIC",
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
            description: "Lost my MacBook in the library yesterday."
          },
          foundItem: {
            id: 4,
            title: "Found laptop in Science Building",
            type: "FOUND",
            category: "ELECTRONICS",
            location: "Science Building",
            campusZone: "ACADEMIC",
            building: "Science Building",
            color: "Black",
            brand: "Dell",
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
            description: "Found a laptop in the science building lobby."
          }
        }
      ];
      
      // Simulate API delay
      setTimeout(() => {
        setMatches(mockMatches);
        setLoading(false);
        console.log('✅ SmartMatchesPanel: Mock matches loaded:', mockMatches.length);
      }, 600);
      
    } catch (err) {
      console.error('❌ SmartMatchesPanel: Error:', err);
      setError('Failed to load matches. Please try again.');
      setLoading(false);
    }
  };

  const getTargetItem = (match) => {
    if (itemType === 'LOST') {
      return match.foundItem || {};
    } else {
      return match.lostItem || {};
    }
  };

  // Match score indicator with circular progress
  const MatchScoreCircle = ({ score, color }) => {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{
          position: 'relative',
          width: 70,
          height: 70,
          borderRadius: '50%',
          background: `conic-gradient(${color} ${score * 3.6}deg, ${color}20 0deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: 55,
            height: 55,
            borderRadius: '50%',
            backgroundColor: 'white',
          }
        }}>
          <Typography sx={{
            position: 'relative',
            fontWeight: 900,
            fontSize: '1.5rem',
            color: color,
            zIndex: 1,
          }}>
            {score}%
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '3px solid #e2e8f0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 2,
        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
        color: 'white',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.1,
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
          <AutoAwesome sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: 'white', fontSize: '1.5rem' }}>
              🎯 Smart Matches
            </Typography>
            <Typography variant="body2" component="div" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
              AI-powered matching results
            </Typography>
          </Box>
        </Box>
        <IconButton 
          onClick={onClose} 
          size="small"
          sx={{ 
            color: 'white',
            backgroundColor: 'rgba(255,255,255,0.2)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ py: 4, px: 3 }}>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            py: 8,
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: '16px',
            border: '2px dashed #cbd5e1'
          }}>
            <CircularProgress 
              size={60} 
              thickness={4}
              sx={{ 
                color: '#8b5cf6',
                mb: 3,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }} 
            />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 1 }}>
              Finding Perfect Matches...
            </Typography>
            <Typography variant="body2" component="div" sx={{ color: '#64748b', textAlign: 'center', maxWidth: 400 }}>
              Our AI is scanning through all items to find the best possible matches
            </Typography>
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2, 
              borderRadius: '12px',
              border: '2px solid #fecaca',
              '& .MuiAlert-icon': { fontSize: 28 }
            }}
          >
            <Typography variant="body1" component="div" sx={{ fontWeight: 600 }}>{error}</Typography>
          </Alert>
        ) : matches.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: '20px',
            border: '3px solid #e2e8f0',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <AutoAwesome sx={{ 
              fontSize: 80, 
              color: '#cbd5e1', 
              mb: 2,
              animation: 'pulse 2s infinite'
            }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#475569', mb: 1.5 }}>
              No matches found yet
            </Typography>
            <Typography variant="body2" component="div" sx={{ color: '#94a3b8', maxWidth: 400, mx: 'auto', mb: 3 }}>
              Don't worry! Our matching algorithm runs every hour. Check back soon for potential matches.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AutoAwesome />}
              sx={{
                borderColor: '#8b5cf6',
                color: '#8b5cf6',
                fontWeight: 700,
                borderRadius: '10px',
                px: 3,
                py: 1,
                '&:hover': {
                  borderColor: '#7c3aed',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                }
              }}
            >
              Check Again Later
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Summary Banner */}
            <Box sx={{
              background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
              borderRadius: '16px',
              p: 3,
              border: '2px solid #ddd6fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1
            }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e1b4b', mb: 0.5 }}>
                  🎯 {matches.length} Potential Matches Found
                </Typography>
                <Typography variant="body2" component="div" sx={{ color: '#6d28d9', fontWeight: 500 }}>
                  Based on location, category, description, and timing
                </Typography>
              </Box>
              <Chip
                label={`${itemType === 'LOST' ? 'Found Items' : 'Lost Items'}`}
                sx={{
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  px: 1.5,
                  py: 2
                }}
              />
            </Box>
            
            {matches.map((match, index) => {
              const targetItem = getTargetItem(match);
              const score = Math.round(match.similarityScore || 0);
              const scoreColor = match.qualityColor || '#8b5cf6';
              
              return (
                <Box
                  key={index}
                  sx={{
                    background: 'white',
                    borderRadius: '20px',
                    border: '3px solid white',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                      borderColor: scoreColor + '40',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '5px',
                      background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}80)`,
                    }
                  }}
                >
                  <Box sx={{ p: 3.5 }}>
                    {/* Header with score and basic info */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 3 }}>
                      <MatchScoreCircle score={score} color={scoreColor} />
                      
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                          <Chip 
                            label={match.matchLevel}
                            size="small"
                            sx={{ 
                              backgroundColor: scoreColor + '20',
                              color: scoreColor,
                              fontWeight: 800,
                              fontSize: '0.75rem',
                              height: 24,
                            }}
                          />
                          <Chip 
                            icon={<LocationIcon sx={{ fontSize: 14 }} />}
                            label={targetItem.location || 'Unknown'}
                            size="small"
                            sx={{ 
                              backgroundColor: '#f0f9ff',
                              color: '#0369a1',
                              fontWeight: 600,
                            }}
                          />
                          <Chip 
                            label={targetItem.category || 'Unknown'}
                            size="small"
                            sx={{ 
                              backgroundColor: '#f5f3ff',
                              color: '#7c3aed',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                        
                        <Typography variant="h5" sx={{ 
                          fontWeight: 900, 
                          color: '#1e1b4b',
                          fontSize: '1.25rem',
                          mb: 1
                        }}>
                          {targetItem.title || 'Untitled Item'}
                        </Typography>
                        
                        <Typography variant="body2" component="div" sx={{ 
                          color: '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          flexWrap: 'wrap'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                            {targetItem.createdAt ? new Date(targetItem.createdAt).toLocaleDateString() : 'Unknown date'}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                            {targetItem.campusZone || 'Unknown zone'}
                          </Box>
                          {targetItem.building && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Box sx={{ width: 14, height: 14, borderRadius: 2, backgroundColor: '#94a3b8' }} />
                              {targetItem.building}
                            </Box>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Description */}
                    {targetItem.description && (
                      <Box sx={{ 
                        mb: 3, 
                        p: 2.5,
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        position: 'relative'
                      }}>
                        <Typography variant="caption" sx={{ 
                          position: 'absolute',
                          top: -10,
                          left: 20,
                          backgroundColor: 'white',
                          px: 1,
                          color: '#64748b',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}>
                          📝 DESCRIPTION
                        </Typography>
                        <Typography variant="body2" component="div" sx={{ color: '#475569', lineHeight: 1.6 }}>
                          {targetItem.description}
                        </Typography>
                      </Box>
                    )}
                    
                    {/* Item Details Grid */}
                    <Box sx={{ 
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                      gap: 1.5,
                      mb: 3
                    }}>
                      {[
                        { label: 'Brand', value: targetItem.brand, color: '#dbeafe', icon: '🏷️' },
                        { label: 'Color', value: targetItem.color, color: '#fef3c7', icon: '🎨' },
                        { label: 'Model', value: targetItem.model, color: '#f0f9ff', icon: '🖥️' },
                        { label: 'Status', value: targetItem.status, color: '#f0fdf4', icon: '📊' },
                        { label: 'Zone', value: targetItem.campusZone, color: '#f5f3ff', icon: '📍' },
                        { label: 'Building', value: targetItem.building, color: '#fdf2f8', icon: '🏢' },
                      ].filter(item => item.value).map((detail, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            backgroundColor: detail.color,
                            borderRadius: '10px',
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5
                          }}
                        >
                          <Typography sx={{ fontSize: '1.2rem' }}>{detail.icon}</Typography>
                          <Box>
                            <Typography variant="caption" sx={{ 
                              display: 'block', 
                              color: '#475569',
                              fontWeight: 600,
                              fontSize: '0.7rem'
                            }}>
                              {detail.label}
                            </Typography>
                            <Typography variant="body2" component="div" sx={{ 
                              color: '#1e1b4b',
                              fontWeight: 700,
                              fontSize: '0.85rem'
                            }}>
                              {detail.value}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                    
                    {/* Match Reasons */}
                    {match.matchReasons && match.matchReasons.length > 0 && (
                      <Box sx={{ 
                        mb: 3,
                        p: 2.5,
                        background: `linear-gradient(135deg, ${scoreColor}10 0%, ${scoreColor}05 100%)`,
                        borderRadius: '16px',
                        border: `2px solid ${scoreColor}20`,
                        position: 'relative'
                      }}>
                        <Typography variant="subtitle2" sx={{ 
                          color: scoreColor,
                          fontWeight: 800,
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          fontSize: '0.9rem'
                        }}>
                          <AutoAwesome sx={{ fontSize: 18 }} />
                          Why This Is A Strong Match:
                        </Typography>
                        <Box sx={{ 
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                          gap: 1
                        }}>
                          {match.matchReasons.map((reason, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                p: 1.5,
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1,
                                border: `1px solid ${scoreColor}20`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: `0 4px 12px ${scoreColor}20`,
                                }
                              }}
                            >
                              <CheckCircleIcon sx={{ 
                                color: scoreColor,
                                fontSize: 16,
                                mt: 0.25,
                                flexShrink: 0
                              }} />
                              <Typography variant="body2" component="div" sx={{ 
                                color: '#475569',
                                fontSize: '0.85rem',
                                lineHeight: 1.4
                              }}>
                                {reason}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                    
                    {/* Actions */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      pt: 2.5,
                      borderTop: '2px dashed #e2e8f0'
                    }}>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                          variant="contained"
                          size="medium"
                          startIcon={<ArrowForwardIcon />}
                          sx={{
                            background: `linear-gradient(135deg, ${scoreColor} 0%, ${scoreColor}cc 100%)`,
                            color: 'white',
                            fontWeight: 800,
                            borderRadius: '12px',
                            px: 3,
                            py: 1.2,
                            boxShadow: `0 6px 20px ${scoreColor}40`,
                            '&:hover': { 
                              background: `linear-gradient(135deg, ${scoreColor}cc 0%, ${scoreColor} 100%)`,
                              transform: 'translateY(-2px)',
                              boxShadow: `0 10px 25px ${scoreColor}60`
                            }
                          }}
                        >
                          View Full Details
                        </Button>
                        <Button
                          variant="outlined"
                          size="medium"
                          startIcon={<NotificationsIcon />}
                          sx={{
                            borderColor: scoreColor,
                            color: scoreColor,
                            fontWeight: 700,
                            borderRadius: '12px',
                            px: 2.5,
                            '&:hover': {
                              borderColor: scoreColor,
                              backgroundColor: scoreColor + '10',
                            }
                          }}
                        >
                          Get Notified
                        </Button>
                      </Box>
                      
                      <Typography variant="caption" component="div" sx={{ 
                        color: '#94a3b8',
                        fontStyle: 'italic',
                        fontSize: '0.75rem'
                      }}>
                        Match #{index + 1} of {matches.length}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        py: 3, 
        borderTop: '2px solid #e2e8f0',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
          <AutoAwesome sx={{ color: '#8b5cf6', fontSize: 20 }} />
          <Typography variant="body2" component="div" sx={{ color: '#64748b', fontWeight: 500 }}>
            Smart matching updates every hour
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            onClick={onClose} 
            variant="outlined"
            sx={{ 
              fontWeight: 700,
              borderRadius: '12px',
              px: 3,
              py: 1.2,
              borderColor: '#cbd5e1',
              color: '#64748b',
              '&:hover': {
                borderColor: '#94a3b8',
                backgroundColor: '#f1f5f9'
              }
            }}
          >
            Close
          </Button>
          <Button 
            onClick={fetchMatches}
            variant="contained"
            startIcon={<RefreshIcon />}
            sx={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              fontWeight: 800,
              borderRadius: '12px',
              px: 3,
              py: 1.2,
              boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 30px rgba(139, 92, 246, 0.4)',
              }
            }}
          >
            Refresh Matches
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

// Enhanced Campus Map Component
const EnhancedCampusMap = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapView, setMapView] = useState('heatmap');
  
  const campusLocations = [
    { id: 1, name: 'Main Library', items: 15, color: '#8b5cf6', x: 30, y: 40, category: 'electronics' },
    { id: 2, name: 'Student Center', items: 12, color: '#3b82f6', x: 60, y: 30, category: 'documents' },
    { id: 3, name: 'Science Building', items: 8, color: '#06b6d4', x: 45, y: 60, category: 'electronics' },
    { id: 4, name: 'Cafeteria', items: 10, color: '#10b981', x: 70, y: 50, category: 'accessories' },
    { id: 5, name: 'Sports Complex', items: 5, color: '#f97316', x: 25, y: 70, category: 'clothing' },
    { id: 6, name: 'Dormitory A', items: 7, color: '#ec4899', x: 80, y: 20, category: 'documents' },
    { id: 7, name: 'Dormitory B', items: 6, color: '#6366f1', x: 85, y: 70, category: 'electronics' },
    { id: 8, name: 'Parking Lot', items: 4, color: '#8b5cf6', x: 10, y: 50, category: 'accessories' },
  ];

  return (
    <MainBox sx={{ 
      background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
      border: '3px solid #c7d2fe',
      boxShadow: '0 20px 40px rgba(139, 92, 246, 0.1)',
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        pb: 2,
        borderBottom: '3px solid #e2e8f0'
      }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 800, 
          color: '#1e1b4b',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}>
          <MapIcon sx={{ 
            color: '#8b5cf6', 
            fontSize: 28,
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            p: 1,
            borderRadius: '10px'
          }} />
          📍 Campus Map - Hotspots
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant={mapView === 'heatmap' ? 'contained' : 'outlined'}
            onClick={() => setMapView('heatmap')}
            sx={{
              borderRadius: '8px',
              fontWeight: 600,
              backgroundColor: mapView === 'heatmap' ? '#8b5cf6' : 'transparent',
              color: mapView === 'heatmap' ? 'white' : '#8b5cf6',
              borderColor: '#8b5cf6',
            }}
          >
            Heatmap
          </Button>
          <Button
            size="small"
            variant={mapView === 'categories' ? 'contained' : 'outlined'}
            onClick={() => setMapView('categories')}
            sx={{
              borderRadius: '8px',
              fontWeight: 600,
              backgroundColor: mapView === 'categories' ? '#3b82f6' : 'transparent',
              color: mapView === 'categories' ? 'white' : '#3b82f6',
              borderColor: '#3b82f6',
            }}
          >
            Categories
          </Button>
        </Box>
      </Box>

      <Box sx={{ 
        position: 'relative', 
        height: 320, 
        backgroundColor: '#f8fafc',
        borderRadius: '16px',
        border: '3px solid #e2e8f0',
        overflow: 'hidden',
        mb: 3,
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.05)'
      }}>
        <Box sx={{ position: 'absolute', width: '100%', height: '100%' }}>
          <Box sx={{ position: 'absolute', left: '20%', top: '40%', width: '60%', height: '4px', backgroundColor: '#cbd5e1', borderRadius: '2px' }} />
          <Box sx={{ position: 'absolute', left: '40%', top: '20%', width: '4px', height: '60%', backgroundColor: '#cbd5e1', borderRadius: '2px' }} />
          <Box sx={{ position: 'absolute', left: '60%', top: '60%', width: '30%', height: '4px', backgroundColor: '#cbd5e1', borderRadius: '2px' }} />
        </Box>

        {[
          { name: 'Library', left: '25%', top: '35%', width: '15%', height: '20%', color: '#f5f3ff' },
          { name: 'Student Center', left: '55%', top: '25%', width: '18%', height: '15%', color: '#eff6ff' },
          { name: 'Science Bldg', left: '40%', top: '55%', width: '20%', height: '25%', color: '#ecfeff' },
          { name: 'Cafeteria', left: '65%', top: '45%', width: '15%', height: '18%', color: '#f0fdf4' },
          { name: 'Sports Complex', left: '20%', top: '65%', width: '25%', height: '20%', color: '#fff7ed' },
        ].map((building, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              left: building.left,
              top: building.top,
              width: building.width,
              height: building.height,
              backgroundColor: building.color,
              border: '3px solid #cbd5e1',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#475569',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              zIndex: 1,
            }}
          >
            {building.name}
          </Box>
        ))}

        {campusLocations.map((location) => (
          <Box
            key={location.id}
            onClick={() => setSelectedLocation(location)}
            sx={{
              position: 'absolute',
              left: `${location.x}%`,
              top: `${location.y}%`,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              zIndex: 2,
              '&:hover': {
                transform: 'translate(-50%, -50%) scale(1.3)',
                zIndex: 3,
              },
            }}
          >
            <Box
              sx={{
                width: selectedLocation?.id === location.id ? 36 : 24 + location.items,
                height: selectedLocation?.id === location.id ? 36 : 24 + location.items,
                backgroundColor: mapView === 'categories' ? 
                  (location.category === 'electronics' ? '#8b5cf6' :
                   location.category === 'documents' ? '#3b82f6' :
                   location.category === 'clothing' ? '#06b6d4' :
                   location.category === 'accessories' ? '#10b981' : '#f97316') : location.color,
                borderRadius: '50%',
                border: `4px solid ${selectedLocation?.id === location.id ? 'white' : 'rgba(255,255,255,0.8)'}`,
                boxShadow: `0 0 0 ${selectedLocation?.id === location.id ? 8 : 4}px ${location.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: selectedLocation?.id === location.id ? '0.9rem' : '0.7rem',
                animation: selectedLocation?.id === location.id ? 'pulse 2s infinite' : 'none',
              }}
            >
              {location.items}
            </Box>
          </Box>
        ))}
      </Box>

      {selectedLocation ? (
        <EnhancedSectionBox color="blue">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <LocationIcon sx={{ 
              color: selectedLocation.color, 
              fontSize: 32,
              backgroundColor: `${selectedLocation.color}15`,
              p: 1.5,
              borderRadius: '12px'
            }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e1b4b' }}>
                {selectedLocation.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Badge color="primary" variant="dot" />
                {selectedLocation.items} items reported here
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<SearchIcon />}
              sx={{
                background: `linear-gradient(135deg, ${selectedLocation.color} 0%, ${selectedLocation.color}cc 100%)`,
                color: 'white',
                fontWeight: 700,
                borderRadius: '10px',
                px: 2,
                '&:hover': {
                  background: `linear-gradient(135deg, ${selectedLocation.color}cc 0%, ${selectedLocation.color} 100%)`,
                },
              }}
            >
              View Items
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<LocationIcon />}
              sx={{
                borderColor: selectedLocation.color,
                color: selectedLocation.color,
                fontWeight: 600,
                borderRadius: '10px',
                '&:hover': {
                  borderColor: selectedLocation.color,
                  backgroundColor: `${selectedLocation.color}10`,
                },
              }}
            >
              Directions
            </Button>
          </Box>
        </EnhancedSectionBox>
      ) : (
        <Box sx={{ textAlign: 'center', py: 3, backgroundColor: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1' }}>
          <MapIcon sx={{ color: '#94a3b8', fontSize: 40, mb: 1 }} />
          <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 600 }}>
            Click on a hotspot to see location details
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 1 }}>
            Larger circles indicate more lost/found items
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 3, p: 2.5, backgroundColor: '#f8fafc', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <LayersIcon fontSize="small" />
          Map Legend
        </Typography>
        <Grid container spacing={2}>
          {mapView === 'heatmap' ? (
            <>
              {[
                { color: '#8b5cf6', label: 'High Activity (10+ items)', size: 24 },
                { color: '#3b82f6', label: 'Medium Activity (5-9 items)', size: 20 },
                { color: '#06b6d4', label: 'Low Activity (1-4 items)', size: 16 },
              ].map((item, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: item.size, height: item.size, borderRadius: '50%', backgroundColor: item.color, border: '2px solid white' }} />
                    <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
                      {item.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </>
          ) : (
            <>
              {[
                { color: '#8b5cf6', label: 'Electronics', icon: '📱' },
                { color: '#3b82f6', label: 'Documents', icon: '📄' },
                { color: '#06b6d4', label: 'Clothing', icon: '👕' },
                { color: '#10b981', label: 'Accessories', icon: '👜' },
              ].map((item, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: item.color }} />
                    <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
                      {item.icon} {item.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </>
          )}
        </Grid>
      </Box>
    </MainBox>
  );
};

// Admin Verification Panel
const AdminVerificationPanel = ({ open, onClose, unverifiedUsers = [] }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleApprove = async (userId) => {
    try {
      setLoading(true);
      await adminService.approveUser(userId);
      // Remove from list
      const index = unverifiedUsers.findIndex(u => u.id === userId);
      if (index > -1) {
        unverifiedUsers.splice(index, 1);
      }
      setSelectedUser(null);
    } catch (error) {
      console.error('Error approving user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (userId) => {
    try {
      setLoading(true);
      await adminService.rejectUser(userId);
      // Remove from list
      const index = unverifiedUsers.findIndex(u => u.id === userId);
      if (index > -1) {
        unverifiedUsers.splice(index, 1);
      }
      setSelectedUser(null);
    } catch (error) {
      console.error('Error rejecting user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '3px solid #e2e8f0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 2,
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        color: 'white',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <VerifiedUser sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: 'white' }}>
              Campus Verification Queue
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              {unverifiedUsers.length} users pending verification
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ py: 4 }}>
        {unverifiedUsers.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <VerifiedUser sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#475569', mb: 1 }}>
              No pending verifications
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              All campus members have been verified
            </Typography>
          </Box>
        ) : (
          <List>
            {unverifiedUsers.map((user) => (
              <React.Fragment key={user.id}>
                <ListItem 
                  sx={{ 
                    backgroundColor: selectedUser?.id === user.id ? '#f0f9ff' : 'transparent',
                    borderRadius: '12px',
                    mb: 1,
                    '&:hover': { backgroundColor: '#f8fafc' }
                  }}
                  onClick={() => setSelectedUser(user)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#6366f1' }}>
                      {user.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {user.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          {user.email}
                        </Typography>
                        <Chip 
                          label="Pending Verification" 
                          size="small" 
                          sx={{ 
                            backgroundColor: '#fef3c7',
                            color: '#d97706',
                            mt: 0.5,
                            fontSize: '0.7rem'
                          }}
                        />
                      </>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(user.id);
                      }}
                      disabled={loading}
                      sx={{
                        backgroundColor: '#10b981',
                        '&:hover': { backgroundColor: '#059669' }
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(user.id);
                      }}
                      disabled={loading}
                      sx={{
                        borderColor: '#ef4444',
                        color: '#ef4444',
                        '&:hover': {
                          borderColor: '#dc2626',
                          backgroundColor: '#fee2e2'
                        }
                      }}
                    >
                      Reject
                    </Button>
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Content Moderation Panel
const ContentModerationPanel = ({ open, onClose, flaggedContent = [] }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleApproveContent = async (contentId) => {
    try {
      await adminService.approveContent(contentId);
      // Remove from list
      const index = flaggedContent.findIndex(c => c.id === contentId);
      if (index > -1) {
        flaggedContent.splice(index, 1);
      }
      setSelectedItem(null);
    } catch (error) {
      console.error('Error approving content:', error);
    }
  };

  const handleDeleteContent = async (contentId) => {
    try {
      await adminService.deleteContent(contentId);
      // Remove from list
      const index = flaggedContent.findIndex(c => c.id === contentId);
      if (index > -1) {
        flaggedContent.splice(index, 1);
      }
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '3px solid #e2e8f0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 2,
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: 'white',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Flag sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: 'white' }}>
              Content Moderation
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              {flaggedContent.length} items flagged for review
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ py: 4 }}>
        {flaggedContent.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#475569', mb: 1 }}>
              No flagged content
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              All content is clean and approved
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {flaggedContent.map((item) => (
              <EnhancedSectionBox 
                key={item.id} 
                color="red"
                sx={{ 
                  cursor: 'pointer',
                  border: selectedItem?.id === item.id ? '3px solid #ef4444' : '3px solid #fecaca'
                }}
                onClick={() => setSelectedItem(item)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                      {item.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={item.type} 
                        size="small" 
                        sx={{ 
                          backgroundColor: item.type === 'LOST' ? '#fef3c7' : '#d1fae5',
                          color: item.type === 'LOST' ? '#d97706' : '#059669'
                        }}
                      />
                      <Chip 
                        icon={<LocationIcon sx={{ fontSize: 14 }} />}
                        label={item.location}
                        size="small"
                      />
                      <Chip 
                        icon={<Person sx={{ fontSize: 14 }} />}
                        label={`Reported by: ${item.reportedBy}`}
                        size="small"
                      />
                    </Box>
                    <Typography variant="caption" sx={{ 
                      display: 'block', 
                      color: '#ef4444',
                      fontWeight: 600,
                      mt: 1
                    }}>
                      ⚠️ {item.flagReason || 'Flagged for review'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApproveContent(item.id);
                      }}
                      sx={{ 
                        color: '#10b981',
                        backgroundColor: '#f0fdf4',
                        '&:hover': { backgroundColor: '#dcfce7' }
                      }}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteContent(item.id);
                      }}
                      sx={{ 
                        color: '#ef4444',
                        backgroundColor: '#fee2e2',
                        '&:hover': { backgroundColor: '#fecaca' }
                      }}
                    >
                      <Close />
                    </IconButton>
                  </Box>
                </Box>
              </EnhancedSectionBox>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

// In-App Chat Panel - UPDATED VERSION with useRef
const ChatPanel = ({ open, onClose, messages = [] }) => {
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState(messages);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const chats = [
    {
      id: 1,
      user: 'John Doe',
      avatar: 'JD',
      lastMessage: 'Is this your MacBook?',
      timestamp: '2 mins ago',
      unread: true
    },
    {
      id: 2,
      user: 'Jane Smith',
      avatar: 'JS',
      lastMessage: 'I found your student ID',
      timestamp: '1 hour ago',
      unread: false
    },
    {
      id: 3,
      user: 'Alex Johnson',
      avatar: 'AJ',
      lastMessage: 'Can you describe the backpack?',
      timestamp: '3 hours ago',
      unread: false
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: chatMessages.length + 1,
        text: newMessage,
        sender: 'You',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      setChatMessages([...chatMessages, newMsg]);
      setNewMessage('');
      
      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simulate auto-reply
        setTimeout(() => {
          const autoReply = {
            id: chatMessages.length + 2,
            text: "Thanks for your message! I'll get back to you shortly.",
            sender: selectedChat?.user || 'User',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: false
          };
          setChatMessages(prev => [...prev, autoReply]);
        }, 1000);
      }, 2000);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '3px solid #e2e8f0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          height: '80vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 2,
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: 'white',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ChatIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: 'white' }}>
              In-App Messaging
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Secure communication about lost/found items
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, display: 'flex', height: '100%' }}>
        {/* Chat List */}
        <Box sx={{ 
          width: 300, 
          borderRight: '2px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          overflow: 'auto'
        }}>
          <List>
            {chats.map((chat) => (
              <ListItem
                key={chat.id}
                sx={{
                  backgroundColor: selectedChat?.id === chat.id ? '#e0f2fe' : 'transparent',
                  borderBottom: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f0f9ff' }
                }}
                onClick={() => setSelectedChat(chat)}
              >
                <ListItemAvatar>
                  <Badge
                    color="primary"
                    variant="dot"
                    invisible={!chat.unread}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                  >
                    <Avatar sx={{ bgcolor: '#3b82f6' }}>
                      {chat.avatar}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {chat.user}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {chat.lastMessage}
                    </Typography>
                  }
                />
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  {chat.timestamp}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
        
        {/* Chat Messages */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <Box sx={{ 
                p: 2, 
                borderBottom: '2px solid #e2e8f0',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <Avatar sx={{ bgcolor: '#3b82f6' }}>
                  {selectedChat.avatar}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {selectedChat.user}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                    ● Currently online
                  </Typography>
                </Box>
              </Box>
              
              {/* Messages Container */}
              <Box sx={{ 
                flex: 1, 
                p: 2, 
                overflow: 'auto',
                backgroundColor: '#f8fafc',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {chatMessages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.isOwn ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    <Box sx={{
                      maxWidth: '70%',
                      backgroundColor: msg.isOwn ? '#3b82f6' : 'white',
                      color: msg.isOwn ? 'white' : '#1e1b4b',
                      borderRadius: msg.isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      p: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                        {msg.text}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        display: 'block',
                        textAlign: 'right',
                        color: msg.isOwn ? 'rgba(255,255,255,0.7)' : '#94a3b8',
                        mt: 0.5
                      }}>
                        {msg.timestamp}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    mb: 2
                  }}>
                    <Box sx={{
                      backgroundColor: 'white',
                      borderRadius: '18px 18px 18px 4px',
                      p: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Box sx={{
                        display: 'flex',
                        gap: '2px'
                      }}>
                        <Box sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: '#64748b',
                          animation: 'pulse 1.5s infinite',
                          '&:nth-of-type(2)': { animationDelay: '0.2s' },
                          '&:nth-of-type(3)': { animationDelay: '0.4s' }
                        }} />
                        <Box sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: '#64748b',
                          animation: 'pulse 1.5s infinite',
                          '&:nth-of-type(2)': { animationDelay: '0.2s' },
                          '&:nth-of-type(3)': { animationDelay: '0.4s' }
                        }} />
                        <Box sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: '#64748b',
                          animation: 'pulse 1.5s infinite',
                          '&:nth-of-type(2)': { animationDelay: '0.2s' },
                          '&:nth-of-type(3)': { animationDelay: '0.4s' }
                        }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#64748b', ml: 1 }}>
                        typing...
                      </Typography>
                    </Box>
                  </Box>
                )}
                
                {/* Invisible element for auto-scroll */}
                <div ref={messagesEndRef} />
              </Box>
              
              {/* Message Input */}
              <Box sx={{ 
                p: 2, 
                borderTop: '2px solid #e2e8f0',
                backgroundColor: 'white'
              }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Type your message here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                        backgroundColor: '#f8fafc',
                        '& fieldset': {
                          borderColor: '#e2e8f0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#3b82f6',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#3b82f6',
                          boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: '#1e1b4b',
                        '&::placeholder': {
                          color: '#94a3b8',
                          opacity: 1,
                        }
                      }
                    }}
                    InputProps={{
                      endAdornment: newMessage && (
                        <InputAdornment position="end">
                          <IconButton 
                            size="small" 
                            onClick={() => setNewMessage('')}
                            sx={{ color: '#94a3b8' }}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    sx={{
                      borderRadius: '20px',
                      backgroundColor: newMessage.trim() ? '#3b82f6' : '#cbd5e1',
                      color: 'white',
                      fontWeight: 700,
                      minWidth: '100px',
                      '&:hover': { 
                        backgroundColor: newMessage.trim() ? '#2563eb' : '#cbd5e1' 
                      },
                      '&.Mui-disabled': {
                        backgroundColor: '#e2e8f0',
                        color: '#94a3b8'
                      }
                    }}
                  >
                    Send
                  </Button>
                </Box>
                <Typography variant="caption" sx={{ 
                  color: '#94a3b8', 
                  mt: 1, 
                  display: 'block',
                  textAlign: 'center'
                }}>
                  Press Enter to send • Messages are encrypted
                </Typography>
              </Box>
            </>
          ) : (
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexDirection: 'column',
              p: 4,
              backgroundColor: '#f8fafc'
            }}>
              <ChatIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#475569', mb: 1 }}>
                Select a conversation
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center', mb: 3 }}>
                Choose a chat from the list to start messaging
              </Typography>
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'white', 
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                maxWidth: 400
              }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>
                  💡 Tips for effective communication:
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                  • Be clear about item details<br/>
                  • Share meeting location preferences<br/>
                  • Verify identity before meeting<br/>
                  • Use campus safe zones for exchanges
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// Enhanced Quick Actions Component
const EnhancedQuickActionsCard = ({ 
  onReportItem, 
  onFindMatches, 
  onLocationSearch, 
  onOpenChat, 
  onOpenVerification,
  onOpenModeration,
  isAdmin = false 
}) => {
  const studentActions = [
    { 
      icon: <AddIcon />, 
      label: 'Report Item', 
      description: 'Lost or found something?',
      color: 'purple',
      onClick: onReportItem
    },
    { 
      icon: <AutoAwesome />,
      label: 'Find Matches', 
      description: 'Smart matching algorithm',
      color: 'teal',
      onClick: onFindMatches
    },
    { 
      icon: <SearchIcon />, 
      label: 'Search Items', 
      description: 'Browse lost & found items',
      color: 'blue',
      onClick: () => console.log('Search clicked')
    },
    { 
      icon: <LocationSearching />,
      label: 'Location Search', 
      description: 'Search by campus zone',
      color: 'orange',
      onClick: onLocationSearch
    },
    { 
      icon: <ChatIcon />, 
      label: 'Messages', 
      description: 'In-app messaging',
      color: 'indigo',
      onClick: onOpenChat
    },
    { 
      icon: <CheckCircleIcon />, 
      label: 'My Items', 
      description: 'View your reports',
      color: 'green',
      onClick: () => console.log('My Items clicked')
    },
  ];

  const adminActions = [
    { 
      icon: <VerifiedUser />, 
      label: 'Verify Users', 
      description: 'Campus verification queue',
      color: 'blue',
      onClick: onOpenVerification
    },
    { 
      icon: <Flag />,
      label: 'Content Moderation', 
      description: 'Review flagged content',
      color: 'red',
      onClick: onOpenModeration
    },
    { 
      icon: <AdminPanelSettings />, 
      label: 'Admin Panel', 
      description: 'Full admin controls',
      color: 'purple',
      onClick: () => console.log('Admin Panel clicked')
    },
    { 
      icon: <BarChart />,
      label: 'Analytics', 
      description: 'Platform analytics',
      color: 'teal',
      onClick: () => console.log('Analytics clicked')
    },
    { 
      icon: <DownloadIcon />, 
      label: 'Export Reports', 
      description: 'Download platform data',
      color: 'orange',
      onClick: () => console.log('Export clicked')
    },
    { 
      icon: <Security />, 
      label: 'User Management', 
      description: 'Manage user accounts',
      color: 'green',
      onClick: () => console.log('User Management clicked')
    },
  ];

  const actions = isAdmin ? adminActions : studentActions;

  return (
    <Grid container spacing={2}>
      {actions.map((action, index) => (
        <Grid item xs={6} sm={4} key={index}>
          <EnhancedSectionBox 
            color={action.color}
            onClick={action.onClick}
            sx={{ 
              cursor: 'pointer',
              textAlign: 'center',
              p: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ 
              width: 56,
              height: 56,
              borderRadius: '14px',
              backgroundColor: action.color === 'purple' ? 'rgba(139, 92, 246, 0.15)' :
                              action.color === 'blue' ? 'rgba(59, 130, 246, 0.15)' :
                              action.color === 'green' ? 'rgba(16, 185, 129, 0.15)' :
                              action.color === 'teal' ? 'rgba(6, 182, 212, 0.15)' :
                              action.color === 'orange' ? 'rgba(249, 115, 22, 0.15)' :
                              action.color === 'indigo' ? 'rgba(99, 102, 241, 0.15)' :
                              action.color === 'red' ? 'rgba(239, 68, 68, 0.15)' :
                              action.color === 'cyan' ? 'rgba(6, 182, 212, 0.15)' :
                              'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1.5,
              border: `2px solid ${action.color === 'purple' ? '#ddd6fe' :
                                      action.color === 'blue' ? '#93c5fd' :
                                      action.color === 'green' ? '#86efac' :
                                      action.color === 'teal' ? '#67e8f9' :
                                      action.color === 'orange' ? '#fdba74' :
                                      action.color === 'indigo' ? '#a5b4fc' :
                                      action.color === 'red' ? '#fca5a5' :
                                      action.color === 'cyan' ? '#67e8f9' :
                                      '#fca5a5'}`,
            }}>
              <Box sx={{ 
                color: action.color === 'purple' ? '#8b5cf6' :
                       action.color === 'blue' ? '#3b82f6' :
                       action.color === 'green' ? '#10b981' :
                       action.color === 'teal' ? '#06b6d4' :
                       action.color === 'orange' ? '#f97316' :
                       action.color === 'indigo' ? '#6366f1' :
                       action.color === 'red' ? '#ef4444' :
                       action.color === 'cyan' ? '#06b6d4' :
                       '#ef4444',
                fontSize: 28
              }}>
                {action.icon}
              </Box>
            </Box>
            
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 700, 
              color: '#1e1b4b',
              mb: 0.5
            }}>
              {action.label}
            </Typography>
            
            <Typography variant="caption" sx={{ 
              color: '#64748b',
              fontSize: '0.75rem'
            }}>
              {action.description}
            </Typography>
          </EnhancedSectionBox>
        </Grid>
      ))}
    </Grid>
  );
};

// Analytics Dashboard Component
const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [chartData, setChartData] = useState({
    itemsByCategory: [
      { name: 'Electronics', value: 35 },
      { name: 'Documents', value: 25 },
      { name: 'Clothing', value: 20 },
      { name: 'Accessories', value: 15 },
      { name: 'Other', value: 5 },
    ],
    recoveryRate: 72,
    avgResponseTime: '2.4 hours',
    topLocations: [
      { name: 'Main Library', items: 15, recovery: 10 },
      { name: 'Student Center', items: 12, recovery: 8 },
      { name: 'Cafeteria', items: 10, recovery: 7 },
      { name: 'Science Building', items: 8, recovery: 6 },
      { name: 'Sports Complex', items: 5, recovery: 3 },
    ]
  });

  return (
    <MainBox>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        pb: 2,
        borderBottom: '3px solid #f1f5f9'
      }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 900, 
          color: '#1e1b4b',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}>
          <Box sx={{ 
            width: 10, 
            height: 28, 
            backgroundColor: '#06b6d4',
            borderRadius: '5px'
          }} />
          📈 Analytics & Reporting
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            sx={{ borderRadius: '8px' }}
          >
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="quarter">Last Quarter</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <EnhancedSectionBox color="teal">
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 2 }}>
              Recovery Rate
            </Typography>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CircularProgress 
                variant="determinate" 
                value={chartData.recoveryRate} 
                size={120}
                thickness={4}
                sx={{ 
                  color: '#06b6d4',
                  mb: 2,
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  }
                }}
              />
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e1b4b' }}>
                {chartData.recoveryRate}%
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Items successfully recovered
              </Typography>
            </Box>
          </EnhancedSectionBox>
        </Grid>

        <Grid item xs={12} md={8}>
          <EnhancedSectionBox color="blue">
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 2 }}>
              Items by Category
            </Typography>
            <Box sx={{ mt: 2 }}>
              {chartData.itemsByCategory.map((category, index) => (
                <Box key={index} sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {category.value}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={category.value} 
                    sx={{ 
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        backgroundColor: '#3b82f6'
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </EnhancedSectionBox>
        </Grid>

        <Grid item xs={12}>
          <EnhancedSectionBox color="purple">
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 2 }}>
              Top Locations for Lost/Found Items
            </Typography>
            <Grid container spacing={2}>
              {chartData.topLocations.map((location, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: '#f5f3ff',
                    borderRadius: '12px',
                    border: '2px solid #ddd6fe'
                  }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                      {location.name}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        📍 {location.items} items
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                        ✅ {location.recovery} recovered
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </EnhancedSectionBox>
        </Grid>
      </Grid>
    </MainBox>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const theme = useTheme();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 156,
    lostItems: 89,
    foundItems: 67,
    resolvedCases: 42,
    activeUsers: 123,
    responseRate: '85%',
    pendingVerifications: 5,
    flaggedContent: 3
  });
  const [recentItems, setRecentItems] = useState([
    {
      id: 1,
      title: 'MacBook Pro 14"',
      type: 'lost',
      location: 'Library',
      timeAgo: '2 hours ago',
      category: 'Electronics',
      reportedBy: 'John Doe',
      hasMatches: true,
      isFlagged: false
    },
    {
      id: 2,
      title: 'Student ID Card',
      type: 'found',
      location: 'Cafeteria',
      timeAgo: '4 hours ago',
      category: 'Documents',
      reportedBy: 'Jane Smith',
      hasMatches: true,
      isFlagged: true
    },
    {
      id: 3,
      title: 'Wireless Headphones',
      type: 'lost',
      location: 'Student Center',
      timeAgo: '6 hours ago',
      category: 'Electronics',
      reportedBy: 'Alex Johnson',
      hasMatches: false,
      isFlagged: false
    },
    {
      id: 4,
      title: 'Backpack with Books',
      type: 'found',
      location: 'Science Building',
      timeAgo: '1 day ago',
      category: 'Accessories',
      reportedBy: 'Sarah Wilson',
      hasMatches: true,
      isFlagged: false
    }
  ]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [dateRange, setDateRange] = useState('week');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showMatchesPanel, setShowMatchesPanel] = useState(false);
  const [selectedItemForMatching, setSelectedItemForMatching] = useState(null);
  const [matchingStats, setMatchingStats] = useState({
    potentialMatches: 12,
    matchRate: '85%',
    smartMatches: 8
  });

  // New state for added features
  const [showVerificationPanel, setShowVerificationPanel] = useState(false);
  const [showModerationPanel, setShowModerationPanel] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const [unverifiedUsers, setUnverifiedUsers] = useState([
    { id: 1, name: 'New User 1', email: 'newuser1@university.edu', status: 'pending' },
    { id: 2, name: 'New User 2', email: 'newuser2@university.edu', status: 'pending' },
    { id: 3, name: 'New User 3', email: 'newuser3@university.edu', status: 'pending' },
  ]);

  const [flaggedContent, setFlaggedContent] = useState([
    { 
      id: 1, 
      title: 'Suspicious item', 
      type: 'LOST', 
      location: 'Unknown', 
      description: 'Item with inappropriate content',
      reportedBy: 'System',
      flagReason: 'Suspicious content'
    },
  ]);

  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'Hello, is this your MacBook?', sender: 'John Doe', timestamp: '10:30 AM', isOwn: false },
    { id: 2, text: 'Yes, that\'s mine!', sender: 'You', timestamp: '10:32 AM', isOwn: true },
    { id: 3, text: 'Great! Where can we meet?', sender: 'John Doe', timestamp: '10:33 AM', isOwn: false },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [dashboardStats, items] = await Promise.all([
          itemService.getDashboardStats(dateRange),
          itemService.getRecentItems(6)
        ]);
        
        setStats(dashboardStats);
        setRecentItems(items);
        
        try {
          const matchStats = await matchingService.getMatchingStats();
          if (matchStats && matchStats.data) {
            setMatchingStats(prev => ({
              ...prev,
              potentialMatches: matchStats.data.potentialMatches || prev.potentialMatches,
              matchRate: matchStats.data.matchRate || prev.matchRate,
              smartMatches: matchStats.data.smartMatches || matchStats.data.potentialMatches || prev.smartMatches
            }));
          }
        } catch (matchError) {
          console.log('Matching stats not available yet, using defaults');
        }

        // Fetch admin data if admin
        if (isAdmin) {
          try {
            const adminStats = await adminService.getAdminStats();
            if (adminStats) {
              setStats(prev => ({
                ...prev,
                pendingVerifications: adminStats.pendingVerifications || 5,
                flaggedContent: adminStats.flaggedContent || 3
              }));
            }
          } catch (error) {
            console.log('Admin stats not available');
          }
        }
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [dateRange, isAdmin]);

  const handleViewMatches = (item) => {
    console.log('Viewing matches for item:', item);
    setSelectedItemForMatching({
      id: item.id || 1,
      type: item.type ? item.type.toUpperCase() : 'LOST'
    });
    setShowMatchesPanel(true);
  };

  const handleSmartMatching = () => {
    const itemWithMatches = recentItems.find(item => item.hasMatches);
    if (itemWithMatches) {
      handleViewMatches(itemWithMatches);
    } else if (recentItems.length > 0) {
      handleViewMatches(recentItems[0]);
    } else {
      alert('No items available for matching. Please report an item first.');
    }
  };

  const handleLocationSearch = async () => {
    try {
      const zones = await matchingService.getCampusZones();
      if (zones && zones.length > 0) {
        alert(`Available campus zones: ${zones.join(', ')}\n\nThis feature will filter items by location zones.`);
      }
    } catch (error) {
      console.error('Error getting campus zones:', error);
      alert('Location search feature coming soon!');
    }
  };

  const handleFlagContent = (item) => {
    if (isAdmin) {
      setShowModerationPanel(true);
    } else {
      // For regular users, show flagging dialog
      const reason = prompt('Please specify why you are flagging this content:');
      if (reason) {
        itemService.flagContent(item.id, reason)
          .then(() => {
            alert('Thank you for reporting this content. Our admin team will review it.');
          })
          .catch(error => {
            console.error('Error flagging content:', error);
            alert('Failed to flag content. Please try again.');
          });
      }
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen showText text="Loading dashboard data..." />;
  }

  const adminStats = [
    { value: stats.pendingVerifications, label: 'Pending Verifications', color: 'indigo', icon: '👤' },
    { value: stats.flaggedContent, label: 'Flagged Content', color: 'red', icon: '🚩' },
  ];

  return (
    <DashboardContainer maxWidth="xl">
      <MainBox>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h3" gutterBottom sx={{ 
              fontWeight: 900, 
              color: '#1e1b4b',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Campus Lost & Found Dashboard
            </Typography>
            <Typography variant="h6" sx={{ 
              color: '#475569',
              fontWeight: 600,
              mb: 2 
            }}>
              Welcome back, <span style={{ 
                color: '#8b5cf6', 
                fontWeight: 800,
                fontSize: '1.1em'
              }}>{user?.name || 'User'}</span>! {isAdmin ? 'Manage campus lost & found platform.' : 'Track and recover lost items across campus.'}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Chip 
                icon={<AutoAwesome />}
                label="Smart Matching Active"
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  color: '#8b5cf6',
                  fontWeight: 600,
                  border: '1px solid #8b5cf6'
                }}
              />
              {user?.email && (
                <Chip 
                  icon={<VerifiedUser />}
                  label={`Verified: ${user.email.split('@')[1]}`}
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    fontWeight: 600,
                    border: '1px solid #10b981'
                  }}
                />
              )}
              {isAdmin && (
                <Chip 
                  icon={<AdminPanelSettings />}
                  label="Admin Mode"
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    color: '#6366f1',
                    fontWeight: 600,
                    border: '1px solid #6366f1'
                  }}
                />
              )}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isAdmin && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<Flag />}
                  onClick={() => setShowModerationPanel(true)}
                  sx={{
                    borderColor: '#ef4444',
                    color: '#ef4444',
                    fontWeight: 700,
                    borderRadius: '12px',
                    px: 2,
                    '&:hover': {
                      borderColor: '#dc2626',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    }
                  }}
                >
                  Moderation
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Insights />}
                  onClick={() => setShowAnalytics(true)}
                  sx={{
                    borderColor: '#06b6d4',
                    color: '#06b6d4',
                    fontWeight: 700,
                    borderRadius: '12px',
                    px: 2,
                    '&:hover': {
                      borderColor: '#0891b2',
                      backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    }
                  }}
                >
                  Analytics
                </Button>
              </>
            )}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowItemForm(true)}
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                color: 'white',
                fontWeight: 800,
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 30px rgba(139, 92, 246, 0.5)',
                }
              }}
            >
              Report Item
            </Button>
          </Box>
        </Box>

        <TextField
          fullWidth
          placeholder="Search lost/found items, locations, or categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#8b5cf6' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined"
                    startIcon={<LocationSearching />}
                    onClick={handleLocationSearch}
                    sx={{
                      borderColor: '#06b6d4',
                      color: '#06b6d4',
                      fontWeight: 600,
                      borderRadius: '10px',
                    }}
                  >
                    Location
                  </Button>
                  <Button 
                    variant="outlined"
                    startIcon={<ChatIcon />}
                    onClick={() => setShowChatPanel(true)}
                    sx={{
                      borderColor: '#6366f1',
                      color: '#6366f1',
                      fontWeight: 600,
                      borderRadius: '10px',
                    }}
                  >
                    Messages
                  </Button>
                  <Button variant="contained" sx={{ 
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                    color: 'white',
                    fontWeight: 700,
                    borderRadius: '10px',
                    px: 3
                  }}>
                    Search
                  </Button>
                </Box>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              border: '2px solid #e2e8f0',
              '&:hover': {
                borderColor: '#8b5cf6',
              },
              '&.Mui-focused': {
                borderColor: '#8b5cf6',
                boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
              }
            }
          }}
        />
      </MainBox>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { value: stats.totalItems, label: 'Total Items', color: 'purple', icon: '📊' },
          { value: stats.lostItems, label: 'Lost Items', color: 'red', icon: '🔍' },
          { value: stats.foundItems, label: 'Found Items', color: 'green', icon: '✅' },
          { value: stats.resolvedCases, label: 'Resolved Cases', color: 'teal', icon: '🎯' },
          { value: matchingStats.potentialMatches, label: 'Potential Matches', color: 'blue', icon: '🤝' },
          { value: matchingStats.matchRate, label: 'Match Rate', color: 'orange', icon: '⚡' },
          ...(isAdmin ? adminStats : [])
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={isAdmin ? 3 : 2} key={index}>
            <StatsCardStyled color={stat.color}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h2" sx={{ 
                      fontWeight: 900, 
                      color: 'white',
                      fontSize: '2.5rem',
                      lineHeight: 1.2,
                      mb: 0.5
                    }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      color: 'rgba(255,255,255,0.95)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {stat.label}
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontSize: '2rem', opacity: 0.9 }}>
                    {stat.icon}
                  </Typography>
                </Box>
              </CardContent>
            </StatsCardStyled>
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <MainBox>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3,
              pb: 2,
              borderBottom: '3px solid #f1f5f9'
            }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 900, 
                color: '#1e1b4b',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
              }}>
                <Box sx={{ 
                  width: 10, 
                  height: 28, 
                  backgroundColor: '#8b5cf6',
                  borderRadius: '5px'
                }} />
                📋 Recent Activity
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {isAdmin && (
                  <Button 
                    variant="outlined"
                    startIcon={<VerifiedUser />}
                    onClick={() => setShowVerificationPanel(true)}
                    sx={{
                      borderColor: '#6366f1',
                      color: '#6366f1',
                      fontWeight: 700,
                      borderRadius: '12px',
                      px: 2,
                      '&:hover': {
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      }
                    }}
                  >
                    Verify Users
                  </Button>
                )}
                <Button 
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                    fontWeight: 800,
                    borderRadius: '12px',
                    px: 3,
                    py: 1,
                    boxShadow: '0 6px 20px rgba(139, 92, 246, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
                    }
                  }}
                >
                  View All
                </Button>
              </Box>
            </Box>
            <EnhancedRecentItemsCard 
              items={recentItems} 
              onViewMatches={handleViewMatches}
              onFlagContent={handleFlagContent}
            />
          </MainBox>
          
          <MainBox>
            <Typography variant="h5" sx={{ 
              fontWeight: 900, 
              color: '#1e1b4b',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}>
              <Box sx={{ 
                width: 10, 
                height: 28, 
                backgroundColor: '#3b82f6',
                borderRadius: '5px'
              }} />
              ⚡ Quick Actions
            </Typography>
            <EnhancedQuickActionsCard 
              onReportItem={() => setShowItemForm(true)}
              onFindMatches={handleSmartMatching}
              onLocationSearch={handleLocationSearch}
              onOpenChat={() => setShowChatPanel(true)}
              onOpenVerification={() => setShowVerificationPanel(true)}
              onOpenModeration={() => setShowModerationPanel(true)}
              isAdmin={isAdmin}
            />
          </MainBox>

          {!isAdmin && (
            <MainBox>
              <Typography variant="h5" sx={{ 
                fontWeight: 900, 
                color: '#1e1b4b',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
              }}>
                <Box sx={{ 
                  width: 10, 
                  height: 28, 
                  backgroundColor: '#06b6d4',
                  borderRadius: '5px'
                }} />
                💬 Recent Messages
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { user: 'John Doe', message: 'Found your MacBook at the library', time: '2 mins ago', unread: true },
                  { user: 'Jane Smith', message: 'Is this your student ID card?', time: '1 hour ago', unread: false },
                  { user: 'Alex Johnson', message: 'Can we meet at the student center?', time: '3 hours ago', unread: false },
                ].map((msg, index) => (
                  <EnhancedSectionBox 
                    key={index}
                    color="blue"
                    onClick={() => setShowChatPanel(true)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#3b82f6' }}>
                        {msg.user.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {msg.user}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                            {msg.time}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                          {msg.message}
                        </Typography>
                      </Box>
                      {msg.unread && (
                        <Badge color="primary" variant="dot" />
                      )}
                    </Box>
                  </EnhancedSectionBox>
                ))}
              </Box>
            </MainBox>
          )}
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <EnhancedSectionBox color="purple">
            <WelcomeCard user={user} />
          </EnhancedSectionBox>
          
          <MainBox>
            <Typography variant="h5" sx={{ 
              fontWeight: 900, 
              color: '#1e1b4b',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}>
              <Box sx={{ 
                width: 10, 
                height: 28, 
                backgroundColor: '#06b6d4',
                borderRadius: '5px'
              }} />
              📊 Platform Insights
            </Typography>
            
            <EnhancedSectionBox color="blue">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CalendarIcon sx={{ 
                  color: '#3b82f6', 
                  fontSize: 36,
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  p: 2,
                  borderRadius: '14px'
                }} />
                <Box>
                  <Typography variant="body1" sx={{ 
                    color: '#1e40af',
                    fontWeight: 800,
                    fontSize: '1rem'
                  }}>
                    Avg. Response Time
                  </Typography>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 900, 
                    color: '#1e40af',
                    fontSize: '2.2rem'
                  }}>
                    2.4 hours
                  </Typography>
                </Box>
              </Box>
            </EnhancedSectionBox>
            
            <EnhancedSectionBox color="green">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AutoAwesome sx={{ 
                  color: '#10b981', 
                  fontSize: 36,
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  p: 2,
                  borderRadius: '14px'
                }} />
                <Box>
                  <Typography variant="body1" sx={{ 
                    color: '#065f46',
                    fontWeight: 800,
                    fontSize: '1rem'
                  }}>
                    Smart Matches Found
                  </Typography>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 900, 
                    color: '#065f46',
                    fontSize: '2.2rem'
                  }}>
                    {matchingStats.smartMatches}
                  </Typography>
                </Box>
              </Box>
            </EnhancedSectionBox>
            
            <EnhancedSectionBox color="orange">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationSearching sx={{ 
                  color: '#f97316', 
                  fontSize: 36,
                  backgroundColor: 'rgba(249, 115, 22, 0.15)',
                  p: 2,
                  borderRadius: '14px'
                }} />
                <Box>
                  <Typography variant="body1" sx={{ 
                    color: '#9a3412',
                    fontWeight: 800,
                    fontSize: '1rem'
                  }}>
                    Active Campus Zones
                  </Typography>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 900, 
                    color: '#9a3412',
                    fontSize: '2.2rem'
                  }}>
                    12 zones
                  </Typography>
                </Box>
              </Box>
            </EnhancedSectionBox>

            {isAdmin && (
              <EnhancedSectionBox color="red">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Flag sx={{ 
                    color: '#ef4444', 
                    fontSize: 36,
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    p: 2,
                    borderRadius: '14px'
                  }} />
                  <Box>
                    <Typography variant="body1" sx={{ 
                      color: '#991b1b',
                      fontWeight: 800,
                      fontSize: '1rem'
                    }}>
                      Items Pending Review
                    </Typography>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 900, 
                      color: '#991b1b',
                      fontSize: '2.2rem'
                    }}>
                      {stats.flaggedContent}
                    </Typography>
                  </Box>
                </Box>
              </EnhancedSectionBox>
            )}
          </MainBox>
          
          <MainBox sx={{ mt: 3 }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 900, 
              color: '#1e1b4b',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}>
              <Box sx={{ 
                width: 10, 
                height: 28, 
                backgroundColor: '#ec4899',
                borderRadius: '5px'
              }} />
              🏷️ Top Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { name: 'Electronics', count: 35, color: '#8b5cf6' },
                { name: 'Documents', count: 25, color: '#3b82f6' },
                { name: 'Clothing', count: 20, color: '#06b6d4' },
                { name: 'Accessories', count: 15, color: '#10b981' },
                { name: 'Books', count: 5, color: '#f97316' }
              ].map((category, index) => (
                <EnhancedSectionBox 
                  key={category.name} 
                  color="white"
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    borderColor: category.color,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      width: 16, 
                      height: 16, 
                      borderRadius: '50%', 
                      backgroundColor: category.color,
                      border: `2px solid ${category.color}80`
                    }} />
                    <Typography variant="body1" sx={{ 
                      color: '#1e1b4b',
                      fontWeight: 700 
                    }}>
                      {category.name}
                    </Typography>
                  </Box>
                  <Chip 
                    label={`${category.count}%`} 
                    size="small" 
                    sx={{ 
                      backgroundColor: `${category.color}20`, 
                      color: category.color,
                      fontWeight: 900,
                      fontSize: '0.9rem',
                      border: `2px solid ${category.color}40`
                    }}
                  />
                </EnhancedSectionBox>
              ))}
            </Box>
          </MainBox>
        </Grid>
      </Grid>

      {/* Floating Action Buttons */}
      <IconButton
        onClick={handleSmartMatching}
        sx={{
          position: 'fixed',
          bottom: 120,
          right: 40,
          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
          color: 'white',
          width: 68,
          height: 68,
          borderRadius: '50%',
          boxShadow: '0 15px 40px rgba(6, 182, 212, 0.5)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
            transform: 'scale(1.1)',
            boxShadow: '0 20px 50px rgba(6, 182, 212, 0.6)',
          },
          zIndex: 1000,
          border: '4px solid white',
          animation: 'pulse 2s infinite',
        }}
      >
        <AutoAwesome sx={{ fontSize: 30 }} />
      </IconButton>

      <IconButton
        onClick={() => setShowItemForm(true)}
        sx={{
          position: 'fixed',
          bottom: 40,
          right: 40,
          background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
          color: 'white',
          width: 68,
          height: 68,
          borderRadius: '50%',
          boxShadow: '0 15px 40px rgba(139, 92, 246, 0.5)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
            transform: 'scale(1.1)',
            boxShadow: '0 20px 50px rgba(139, 92, 246, 0.6)',
          },
          zIndex: 1000,
          border: '4px solid white',
          animation: 'pulse 2s infinite',
        }}
      >
        <AddIcon sx={{ fontSize: 30 }} />
      </IconButton>

      {showItemForm && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            p: 2,
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 900,
              maxHeight: '90vh',
              overflow: 'auto',
              borderRadius: '24px',
              backgroundColor: 'white',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
              border: '4px solid #8b5cf6',
            }}
          >
            <Box sx={{ p: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 4,
                pb: 3,
                borderBottom: '3px solid #f1f5f9'
              }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 900, 
                  color: '#1e1b4b',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Report Lost/Found Item
                </Typography>
                <IconButton 
                  onClick={() => setShowItemForm(false)} 
                  sx={{ 
                    color: '#ef4444',
                    backgroundColor: '#fee2e2',
                    border: '2px solid #fecaca',
                    '&:hover': {
                      backgroundColor: '#fecaca',
                    }
                  }}
                >
                  ✕
                </IconButton>
              </Box>
              <ItemForm onClose={() => setShowItemForm(false)} />
            </Box>
          </Box>
        </Box>
      )}

      {/* Smart Matches Panel - Now defined at the top */}
      <SmartMatchesPanel
        open={showMatchesPanel}
        onClose={() => {
          setShowMatchesPanel(false);
          setSelectedItemForMatching(null);
        }}
        itemId={selectedItemForMatching?.id}
        itemType={selectedItemForMatching?.type}
      />

      {/* Admin Verification Panel */}
      <AdminVerificationPanel
        open={showVerificationPanel}
        onClose={() => setShowVerificationPanel(false)}
        unverifiedUsers={unverifiedUsers}
      />

      {/* Content Moderation Panel */}
      <ContentModerationPanel
        open={showModerationPanel}
        onClose={() => setShowModerationPanel(false)}
        flaggedContent={flaggedContent}
      />

      {/* Chat Panel */}
      <ChatPanel
        open={showChatPanel}
        onClose={() => setShowChatPanel(false)}
        messages={chatMessages}
      />

      {/* Analytics Dashboard */}
      {showAnalytics && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            p: 2,
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 1200,
              maxHeight: '90vh',
              overflow: 'auto',
              borderRadius: '24px',
              backgroundColor: 'white',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
              border: '4px solid #06b6d4',
            }}
          >
            <Box sx={{ p: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 4,
                pb: 3,
                borderBottom: '3px solid #f1f5f9'
              }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 900, 
                  color: '#1e1b4b',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Platform Analytics Dashboard
                </Typography>
                <IconButton 
                  onClick={() => setShowAnalytics(false)} 
                  sx={{ 
                    color: '#ef4444',
                    backgroundColor: '#fee2e2',
                    border: '2px solid #fecaca',
                    '&:hover': {
                      backgroundColor: '#fecaca',
                    }
                  }}
                >
                  ✕
                </IconButton>
              </Box>
              <AnalyticsDashboard />
            </Box>
          </Box>
        </Box>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;