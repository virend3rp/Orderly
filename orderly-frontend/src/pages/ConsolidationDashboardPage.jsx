import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import WipOrderList from '../features/consolidation/WipOrderList';

const ConsolidationDashboardPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Consolidation Station
        </Typography>
        <Typography color="text.secondary">
          Orders that are currently being prepared are shown below.
        </Typography>
      </Box>
      <WipOrderList />
    </Container>
  );
};

export default ConsolidationDashboardPage;