import React, { useState, useEffect } from 'react';
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
  Alert,
  Snackbar
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
  BugReport as BugReportIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Your components
import LoadingSpinner from '../common/UI/LoadingSpinner';
import StatsCard from './cards/StatsCard';
import WelcomeCard from './WelcomeCard';
import ItemForm from '../items/ItemForm';

import { itemService } from '../../services/itemService';
import { useAuth } from '../../context/AuthContext';

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

// Improved Box Components
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

// Enhanced Recent Items Card Component
const EnhancedRecentItemsCard = ({ items = [] }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {items.length > 0 ? (
        items.map((item, index) => (
          <EnhancedSectionBox 
            key={index} 
            color={item.type === 'lost' ? 'orange' : 'green'}
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
              <Avatar sx={{ 
                backgroundColor: item.type === 'lost' ? '#fef3c7' : '#d1fae5',
                color: item.type === 'lost' ? '#d97706' : '#059669',
                fontWeight: 700,
                width: 48,
                height: 48
              }}>
                {item.type === 'lost' ? '❓' : '✅'}
              </Avatar>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  color: '#1e1b4b',
                  fontSize: '1rem',
                  mb: 0.5
                }}>
                  {item.title}
                </Typography>
                
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip 
                    icon={<LocationIcon />}
                    label={item.location}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      color: '#8b5cf6',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  />
                  <Chip 
                    icon={<CalendarIcon />}
                    label={item.timeAgo}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      color: '#3b82f6',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  />
                  <Chip 
                    label={item.category}
                    size="small"
                    sx={{ 
                      backgroundColor: item.category === 'Electronics' ? 'rgba(139, 92, 246, 0.1)' :
                                      item.category === 'Documents' ? 'rgba(59, 130, 246, 0.1)' :
                                      item.category === 'Clothing' ? 'rgba(6, 182, 212, 0.1)' :
                                      'rgba(16, 185, 129, 0.1)',
                      color: item.category === 'Electronics' ? '#8b5cf6' :
                             item.category === 'Documents' ? '#3b82f6' :
                             item.category === 'Clothing' ? '#06b6d4' :
                             '#10b981',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  />
                </Stack>
              </Box>
            </Box>
            
            <Button
              variant="contained"
              size="small"
              startIcon={<ViewIcon />}
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white',
                fontWeight: 700,
                borderRadius: '10px',
                px: 2.5,
                py: 1,
                minWidth: 'auto',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 18px rgba(139, 92, 246, 0.4)',
                }
              }}
            >
              View
            </Button>
          </EnhancedSectionBox>
        ))
      ) : (
        <Box sx={{ textAlign: 'center', py: 4, backgroundColor: '#f8fafc', borderRadius: '12px' }}>
          <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 600 }}>
            No recent activity found
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 1 }}>
            Start by reporting a lost or found item
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Enhanced Quick Actions Component
const EnhancedQuickActionsCard = ({ onReportItem }) => {
  const actions = [
    { 
      icon: <AddIcon />, 
      label: 'Report Item', 
      description: 'Lost or found something?',
      color: 'purple',
      onClick: onReportItem
    },
    { 
      icon: <SearchIcon />, 
      label: 'Search Items', 
      description: 'Browse lost & found items',
      color: 'blue',
      onClick: () => console.log('Search clicked')
    },
    { 
      icon: <CheckCircleIcon />, 
      label: 'My Items', 
      description: 'View your reports',
      color: 'green',
      onClick: () => console.log('My Items clicked')
    },
    { 
      icon: <MapIcon />, 
      label: 'Campus Map', 
      description: 'View hotspots',
      color: 'teal',
      onClick: () => console.log('Map clicked')
    },
    { 
      icon: <DownloadIcon />, 
      label: 'Export Data', 
      description: 'Download reports',
      color: 'orange',
      onClick: () => console.log('Export clicked')
    },
    { 
      icon: <WarningIcon />, 
      label: 'Help Center', 
      description: 'Get assistance',
      color: 'red',
      onClick: () => console.log('Help clicked')
    },
  ];

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
                                      '#fca5a5'}`,
            }}>
              <Box sx={{ 
                color: action.color === 'purple' ? '#8b5cf6' :
                       action.color === 'blue' ? '#3b82f6' :
                       action.color === 'green' ? '#10b981' :
                       action.color === 'teal' ? '#06b6d4' :
                       action.color === 'orange' ? '#f97316' :
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

      {/* Enhanced Interactive Map Container */}
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
        {/* Campus Roads */}
        <Box sx={{ position: 'absolute', width: '100%', height: '100%' }}>
          <Box sx={{ position: 'absolute', left: '20%', top: '40%', width: '60%', height: '4px', backgroundColor: '#cbd5e1', borderRadius: '2px' }} />
          <Box sx={{ position: 'absolute', left: '40%', top: '20%', width: '4px', height: '60%', backgroundColor: '#cbd5e1', borderRadius: '2px' }} />
          <Box sx={{ position: 'absolute', left: '60%', top: '60%', width: '30%', height: '4px', backgroundColor: '#cbd5e1', borderRadius: '2px' }} />
        </Box>

        {/* Enhanced Building Outlines */}
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

        {/* Enhanced Hotspots */}
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

      {/* Enhanced Location Details */}
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

      {/* Enhanced Legend */}
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

const Dashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [apiError, setApiError] = useState('');
  const [stats, setStats] = useState({
    totalItems: 156,
    lostItems: 89,
    foundItems: 67,
    resolvedCases: 42,
    activeUsers: 123,
    responseRate: '85%'
  });
  const [recentItems, setRecentItems] = useState([
    {
      id: 1,
      title: 'MacBook Pro 14"',
      type: 'lost',
      location: 'Library',
      timeAgo: '2 hours ago',
      category: 'Electronics',
      reportedBy: 'John Doe'
    },
    {
      id: 2,
      title: 'Student ID Card',
      type: 'found',
      location: 'Cafeteria',
      timeAgo: '4 hours ago',
      category: 'Documents',
      reportedBy: 'Jane Smith'
    },
    {
      id: 3,
      title: 'Wireless Headphones',
      type: 'lost',
      location: 'Student Center',
      timeAgo: '6 hours ago',
      category: 'Electronics',
      reportedBy: 'Alex Johnson'
    },
    {
      id: 4,
      title: 'Backpack with Books',
      type: 'found',
      location: 'Science Building',
      timeAgo: '1 day ago',
      category: 'Accessories',
      reportedBy: 'Sarah Wilson'
    }
  ]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [dateRange, setDateRange] = useState('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);

  const addDebugLog = (message, type = 'info') => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const logEntry = { timestamp, message, type };
    setDebugLogs(prev => [logEntry, ...prev.slice(0, 9)]); // Keep last 10 logs
    console.log(`[${timestamp}] ${message}`);
  };

  const testAPIConnection = async () => {
    addDebugLog('🧪 Starting API connection test...', 'debug');
    setApiStatus('loading');
    
    try {
      const token = localStorage.getItem('token');
      addDebugLog(`🔑 Token exists: ${!!token}`, 'debug');
      
      if (!token) {
        setApiError('No authentication token found. Please log in.');
        setApiStatus('error');
        return;
      }
      
      addDebugLog('📡 Testing connection to: http://localhost:8082/api/items', 'debug');
      
      const response = await fetch('http://localhost:8082/api/items', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      addDebugLog(`📥 Response status: ${response.status}`, response.ok ? 'success' : 'error');
      
      const data = await response.json();
      addDebugLog(`📊 Response data: ${JSON.stringify(data).substring(0, 100)}...`, 'debug');
      
      if (response.ok) {
        setApiStatus('success');
        addDebugLog('✅ API connection successful!', 'success');
        return data;
      } else {
        setApiError(data.message || `API returned ${response.status}`);
        setApiStatus('error');
        addDebugLog(`❌ API error: ${data.message || response.status}`, 'error');
        return null;
      }
      
    } catch (error) {
      setApiError(error.message);
      setApiStatus('error');
      addDebugLog(`💥 Fetch error: ${error.message}`, 'error');
      return null;
    }
  };

  const loadDashboardData = async () => {
    addDebugLog('🔄 Loading dashboard data...', 'info');
    setApiStatus('loading');
    
    try {
      // Clear previous errors
      setApiError('');
      
      // Step 1: Test direct API connection first
      const apiTestResult = await testAPIConnection();
      if (!apiTestResult) {
        addDebugLog('❌ API test failed, using fallback data', 'warning');
        setApiStatus('error');
        return;
      }
      
      // Step 2: Get dashboard stats
      addDebugLog('📊 Getting dashboard stats...', 'info');
      const dashboardStats = await itemService.getDashboardStats();
      addDebugLog(`✅ Dashboard stats loaded: ${dashboardStats.totalItems} total items`, 'success');
      
      // Step 3: Get recent items
      addDebugLog('📦 Getting recent items...', 'info');
      const items = await itemService.getRecentItems(6);
      addDebugLog(`✅ Recent items loaded: ${items.length} items`, 'success');
      
      // Update state
      setStats(dashboardStats);
      setRecentItems(items);
      setApiStatus('success');
      addDebugLog('🎉 Dashboard data loaded successfully!', 'success');
      
    } catch (error) {
      console.error('Dashboard data error:', error);
      setApiError(error.message);
      setApiStatus('error');
      addDebugLog(`❌ Failed to load dashboard: ${error.message}`, 'error');
      
      // Use fallback data
      setStats({
        totalItems: 156,
        lostItems: 89,
        foundItems: 67,
        resolvedCases: 42,
        activeUsers: 123,
        responseRate: '85%'
      });
    } finally {
      setLoading(false);
      addDebugLog('🏁 Loading complete', 'info');
    }
  };

  useEffect(() => {
    addDebugLog('🚀 Dashboard component mounted', 'info');
    addDebugLog(`👤 User: ${user?.name || 'Not logged in'}`, 'info');
    addDebugLog(`🔧 itemService available: ${!!itemService}`, 'debug');
    
    const loadData = async () => {
      await loadDashboardData();
    };
    
    loadData();
    
    // Cleanup function
    return () => {
      addDebugLog('🗑️ Dashboard component unmounting', 'info');
    };
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen showText text="Loading dashboard data..." />;
  }

  return (
    <DashboardContainer maxWidth="xl">
      {/* Debug Panel */}
      {showDebugPanel && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: 400,
          height: '100vh',
          bgcolor: 'rgba(0, 0, 0, 0.95)',
          color: 'white',
          zIndex: 9999,
          p: 2,
          overflow: 'auto',
          borderLeft: '2px solid #8b5cf6'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#8b5cf6' }}>
              🐛 Debug Panel
            </Typography>
            <IconButton onClick={() => setShowDebugPanel(false)} sx={{ color: 'white' }}>
              ✕
            </IconButton>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#94a3b8' }}>
              API Status: 
              <span style={{ 
                color: apiStatus === 'success' ? '#10b981' : 
                       apiStatus === 'error' ? '#ef4444' : 
                       apiStatus === 'loading' ? '#f59e0b' : '#64748b',
                marginLeft: 8
              }}>
                {apiStatus.toUpperCase()}
              </span>
            </Typography>
            
            <Button
              fullWidth
              variant="contained"
              startIcon={<BugReportIcon />}
              onClick={testAPIConnection}
              sx={{ mb: 2 }}
            >
              Test API Connection
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadDashboardData}
              sx={{ mb: 2 }}
            >
              Reload Dashboard
            </Button>
            
            {apiError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {apiError}
              </Alert>
            )}
          </Box>
          
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#94a3b8' }}>
            Debug Logs:
          </Typography>
          <Box sx={{ maxHeight: 300, overflow: 'auto', bgcolor: 'rgba(255,255,255,0.05)', p: 1, borderRadius: 1 }}>
            {debugLogs.map((log, index) => (
              <Box key={index} sx={{ 
                fontFamily: 'monospace', 
                fontSize: '0.75rem',
                color: log.type === 'error' ? '#ef4444' : 
                       log.type === 'success' ? '#10b981' : 
                       log.type === 'warning' ? '#f59e0b' : '#94a3b8',
                mb: 0.5
              }}>
                [{log.timestamp}] {log.message}
              </Box>
            ))}
            {debugLogs.length === 0 && (
              <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                No debug logs yet
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {/* Debug Toggle Button */}
      <IconButton
        onClick={() => setShowDebugPanel(!showDebugPanel)}
        sx={{
          position: 'fixed',
          bottom: 120,
          right: 20,
          background: '#8b5cf6',
          color: 'white',
          width: 56,
          height: 56,
          borderRadius: '50%',
          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
          zIndex: 1000,
          border: '2px solid white',
          '&:hover': {
            background: '#7c3aed',
            transform: 'scale(1.1)',
          }
        }}
      >
        <BugReportIcon />
      </IconButton>

      {/* Dashboard Header */}
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
              }}>{user?.name || 'User'}</span>! Track and recover lost items across campus.
            </Typography>
            
            {/* API Status Indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                backgroundColor: apiStatus === 'success' ? '#10b981' : 
                                apiStatus === 'error' ? '#ef4444' : 
                                apiStatus === 'loading' ? '#f59e0b' : '#64748b'
              }} />
              <Typography variant="caption" sx={{ 
                color: apiStatus === 'success' ? '#059669' : 
                       apiStatus === 'error' ? '#dc2626' : 
                       apiStatus === 'loading' ? '#d97706' : '#64748b'
              }}>
                {apiStatus === 'success' ? 'Connected to API' : 
                 apiStatus === 'error' ? 'API Connection Error' : 
                 apiStatus === 'loading' ? 'Connecting...' : 'API Status'}
              </Typography>
            </Box>
          </Box>
          
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

        {/* Search Bar */}
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
                <Button variant="contained" sx={{ 
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                  color: 'white',
                  fontWeight: 700,
                  borderRadius: '10px',
                  px: 3
                }}>
                  Search
                </Button>
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

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { value: stats.totalItems, label: 'Total Items', color: 'purple', icon: '📊' },
          { value: stats.lostItems, label: 'Lost Items', color: 'red', icon: '🔍' },
          { value: stats.foundItems, label: 'Found Items', color: 'green', icon: '✅' },
          { value: stats.resolvedCases, label: 'Resolved Cases', color: 'teal', icon: '🎯' },
          { value: stats.activeUsers, label: 'Active Users', color: 'blue', icon: '👥' },
          { value: stats.responseRate, label: 'Response Rate', color: 'orange', icon: '⚡' }
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
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
      
      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} lg={8}>
          {/* Recent Activity */}
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
              <Button 
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={() => {
                  addDebugLog('View All recent items clicked', 'info');
                }}
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
            <EnhancedRecentItemsCard items={recentItems} />
          </MainBox>
          
          {/* Quick Actions */}
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
            <EnhancedQuickActionsCard onReportItem={() => {
              addDebugLog('Report Item clicked', 'info');
              setShowItemForm(true);
            }} />
          </MainBox>

          {/* Campus Map */}
          <EnhancedCampusMap />
        </Grid>
        
        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          {/* Welcome Card */}
          <EnhancedSectionBox color="purple">
            <WelcomeCard user={user} />
          </EnhancedSectionBox>
          
          {/* Quick Stats */}
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
              📊 Quick Stats
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
                <NotificationsIcon sx={{ 
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
                    Success Rate
                  </Typography>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 900, 
                    color: '#065f46',
                    fontSize: '2.2rem'
                  }}>
                    78.5%
                  </Typography>
                </Box>
              </Box>
            </EnhancedSectionBox>
            
            <EnhancedSectionBox color="orange">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SearchIcon sx={{ 
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
                    Active Locations
                  </Typography>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 900, 
                    color: '#9a3412',
                    fontSize: '2.2rem'
                  }}>
                    12 areas
                  </Typography>
                </Box>
              </Box>
            </EnhancedSectionBox>
          </MainBox>
          
          {/* Categories */}
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

      {/* Floating Action Button */}
      <IconButton
        onClick={() => {
          addDebugLog('Report Item FAB clicked', 'info');
          setShowItemForm(true);
        }}
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

      {/* Item Submission Modal */}
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
                  onClick={() => {
                    addDebugLog('Item form closed', 'info');
                    setShowItemForm(false);
                  }} 
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
              <ItemForm 
                onClose={() => setShowItemForm(false)} 
                onSuccess={() => {
                  addDebugLog('Item created successfully! Reloading dashboard...', 'success');
                  loadDashboardData();
                }}
              />
            </Box>
          </Box>
        </Box>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={apiStatus === 'error' && !!apiError}
        autoHideDuration={6000}
        onClose={() => setApiError('')}
      >
        <Alert severity="error" onClose={() => setApiError('')}>
          {apiError}
        </Alert>
      </Snackbar>
    </DashboardContainer>
  );
};

export default Dashboard;