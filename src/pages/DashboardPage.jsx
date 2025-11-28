import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Welcome, {user?.firstName}!
        </Typography>
        <Button variant="outlined" onClick={logout}>
          Logout
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1">
            This is your dashboard. You're successfully logged in!
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Email: {user?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Name: {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Student ID: {user?.studentId || 'Not provided'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DashboardPage;