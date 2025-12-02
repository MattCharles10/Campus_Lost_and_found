import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const ProfilePage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}>
          Profile
        </Typography>
        <Paper sx={{ p: 3, background: 'rgba(255, 255, 255, 0.05)' }}>
          <Typography sx={{ color: 'white' }}>
            Profile page content will go here.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfilePage;