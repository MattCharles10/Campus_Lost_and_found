import React from 'react';
import {
  Container,
  Typography,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { keyframes } from '@emotion/react';
import AnimatedBackground from '../../components/common/UI/AnimatedBackground';
import GlassCard from '../../components/common/UI/GlassCard';
import FloatingAnimation from '../../components/common/UI/FloatingAnimation';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ForgotPasswordPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ 
      position: 'relative', 
      minHeight: '100vh', 
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <AnimatedBackground />
      
      <Container 
        component="main" 
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4
        }}
      >
        <FloatingAnimation delay={0}>
          <GlassCard
            sx={{
              padding: isMobile ? 3 : 4,
              width: '100%',
              maxWidth: 450,
              animation: `${fadeIn} 0.8s ease-out`,
              margin: '0 auto',
            }}
          >
            {/* Logo/Header Section */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                  }}
                >
                  🔑
                </Typography>
              </Box>
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontWeight: 'bold',
                  mb: 1,
                }}
              >
                Reset Password
              </Typography>
              <Typography
                component="h2"
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 300,
                }}
              >
                We'll help you get back into your account
              </Typography>
            </Box>

            <ForgotPasswordForm />
          </GlassCard>
        </FloatingAnimation>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;