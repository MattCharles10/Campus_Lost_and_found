import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const ReportItemPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}>
          Report Item
        </Typography>
        <Paper sx={{ p: 3, background: 'rgba(255, 255, 255, 0.05)' }}>
          <Typography sx={{ color: 'white' }}>
            Report item form will go here.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default ReportItemPage;