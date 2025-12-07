import React, { useState } from 'react';
import {
  Box,
  Typography,
  Link,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Email } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import SubmitButton from '../common/Form/SubmitButton';

const ForgotPasswordForm = () => {
  const { forgotPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset instructions. Please try again.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <Box sx={{ mt: 1 }}>
        <Alert 
          severity="success" 
          sx={{ 
            mb: 2,
            background: 'rgba(76, 175, 80, 0.1)',
            color: 'white',
            border: '1px solid rgba(76, 175, 80, 0.3)',
          }}
        >
          Password reset instructions have been sent to your email.
        </Alert>
        <Box sx={{ textAlign: 'center' }}>
          <Link
            component={RouterLink}
            to="/login"
            sx={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: 'bold',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Back to Login
          </Link>
        </Box>
      </Box>
    );
  }

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

      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2, textAlign: 'center' }}>
        Enter your email address and we'll send you instructions to reset your password.
      </Typography>

      <TextField
        fullWidth
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError('');
        }}
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

      <SubmitButton loading={loading}>
        Send Reset Instructions
      </SubmitButton>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Link
          component={RouterLink}
          to="/login"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            textDecoration: 'none',
            '&:hover': {
              color: '#667eea',
              textDecoration: 'underline',
            },
          }}
        >
          Back to Login
        </Link>
      </Box>
    </Box>
  );
};

export default ForgotPasswordForm;