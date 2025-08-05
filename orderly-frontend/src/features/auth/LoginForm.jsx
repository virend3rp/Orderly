import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import apiClient from '../../api/axiosConfig';
import { jwtDecode } from 'jwt-decode'; // Install with: npm install jwt-decode
import { Button, TextField, Box } from '@mui/material';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await apiClient.post('/employees/login', { username, password });
      const { token } = response.data;
      
      // Decode the token to get user payload (id, name, role)
      const decodedUser = jwtDecode(token);

      // Save token and user info to global state
      login(token, decodedUser);
      
      // Redirect based on role
      switch (decodedUser.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'consolidation':
          navigate('/consolidation/dashboard');
          break;
        case 'staff':
          navigate('/staff/dashboard');
          break;
        default:
          navigate('/');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign In
      </Button>
    </Box>
  );
};

export default LoginForm;