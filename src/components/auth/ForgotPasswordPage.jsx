import React, { useState } from 'react';
import {
  Box,
  Typography,
  Link,
  Alert
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import InputField from '../common/Form/InputField';
import SubmitButton from '../common/Form/SubmitButton';

const ForgotPasswordForm = () => {
  const { forgotPassword, error, setError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await forgotPassword(email);
    
    if (result.success) {
      setSuccess(true);
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <Box sx={{ mt: 1 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Password reset instructions have been sent to your email.
        </Alert>
        <Box sx={{ textAlign: 'center' }}>
          <Link component={RouterLink} to="/login">
            Back to Login
          </Link>
        </Box>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="body2" sx={{ mb: 2 }}>
        Enter your email address and we'll send you instructions to reset your password.
      </Typography>

      <InputField
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError('');
        }}
        required
      />

      <SubmitButton loading={loading}>
        Send Reset Instructions
      </SubmitButton>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Link component={RouterLink} to="/login">
          Back to Login
        </Link>
      </Box>
    </Box>
  );
};

export default ForgotPasswordForm;