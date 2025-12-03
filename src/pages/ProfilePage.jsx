import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Avatar,
  Card,
  CardContent,
  Chip,
  Divider,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Verified as VerifiedIcon,
  Lock as LockIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Password as PasswordIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/UI/LoadingSpinner';
import GlassCard from '../components/common/UI/GlassCard';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Mock user stats
  const userStats = {
    itemsReported: 8,
    itemsFound: 5,
    itemsReturned: 3,
    successRate: 85,
    trustScore: 92
  };

  // Mock recent activity
  const recentActivity = [
    { id: 1, action: 'Reported lost laptop', date: '2 days ago', status: 'Active' },
    { id: 2, action: 'Found student ID', date: '1 week ago', status: 'Returned' },
    { id: 3, action: 'Updated profile', date: '2 weeks ago', status: 'Completed' },
  ];

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'Passwords do not match',
        severity: 'error'
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setSnackbar({
        open: true,
        message: 'Password must be at least 6 characters',
        severity: 'error'
      });
      return;
    }

    // Here you would call API to change password
    console.log('Changing password...');
    
    setSnackbar({
      open: true,
      message: 'Password changed successfully!',
      severity: 'success'
    });
    
    setPasswordDialogOpen(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'active':
      case 'returned':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
            My Profile
          </Typography>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }
            }}
          >
            Logout
          </Button>
        </Box>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          View your account information and activity
        </Typography>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column - Profile Card */}
        <Grid item xs={12} md={4}>
          <GlassCard sx={{ p: 3, height: '100%' }}>
            {/* Profile Header */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=667eea&color=fff`}
                sx={{
                  width: 100,
                  height: 100,
                  mb: 2,
                  border: '3px solid rgba(255, 255, 255, 0.2)'
                }}
              />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                {user.email}
              </Typography>
              <Chip
                icon={<VerifiedIcon />}
                label="Verified Account"
                size="small"
                sx={{
                  background: 'rgba(76, 175, 80, 0.2)',
                  color: '#4caf50',
                  mt: 1
                }}
              />
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />

            {/* User Stats */}
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
              Your Statistics
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper sx={{ 
                  p: 1.5, 
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  textAlign: 'center'
                }}>
                  <Typography variant="h5" sx={{ color: '#667eea', fontWeight: 'bold' }}>
                    {userStats.itemsReported}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Reported
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ 
                  p: 1.5, 
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  textAlign: 'center'
                }}>
                  <Typography variant="h5" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                    {userStats.itemsReturned}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Returned
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                Success Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LinearProgress 
                  variant="determinate" 
                  value={userStats.successRate}
                  sx={{ 
                    flexGrow: 1,
                    height: 8,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #4ecdc4, #44a08d)',
                      borderRadius: 4
                    }
                  }}
                />
                <Typography variant="body2" sx={{ color: 'white', ml: 1, fontWeight: 'bold' }}>
                  {userStats.successRate}%
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />

            {/* Quick Actions */}
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
              Account Settings
            </Typography>
            
            <List dense>
              <ListItem 
                button 
                onClick={() => setPasswordDialogOpen(true)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.05)'
                  }
                }}
              >
                <ListItemIcon>
                  <PasswordIcon sx={{ color: '#667eea' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Change Password" 
                  sx={{ color: 'white' }}
                />
              </ListItem>
              
              <ListItem 
                button 
                onClick={() => navigate('/my-items')}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.05)'
                  }
                }}
              >
                <ListItemIcon>
                  <HistoryIcon sx={{ color: '#4ecdc4' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="My Reported Items" 
                  sx={{ color: 'white' }}
                />
              </ListItem>
            </List>
          </GlassCard>
        </Grid>

        {/* Right Column - Details */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Personal Information Card */}
            <Grid item xs={12}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                      Personal Information
                    </Typography>
                    <Chip
                      label="Registered"
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 'medium' }}
                    />
                  </Box>
                  
                  <Grid container spacing={3}>
                    {/* Personal Info */}
                    <Grid item xs={12} md={6}>
                      <List dense>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <PersonIcon sx={{ color: '#667eea' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Name"
                            secondary={`${user.firstName} ${user.lastName}`}
                            primaryTypographyProps={{ 
                              variant: 'body2',
                              sx: { color: 'rgba(255, 255, 255, 0.7)' }
                            }}
                            secondaryTypographyProps={{ 
                              variant: 'body1',
                              sx: { color: 'white', fontWeight: 'medium' }
                            }}
                          />
                        </ListItem>
                        
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <EmailIcon sx={{ color: '#4ecdc4' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Email"
                            secondary={user.email}
                            primaryTypographyProps={{ 
                              variant: 'body2',
                              sx: { color: 'rgba(255, 255, 255, 0.7)' }
                            }}
                            secondaryTypographyProps={{ 
                              variant: 'body1',
                              sx: { color: 'white', fontWeight: 'medium' }
                            }}
                          />
                        </ListItem>
                        
                        {user.studentId && (
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <BadgeIcon sx={{ color: '#ffd166' }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Student ID"
                              secondary={user.studentId}
                              primaryTypographyProps={{ 
                                variant: 'body2',
                                sx: { color: 'rgba(255, 255, 255, 0.7)' }
                              }}
                              secondaryTypographyProps={{ 
                                variant: 'body1',
                                sx: { color: 'white', fontWeight: 'medium' }
                              }}
                            />
                          </ListItem>
                        )}
                      </List>
                    </Grid>
                    
                    {/* Account Info */}
                    <Grid item xs={12} md={6}>
                      <List dense>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <CalendarIcon sx={{ color: '#96ceb4' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Member Since"
                            secondary={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            primaryTypographyProps={{ 
                              variant: 'body2',
                              sx: { color: 'rgba(255, 255, 255, 0.7)' }
                            }}
                            secondaryTypographyProps={{ 
                              variant: 'body1',
                              sx: { color: 'white', fontWeight: 'medium' }
                            }}
                          />
                        </ListItem>
                        
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <SecurityIcon sx={{ color: '#ff6b6b' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Account Type"
                            secondary="Standard User"
                            primaryTypographyProps={{ 
                              variant: 'body2',
                              sx: { color: 'rgba(255, 255, 255, 0.7)' }
                            }}
                            secondaryTypographyProps={{ 
                              variant: 'body1',
                              sx: { color: 'white', fontWeight: 'medium' }
                            }}
                          />
                        </ListItem>
                        
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <NotificationsIcon sx={{ color: '#a267ac' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Notifications"
                            secondary="Email enabled"
                            primaryTypographyProps={{ 
                              variant: 'body2',
                              sx: { color: 'rgba(255, 255, 255, 0.7)' }
                            }}
                            secondaryTypographyProps={{ 
                              variant: 'body1',
                              sx: { color: 'white', fontWeight: 'medium' }
                            }}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                  
                  <Alert 
                    severity="info" 
                    sx={{ 
                      mt: 2,
                      background: 'rgba(33, 150, 243, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(33, 150, 243, 0.3)',
                    }}
                  >
                    To update your personal information, please contact support.
                  </Alert>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Activity Card */}
            <Grid item xs={12}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                    Recent Activity
                  </Typography>
                  
                  <List>
                    {recentActivity.map((activity) => (
                      <ListItem 
                        key={activity.id}
                        sx={{ 
                          px: 0,
                          py: 1.5,
                          '&:not(:last-child)': {
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                          }
                        }}
                      >
                        <ListItemIcon>
                          {activity.status === 'Returned' || activity.status === 'Completed' ? (
                            <CheckCircleIcon sx={{ color: '#4caf50' }} />
                          ) : (
                            <PendingIcon sx={{ color: '#ff9800' }} />
                          )}
                        </ListItemIcon>
                        <ListItemText 
                          primary={activity.action}
                          secondary={activity.date}
                          primaryTypographyProps={{ 
                            variant: 'body1',
                            sx: { color: 'white' }
                          }}
                          secondaryTypographyProps={{ 
                            variant: 'body2',
                            sx: { color: 'rgba(255, 255, 255, 0.6)' }
                          }}
                        />
                        <Chip
                          label={activity.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(activity.status) === 'success' ? 'rgba(76, 175, 80, 0.2)' :
                                            getStatusColor(activity.status) === 'warning' ? 'rgba(255, 152, 0, 0.2)' :
                                            'rgba(33, 150, 243, 0.2)',
                            color: getStatusColor(activity.status) === 'success' ? '#4caf50' :
                                  getStatusColor(activity.status) === 'warning' ? '#ff9800' :
                                  '#2196f3',
                            fontWeight: 'medium',
                            fontSize: '0.75rem'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button
                      onClick={() => navigate('/my-items')}
                      sx={{
                        color: '#667eea',
                        '&:hover': {
                          backgroundColor: 'rgba(102, 126, 234, 0.1)'
                        }
                      }}
                    >
                      View All Activity
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog 
        open={passwordDialogOpen} 
        onClose={() => setPasswordDialogOpen(false)}
        PaperProps={{
          sx: {
            background: 'rgba(30, 30, 40, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          Change Password
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Current Password"
            name="currentPassword"
            type={showPassword ? 'text' : 'password'}
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            fullWidth
            label="New Password"
            name="newPassword"
            type={showPassword ? 'text' : 'password'}
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
          />
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: 2 }}>
          <Button 
            onClick={() => setPasswordDialogOpen(false)}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;