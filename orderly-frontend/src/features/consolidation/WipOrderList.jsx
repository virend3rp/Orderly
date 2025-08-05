import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import { socket } from '../../api/socket';
import { Grid, CircularProgress, Typography, Box, Alert } from '@mui/material';
import OrderCard from './OrderCard';

const WipOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWipOrders = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/consolidation/orders');
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWipOrders();

    socket.connect();
    socket.emit('join_room', 'consolidation_room');

    // Listener for when an item's status is updated
    const handleItemPrepared = (preparedItem) => {
      setOrders(prevOrders => {
        return prevOrders.map(order => {
          if (order.order_id === preparedItem.order_id) {
            const updatedItems = order.items.map(item => 
              item.item_id === preparedItem.id ? { ...item, item_status: 'prepared' } : item
            );
            return { ...order, items: updatedItems };
          }
          return order;
        });
      });
    };

    // NEW: Listener for when a completely new order is created
    const handleNewOrder = (newOrder) => {
      setOrders(prevOrders => [newOrder, ...prevOrders]); // Add the new order to the top of the list
    };

    socket.on('item_prepared', handleItemPrepared);
    socket.on('new_wip_order', handleNewOrder); // Add the new listener

    // Cleanup on component unmount
    return () => {
      socket.off('item_prepared', handleItemPrepared);
      socket.off('new_wip_order', handleNewOrder); // Remove the new listener
      socket.disconnect();
    };
  }, []);

  const handleOrderCompletion = (completedOrderId) => {
    setOrders(prevOrders => prevOrders.filter(order => order.order_id !== completedOrderId));
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      {orders.length === 0 ? (
        <Typography>No orders are currently in progress.</Typography>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item key={order.order_id} xs={12} md={6} lg={4}>
              <OrderCard order={order} onOrderComplete={handleOrderCompletion} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default WipOrderList;