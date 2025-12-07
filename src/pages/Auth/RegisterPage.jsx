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
import RegisterForm from '../../components/auth/RegisterForm';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const RegisterPage = () => {
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
        <FloatingAnimation delay={0.2}>
          <GlassCard
            sx={{
              padding: isMobile ? 3 : 4,
              width: '100%',
              maxWidth: 500,
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
                  🎓
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
                Join Campus Lost & Found
              </Typography>
              <Typography
                component="h2"
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 300,
                }}
              >
                Create your account and start finding
              </Typography>
            </Box>

            <RegisterForm />
          </GlassCard>
        </FloatingAnimation>

        {/* Floating Objects */}
        <Box
          sx={{
            position: 'absolute',
            top: '15%',
            left: '8%',
            animation: 'float 6s ease-in-out infinite',
            fontSize: '2rem',
            opacity: 0.7,
            zIndex: 1,
          }}
        >
          📚
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: '25%',
            right: '8%',
            animation: 'float 4s ease-in-out 1s infinite',
            fontSize: '2rem',
            opacity: 0.7,
            zIndex: 1,
          }}
        >
          🎒
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: '35%',
            right: '12%',
            animation: 'float 5s ease-in-out 2s infinite',
            fontSize: '1.5rem',
            opacity: 0.7,
            zIndex: 1,
          }}
        >
          💼
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;