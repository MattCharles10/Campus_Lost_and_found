
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Stack,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  LostAndFound as LostIcon,
  FindInPage as FoundIcon,
  Person as PersonIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleMenuClose();
  };

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Lost Items', path: '/lost-items', icon: <LostIcon /> },
    { label: 'Found Items', path: '/found-items', icon: <FoundIcon /> },
    { label: 'My Items', path: '/my-items', icon: <PersonIcon /> },
  ];

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            flexGrow: 1,
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
            }}
          >
            <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
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

        {/* Navigation Links - Desktop */}
        {!isMobile && user && (
          <Stack direction="row" spacing={1} sx={{ mr: 3 }}>
            {navigationItems.map((item) => (
              <Button
                key={item.label}
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        )}

        {/* User Actions */}
        <Stack direction="row" spacing={1} alignItems="center">
          {user ? (
            <>
              <IconButton
                onClick={() => navigate('/search')}
                sx={{ color: 'white' }}
              >
                <SearchIcon />
              </IconButton>
              
              <IconButton
                onClick={() => navigate('/notifications')}
                sx={{ color: 'white' }}
              >
                <NotificationsIcon />
              </IconButton>

              {/* User Menu */}
              <IconButton
                onClick={handleMenuOpen}
                sx={{ p: 0, ml: 1 }}
              >
                <Avatar
                  src={user.avatarUrl}
                  alt={user.firstName}
                  sx={{ width: 36, height: 36 }}
                >
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    background: 'rgba(30, 30, 40, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    minWidth: 200
                  }
                }}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                  <PersonIcon sx={{ mr: 2 }} /> Profile
                </MenuItem>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 2 }} /> Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{ 
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white'
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}
              >
                Sign Up
              </Button>
            </Stack>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;