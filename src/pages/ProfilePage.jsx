import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  TextField,
  Divider,
  Chip,
  Stack,
  IconButton,
  Tab,
  Tabs,
  Alert,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  CameraAlt as CameraIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  TrendingUp,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  VerifiedUser,
  Logout as LogoutIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/UI/LoadingSpinner';

const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  border: '3px solid #8b5cf6',
  boxShadow: '0 20px 50px rgba(139, 92, 246, 0.2)',
  backgroundColor: 'white',
  overflow: 'hidden',
}));

const ProfilePage = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    campusId: '',
    department: '',
    year: '',
    bio: '',
    notifications: true,
    emailNotifications: true,
    smsNotifications: false
  });
  const [stats, setStats] = useState({
    totalItems: 0,
    resolvedItems: 0,
    activeItems: 0,
    successRate: 0,
    responseTime: '2.4h',
    communityRating: 4.8
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        campusId: user.campusId || '',
        department: user.department || '',
        year: user.year || '',
        bio: user.bio || '',
        notifications: user.notifications !== false,
        emailNotifications: user.emailNotifications !== false,
        smsNotifications: user.smsNotifications || false
      });
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    // Simulate API call
    setStats({
      totalItems: 24,
      resolvedItems: 18,
      activeItems: 6,
      successRate: 75,
      responseTime: '2.4h',
      communityRating: 4.8
    });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateProfile(profileData);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    // Implement account deletion logic
    alert('Account deletion feature coming soon!');
    setShowDeleteDialog(false);
  };

  const tabs = ['Profile', 'Activity', 'Settings', 'Security'];

  if (!user) {
    return <LoadingSpinner fullScreen text="Loading profile..." />;
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
          Back to Dashboard
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e1b4b' }}>
            👤 My Profile
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={editMode ? <SaveIcon /> : <EditIcon />}
              onClick={editMode ? handleSaveProfile : () => setEditMode(true)}
              disabled={loading}
              sx={{
                borderColor: '#8b5cf6',
                color: '#8b5cf6',
                fontWeight: 700,
                borderRadius: '12px',
                px: 3
              }}
            >
              {editMode ? 'Save Changes' : 'Edit Profile'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderColor: '#ef4444',
                color: '#ef4444',
                fontWeight: 700,
                borderRadius: '12px',
                px: 3
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Profile Info */}
        <Grid item xs={12} md={4}>
          <ProfileCard>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: '3rem',
                    backgroundColor: '#8b5cf6',
                    border: '4px solid white',
                    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                {editMode && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      '&:hover': { backgroundColor: '#7c3aed' }
                    }}
                  >
                    <CameraIcon />
                  </IconButton>
                )}
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 900, color: '#1e1b4b', mb: 1 }}>
                {user.name}
              </Typography>
              
              <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
                <Chip 
                  icon={<VerifiedUser sx={{ fontSize: 14 }} />}
                  label="Verified User"
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    color: '#065f46',
                    fontWeight: 600
                  }}
                />
                <Chip 
                  label="Active"
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    color: '#1d4ed8',
                    fontWeight: 600
                  }}
                />
              </Stack>

              <Divider sx={{ my: 3 }} />

              {/* Quick Stats */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#8b5cf6' }}>
                      {stats.totalItems}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Items Reported
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#10b981' }}>
                      {stats.resolvedItems}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Resolved
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#f59e0b' }}>
                      {stats.successRate}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Success Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#06b6d4' }}>
                      {stats.communityRating}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Rating
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </ProfileCard>

          {/* Verification Status */}
          <Card sx={{ mt: 3, borderRadius: '16px', border: '3px solid #e2e8f0' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 2 }}>
                🔒 Verification Status
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#475569' }}>
                    Email Verification
                  </Typography>
                  <CheckCircleIcon sx={{ color: '#10b981' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#475569' }}>
                    Campus ID Verified
                  </Typography>
                  <CheckCircleIcon sx={{ color: '#10b981' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#475569' }}>
                    Phone Number
                  </Typography>
                  <WarningIcon sx={{ color: '#f59e0b' }} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Tabs Content */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: '20px', border: '3px solid #e2e8f0' }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                borderBottom: '1px solid #e2e8f0',
                '& .MuiTab-root': {
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1rem',
                  py: 2
                }
              }}
            >
              {tabs.map((tab, index) => (
                <Tab key={tab} label={tab} />
              ))}
            </Tabs>

            <CardContent sx={{ p: 4 }}>
              {activeTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      disabled={!editMode}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      value={profileData.email}
                      disabled
                      sx={{ mb: 3 }}
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ color: '#64748b', mr: 1 }} />
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!editMode}
                      sx={{ mb: 3 }}
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ color: '#64748b', mr: 1 }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Campus ID"
                      value={profileData.campusId}
                      onChange={(e) => setProfileData({...profileData, campusId: e.target.value})}
                      disabled={!editMode}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      label="Department"
                      value={profileData.department}
                      onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                      disabled={!editMode}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      label="Year"
                      value={profileData.year}
                      onChange={(e) => setProfileData({...profileData, year: e.target.value})}
                      disabled={!editMode}
                      sx={{ mb: 3 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      disabled={!editMode}
                      placeholder="Tell us a bit about yourself..."
                    />
                  </Grid>
                </Grid>
              )}

              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 3 }}>
                    📊 Activity Overview
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ p: 3, backgroundColor: '#f8fafc', border: '2px solid #e2e8f0' }}>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 2 }}>
                          Item Resolution Rate
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={stats.successRate} 
                          sx={{ 
                            height: 10,
                            borderRadius: 5,
                            mb: 2,
                            backgroundColor: '#e2e8f0',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 5,
                              backgroundColor: '#10b981'
                            }
                          }}
                        />
                        <Typography variant="body2" sx={{ color: '#475569' }}>
                          Better than 85% of users
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ p: 3, backgroundColor: '#f8fafc', border: '2px solid #e2e8f0' }}>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 2 }}>
                          Average Response Time
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#8b5cf6', mb: 1 }}>
                          {stats.responseTime}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#475569' }}>
                          Faster than campus average
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 3 }}>
                    ⚙️ Notification Settings
                  </Typography>
                  <Stack spacing={3}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.notifications}
                          onChange={(e) => setProfileData({...profileData, notifications: e.target.checked})}
                          color="primary"
                        />
                      }
                      label="Push Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.emailNotifications}
                          onChange={(e) => setProfileData({...profileData, emailNotifications: e.target.checked})}
                          color="primary"
                        />
                      }
                      label="Email Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.smsNotifications}
                          onChange={(e) => setProfileData({...profileData, smsNotifications: e.target.checked})}
                          color="primary"
                        />
                      }
                      label="SMS Notifications"
                    />
                  </Stack>
                </Box>
              )}

              {activeTab === 3 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e1b4b', mb: 3 }}>
                    🔐 Security Settings
                  </Typography>
                  <Stack spacing={3}>
                    <Button
                      variant="outlined"
                      startIcon={<SecurityIcon />}
                      onClick={() => navigate('/change-password')}
                      sx={{
                        borderColor: '#06b6d4',
                        color: '#06b6d4',
                        justifyContent: 'flex-start',
                        py: 1.5
                      }}
                    >
                      Change Password
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<HistoryIcon />}
                      onClick={() => navigate('/login-history')}
                      sx={{
                        borderColor: '#8b5cf6',
                        color: '#8b5cf6',
                        justifyContent: 'flex-start',
                        py: 1.5
                      }}
                    >
                      Login History
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => setShowDeleteDialog(true)}
                      sx={{
                        borderColor: '#ef4444',
                        color: '#ef4444',
                        justifyContent: 'flex-start',
                        py: 1.5
                      }}
                    >
                      Delete Account
                    </Button>
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Account Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Delete Account
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
            This action cannot be undone. All your data will be permanently deleted.
          </Alert>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Please confirm you want to delete your account. You will lose:
          </Typography>
          <ul style={{ color: '#64748b', marginLeft: '20px', marginTop: '10px' }}>
            <li>All your reported items</li>
            <li>Chat history</li>
            <li>Profile information</li>
            <li>Account settings</li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ProfilePage;