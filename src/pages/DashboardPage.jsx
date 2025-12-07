import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Avatar,
  Chip,
  LinearProgress,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
  Stack,
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  SearchOff as LostAndFoundIcon,        
  FindInPage as FoundItemIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  Place as PlaceIcon,
  Category as CategoryIcon,
  Update as UpdateIcon,
  ArrowForward as ArrowForwardIcon,
  Visibility as VisibilityIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../components/common/UI/AnimatedBackground';
import GlassCard from '../components/common/UI/GlassCard';
import LoadingSpinner from '../components/common/UI/LoadingSpinner';
import StatsCard from '../components/dashboard/cards/StatsCard';
import RecentItemsCard from '../components/dashboard/cards/RecentItemsCard';
import QuickActionsCard from '../components/dashboard/cards/QuickActionsCard';
import WelcomeCard from '../components/dashboard/WelcomeCard';
import UserProfile from '../components/dashboard/UserProfile';

// Mock data - In a real app, this would come from an API
const mockStats = {
  totalLost: 42,
  totalFound: 38,
  itemsReturned: 15,
  pendingClaims: 8,
  successRate: '72%',
  activeUsers: 156
};

const mockRecentItems = [
  {
    id: 1,
    title: "iPhone 14 Pro Max",
    type: "lost",
    category: "Electronics",
    date: "2024-01-15",
    location: "Library - 3rd Floor",
    status: "searching",
    image: "https://via.placeholder.com/100"
  },
  {
    id: 2,
    title: "Student ID Card",
    type: "found",
    category: "Personal Items",
    date: "2024-01-14",
    location: "Cafeteria",
    status: "claimed",
    image: "https://via.placeholder.com/100"
  },
  {
    id: 3,
    title: "Laptop Bag",
    type: "found",
    category: "Bags & Cases",
    date: "2024-01-13",
    location: "Lecture Hall B",
    status: "unclaimed",
    image: "https://via.placeholder.com/100"
  },
  {
    id: 4,
    title: "Wireless Headphones",
    type: "lost",
    category: "Electronics",
    date: "2024-01-12",
    location: "Gym",
    status: "searching",
    image: "https://via.placeholder.com/100"
  }
];

const mockQuickActions = [
  {
    title: "Report Lost Item",
    description: "Can't find something? Report it here",
    icon: <LostAndFoundIcon />,
    path: "/report-lost",
    color: "#ff6b6b"
  },
  {
    title: "Report Found Item",
    description: "Found something? Help return it",
    icon: <FoundItemIcon />,
    path: "/report-found",
    color: "#4ecdc4"
  },
  {
    title: "Browse Items",
    description: "View all lost and found items",
    icon: <SearchIcon />,
    path: "/browse",
    color: "#45b7d1"
  },
  {
    title: "My Items",
    description: "View your reported items",
    icon: <AccountIcon />,
    path: "/my-items",
    color: "#96ceb4"
  }
];

const mockNotifications = [
  { id: 1, message: "Someone found an item matching your lost laptop", time: "2 hours ago", read: false },
  { id: 2, message: "Your claim on the student ID has been approved", time: "1 day ago", read: true },
  { id: 3, message: "New items matching your interests were added", time: "2 days ago", read: false }
];

const DashboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(mockStats);
  const [recentItems, setRecentItems] = useState(mockRecentItems);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadNotifications(0);
  };

  const handleQuickAction = (path) => {
    navigate(path);
  };

  const handleViewItem = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'claimed': return 'success';
      case 'searching': return 'warning';
      case 'unclaimed': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'claimed': return <CheckCircleIcon fontSize="small" />;
      case 'searching': return <PendingIcon fontSize="small" />;
      case 'unclaimed': return <UpdateIcon fontSize="small" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      position: 'relative',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      pb: 4
    }}>
      <AnimatedBackground />
      
      {/* Header */}
      <Paper 
        elevation={0}
        sx={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          mb: 4
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            py: 2
          }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                }}
              >
                <Typography
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                  }}
                >
                  🔍
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontWeight: 'bold',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Campus Lost & Found
              </Typography>
            </Box>

            {/* Navigation Tabs */}
            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {['overview', 'lost', 'found', 'claims', 'analytics'].map((tab) => (
                <Button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  sx={{
                    color: activeTab === tab ? 'white' : 'rgba(255, 255, 255, 0.7)',
                    textTransform: 'capitalize',
                    fontWeight: activeTab === tab ? 'bold' : 'normal',
                    borderBottom: activeTab === tab ? '2px solid white' : 'none',
                    borderRadius: 0,
                    minWidth: 'auto',
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  {tab}
                </Button>
              ))}
            </Stack>

            {/* User Actions */}
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                onClick={() => navigate('/search')}
                sx={{ color: 'white' }}
              >
                <SearchIcon />
              </IconButton>
              
              <IconButton
                onClick={() => navigate('/notifications')}
                sx={{ color: 'white', position: 'relative' }}
              >
                <Badge badgeContent={unreadNotifications} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              <IconButton
                onClick={() => navigate('/profile')}
                sx={{ color: 'white' }}
              >
                <AccountIcon />
              </IconButton>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/report')}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  ml: 1,
                  display: { xs: 'none', sm: 'flex' }
                }}
              >
                Report Item
              </Button>
            </Stack>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="xl">
        {/* Welcome Section */}
        <WelcomeCard user={user} />
        
        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatsCard
              title="Lost Items"
              value={stats.totalLost}
              icon={<LostAndFoundIcon />}
              color="#ff6b6b"
              trend="+12% this week"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatsCard
              title="Found Items"
              value={stats.totalFound}
              icon={<FoundItemIcon />}
              color="#4ecdc4"
              trend="+8% this week"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatsCard
              title="Items Returned"
              value={stats.itemsReturned}
              icon={<CheckCircleIcon />}
              color="#96ceb4"
              trend="+15% this month"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatsCard
              title="Pending Claims"
              value={stats.pendingClaims}
              icon={<PendingIcon />}
              color="#ffd166"
              trend="3 new today"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatsCard
              title="Success Rate"
              value={stats.successRate}
              icon={<TrendingUpIcon />}
              color="#45b7d1"
              trend="+5% improvement"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatsCard
              title="Active Users"
              value={stats.activeUsers}
              icon={<AccountIcon />}
              color="#a267ac"
              trend="+23 this month"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12} md={8} lg={9}>
            <Grid container spacing={3}>
              {/* Quick Actions Card */}
              <Grid item xs={12}>
                <QuickActionsCard
                  actions={mockQuickActions}
                  onActionClick={handleQuickAction}
                />
              </Grid>

              {/* Recent Items */}
              <Grid item xs={12}>
                <RecentItemsCard
                  items={recentItems}
                  onViewItem={handleViewItem}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              </Grid>

              {/* Campus Activity */}
              <Grid item xs={12}>
                <GlassCard sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                      Campus Activity Map
                    </Typography>
                    <Chip 
                      icon={<PlaceIcon />} 
                      label="Live View" 
                      size="small"
                      sx={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                    />
                  </Box>
                  
                  <Box sx={{ 
                    height: 200, 
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Interactive campus map showing recent activity
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, background: 'rgba(255, 255, 255, 0.05)' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Most Active Locations
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {['Library', 'Cafeteria', 'Gym', 'Student Center'].map((location, index) => (
                            <Box key={location} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ color: 'white' }}>
                                {location}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                {12 - index * 3} items
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, background: 'rgba(255, 255, 255, 0.05)' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Popular Categories
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {['Electronics', 'Documents', 'Keys', 'Clothing'].map((category, index) => (
                            <Box key={category} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CategoryIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1 }} />
                              <Typography variant="body2" sx={{ color: 'white', flexGrow: 1 }}>
                                {category}
                              </Typography>
                              <Chip 
                                label={`${25 - index * 5}%`}
                                size="small"
                                sx={{ 
                                  background: `rgba(102, 126, 234, ${0.2 + index * 0.2})`,
                                  color: 'white',
                                  fontSize: '0.7rem'
                                }}
                              />
                            </Box>
                          ))}
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </GlassCard>
              </Grid>
            </Grid>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4} lg={3}>
            <Stack spacing={3}>
              {/* User Profile */}
              <UserProfile user={user} onLogout={logout} />

              {/* Notifications */}
              <GlassCard sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                    Notifications
                  </Typography>
                  <Button 
                    size="small" 
                    onClick={handleMarkAllRead}
                    sx={{ color: '#667eea', fontSize: '0.75rem' }}
                  >
                    Mark all read
                  </Button>
                </Box>
                
                <Stack spacing={1.5}>
                  {notifications.map((notification) => (
                    <Paper
                      key={notification.id}
                      sx={{
                        p: 1.5,
                        background: notification.read 
                          ? 'rgba(255, 255, 255, 0.05)' 
                          : 'rgba(102, 126, 234, 0.15)',
                        borderRadius: 1.5,
                        borderLeft: notification.read ? 'none' : '3px solid #667eea',
                        cursor: 'pointer',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'white', mb: 0.5 }}>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        {notification.time}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
                
                <Button
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    mt: 2,
                    color: 'white',
                    '&:hover': { background: 'rgba(255, 255, 255, 0.1)' }
                  }}
                  onClick={() => navigate('/notifications')}
                >
                  View All Notifications
                </Button>
              </GlassCard>

              {/* Quick Stats */}
              <GlassCard sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                  Your Activity
                </Typography>
                
                <Stack spacing={2}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Items Reported
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                        8
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={60}
                      sx={{ 
                        height: 6,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #667eea, #764ba2)'
                        }
                      }}
                    />
                  </Box>
                  
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Successful Returns
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                        5
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={83}
                      sx={{ 
                        height: 6,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #4ecdc4, #96ceb4)'
                        }
                      }}
                    />
                  </Box>
                  
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Response Rate
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                        92%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={92}
                      sx={{ 
                        height: 6,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #ffd166, #ffb347)'
                        }
                      }}
                    />
                  </Box>
                </Stack>
              </GlassCard>

              {/* Campus Tips */}
              <GlassCard sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                  Campus Tips
                </Typography>
                
                <Stack spacing={2}>
                  {[
                    "Check lost items near your last known location",
                    "Always report found items within 24 hours",
                    "Use clear photos when reporting items",
                    "Verify ownership before returning items"
                  ].map((tip, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <CheckCircleIcon 
                        fontSize="small" 
                        sx={{ 
                          color: '#4ecdc4', 
                          mr: 1.5,
                          mt: 0.25 
                        }} 
                      />
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        {tip}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </GlassCard>
            </Stack>
          </Grid>
        </Grid>

        {/* Footer Stats */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Last updated: Today at 14:30 • {stats.activeUsers} active users • 8 new items today
          </Typography>
        </Box>
      </Container>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000
          }}
        >
          <IconButton
            onClick={() => navigate('/report')}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              width: 56,
              height: 56,
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              }
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default DashboardPage;