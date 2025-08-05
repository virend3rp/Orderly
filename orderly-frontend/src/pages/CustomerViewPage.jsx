import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Paper, Tabs, Tab, CircularProgress } from '@mui/material';
import ProductList from '../features/customer/ProductList';
import apiClient from '../api/axiosConfig';
import GlobalOrderCard from '../components/GlobalOrderCard';

const CustomerViewPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  // State for the latest prepared order
  const [latestOrder, setLatestOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  // Effect to fetch product categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/products/categories');
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Effect to fetch the latest prepared order
  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        // This endpoint should return the latest order for the user with a 'prepared' status.
        // It's assumed it will return a 404 or empty response if no such order exists.
        const response = await apiClient.get('/orders/status/latest-prepared');
        if (response.data && response.status === 200) {
          setLatestOrder(response.data);
        }
      } catch (error) {
        // Log quietly as it's expected to fail if no order is ready
        console.log("Could not fetch a prepared order. This may be expected.", error);
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchLatestOrder();
    // Optional: Poll for order status every 30 seconds
    const intervalId = setInterval(fetchLatestOrder, 30000); 

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };
  
  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 15 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Orderly Menu
          </Typography>
        </Box>

        {/* New Section: Display Latest Prepared Order Status */}
        {loadingOrder ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Checking order status...</Typography>
          </Box>
        ) : latestOrder && (
          <Paper 
            elevation={4} 
            sx={{ 
              p: 3, 
              mb: 4, 
              backgroundColor: 'success.light', 
              border: '2px solid', 
              borderColor: 'success.main',
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom fontWeight="medium">
              Your Order is Ready for Pickup!
            </Typography>
            <Typography variant="h6">
              Please collect Order #{latestOrder.id}.
            </Typography>
          </Paper>
        )}

        {/* Existing Menu Grid */}
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                {loadingCategories ? <CircularProgress /> : (
                  <Tabs value={selectedCategory} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                    <Tab label="All" value="all" />
                    {categories.map(cat => (
                      <Tab key={cat.id} label={cat.group_name} value={cat.id} />
                    ))}
                  </Tabs>
                )}
              </Box>
              <ProductList selectedCategory={selectedCategory} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <GlobalOrderCard />
    </>
  );
};

export default CustomerViewPage;