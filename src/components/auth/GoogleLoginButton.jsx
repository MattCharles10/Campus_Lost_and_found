import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleLoaded, setGoogleLoaded] = useState(false);
  
  // Your Google OAuth Client ID - Make sure this is correct
  const GOOGLE_CLIENT_ID = '138306110624-r6m42ier5p4d64ggo93pna0b0n2pds7b.apps.googleusercontent.com';
  
  useEffect(() => {
    // Check if Google API is already loaded
    if (window.google) {
      initializeGoogle();
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        initializeGoogle();
      } else {
        setError('Failed to load Google Sign-In');
      }
    };
    
    script.onerror = () => {
      setError('Failed to load Google Sign-In script');
      console.error('Failed to load Google Identity Services script');
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initializeGoogle = () => {
    try {
      if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'test-client-id') {
        setError('Google OAuth is not configured. Please use email/password login.');
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        context: 'signin',
        ux_mode: 'popup',
        use_fedcm_for_prompt: true,
      });

      // Try to render the button
      try {
        window.google.accounts.id.renderButton(
          document.getElementById('googleLoginButton'),
          { 
            theme: 'outline', 
            size: 'large',
            text: 'continue_with',
            width: '100%',
            type: 'standard',
            shape: 'rectangular',
            logo_alignment: 'left',
          }
        );
        setGoogleLoaded(true);
      } catch (renderError) {
        console.error('Error rendering Google button:', renderError);
        setError('Could not render Google Sign-In button');
      }

      // Optional: Prompt for one-tap sign-in
      // window.google.accounts.id.prompt();
    } catch (error) {
      console.error('Error initializing Google:', error);
      setError('Failed to initialize Google Sign-In');
    }
  };

  const handleCredentialResponse = async (response) => {
    console.log('Google credential response received');
    setLoading(true);
    setError('');

    try {
      // Verify the credential with your backend
      const result = await googleLogin(response.credential);
      
      if (result.success) {
        console.log('Google authentication successful');
        navigate('/dashboard');
      } else {
        setError(result.error || 'Google authentication failed');
      }
    } catch (error) {
      console.error('Google authentication error:', error);
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualClick = () => {
    if (googleLoaded && window.google) {
      // Trigger Google sign-in manually
      window.google.accounts.id.prompt();
    } else {
      setError('Google Sign-In is not available. Please use email/password.');
    }
  };

  // Fallback button if Google script fails
  const FallbackButton = () => (
    <Button
      fullWidth
      variant="outlined"
      startIcon={<GoogleIcon />}
      onClick={handleManualClick}
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
      {loading ? 'Signing in...' : 'Sign in with Google'}
    </Button>
  );

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      {error && (
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 2,
            background: 'rgba(255, 152, 0, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 152, 0, 0.3)',
          }}
        >
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      )}

      {/* Google Sign-In Button Container */}
      <Box 
        id="googleLoginButton" 
        sx={{ 
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          mb: 2,
          minHeight: '44px' // Minimum height for Google button
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <CircularProgress size={24} sx={{ color: '#667eea' }} />
          </Box>
        ) : null}
      </Box>

      {/* Show fallback button if Google script not loaded */}
      {!googleLoaded && !loading && <FallbackButton />}
      
      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mt: 1, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Client ID: {GOOGLE_CLIENT_ID.substring(0, 20)}...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default GoogleLoginButton;