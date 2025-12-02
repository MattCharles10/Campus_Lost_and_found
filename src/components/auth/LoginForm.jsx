import React, { useState } from 'react';
import {
  Box,
  Typography,
  Link,
  Alert,
  Divider,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import SubmitButton from '../common/Form/SubmitButton';
import GoogleLoginButton from './GoogleLoginButton';

const LoginForm = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    setLoading(true);
    try {
      const result = await googleLogin(response.access_token);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Google login failed');
      }
    } catch (err) {
      setError(err.message || 'Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleFailure = (error) => {
    setError('Google login failed. Please try again.');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            background: 'rgba(244, 67, 54, 0.1)',
            color: 'white',
            border: '1px solid rgba(244, 67, 54, 0.3)',
          }}
        >
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            color: 'white',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
            '&.Mui-focused fieldset': { borderColor: '#667eea' },
          },
          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        required
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            color: 'white',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
            '&.Mui-focused fieldset': { borderColor: '#667eea' },
          },
          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <SubmitButton loading={loading}>
        Sign In
      </SubmitButton>

      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Link
          component={RouterLink}
          to="/forgot-password"
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            textDecoration: 'none',
            '&:hover': {
              color: '#667eea',
              textDecoration: 'underline',
            },
          }}
        >
          Forgot password?
        </Link>
      </Box>

      <Divider 
        sx={{ 
          my: 2, 
          color: 'rgba(255, 255, 255, 0.3)',
          '&::before, &::after': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          OR
        </Typography>
      </Divider>

      <GoogleLoginButton
        onSuccess={handleGoogleSuccess}
        onFailure={handleGoogleFailure}
        loading={loading}
      />

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Don't have an account?{' '}
          <Link
            component={RouterLink}
            to="/register"
            sx={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: 'bold',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;