import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';

const AuthenticatedLayout = ({ children }) => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Orderly
          </Typography>
          <Typography sx={{ mr: 2 }}>
            Welcome, {user?.name || 'User'} ({user?.role})
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 10, p: 3, flexGrow: 1 }}>
        {children}
      </Container>
    </Box>
  );
};

export default AuthenticatedLayout;