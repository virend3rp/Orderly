import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import TaskQueue from '../features/staff/TaskQueue';

const StaffDashboardPage = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Work Queue
        </Typography>
        <Typography color="text.secondary">
          Items assigned to your skill groups will appear here in real-time.
        </Typography>
      </Box>
      <TaskQueue />
    </Container>
  );
};

export default StaffDashboardPage;