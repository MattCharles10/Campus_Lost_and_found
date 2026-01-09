import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { Home as HomeIcon, Search as SearchIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const PageContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: theme.spacing(3),
  textAlign: 'center',
}));

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <PageContainer maxWidth="md">
      <Box sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        borderRadius: '24px',
        padding: 6,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        maxWidth: 600,
        width: '100%',
      }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: '8rem',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 2,
          }}
        >
          404
        </Typography>
        
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e1b4b', mb: 2 }}>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" sx={{ color: '#64748b', mb: 4, fontSize: '1.1rem' }}>
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track!
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              fontWeight: 700,
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              }
            }}
          >
            Go Back
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{
              borderColor: '#8b5cf6',
              color: '#8b5cf6',
              fontWeight: 700,
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              '&:hover': {
                borderColor: '#7c3aed',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
              }
            }}
          >
            Dashboard
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={() => navigate('/search')}
            sx={{
              borderColor: '#06b6d4',
              color: '#06b6d4',
              fontWeight: 700,
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              '&:hover': {
                borderColor: '#0891b2',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
              }
            }}
          >
            Search Items
          </Button>
        </Box>
        
        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid #e2e8f0' }}>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
            Quick Links:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Lost Items', 'Found Items', 'Report Item', 'My Items', 'Profile'].map((link) => (
              <Button
                key={link}
                variant="text"
                onClick={() => navigate(`/${link.toLowerCase().replace(' ', '-')}`)}
                sx={{
                  color: '#8b5cf6',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  }
                }}
              >
                {link}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default NotFoundPage;