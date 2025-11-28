import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box
} from '@mui/material';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = () => {
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
            Sign In
          </Typography>
          <LoginForm />
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;