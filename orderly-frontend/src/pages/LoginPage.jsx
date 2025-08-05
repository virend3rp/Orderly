import React from 'react';
import LoginForm from '../features/auth/LoginForm';
import { Container, Typography, Box } from '@mui/material';

const LoginPage = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Orderly - Staff Login
        </Typography>
        <LoginForm />
      </Box>
    </Container>
  );
};

export default LoginPage;