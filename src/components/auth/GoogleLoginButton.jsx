import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const GoogleLoginButton = ({ onSuccess, onFailure, loading, text = "Sign in with Google" }) => {
  const login = useGoogleLogin({
    onSuccess: (response) => onSuccess(response),
    onError: () => onFailure('Google login failed'),
  });

  return (
    <Button
      fullWidth
      variant="outlined"
      startIcon={<GoogleIcon />}
      onClick={() => login()}
      disabled={loading}
      sx={{ 
        mb: 2,
        color: 'white',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        '&:hover': {
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
        },
      }}
    >
      {text}
    </Button>
  );
};

export default GoogleLoginButton;