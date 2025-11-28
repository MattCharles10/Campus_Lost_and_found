import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box
} from '@mui/material';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';

const ResetPasswordPage = () => {
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Campus Lost & Found
          </Typography>
          <Typography component="h2" variant="h5" gutterBottom>
            Set New Password
          </Typography>
          <ResetPasswordForm />
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;