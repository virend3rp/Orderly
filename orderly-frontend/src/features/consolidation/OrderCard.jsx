import React, { useState } from 'react';
import apiClient from '../../api/axiosConfig';
import {
  Card, CardContent, CardActions, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const OrderCard = ({ order, onOrderComplete }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState('');

  // Business Rule: The "Complete Order" button is only enabled if every item is prepared.
  const allItemsPrepared = order.items.every(item => item.item_status === 'prepared');

  const handleCompleteOrder = async () => {
    setIsCompleting(true);
    setError('');
    try {
      await apiClient.patch(`/consolidation/orders/${order.order_id}/complete`);
      // Notify the parent component to remove this card from the list
      onOrderComplete(order.order_id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete order.');
      console.error(err);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>Order #: {order.order_number}</Typography>
        <Divider />
        <List dense>
          {order.items.map(item => (
            <ListItem key={item.item_id}>
              <ListItemIcon>
                {item.item_status === 'prepared' ? 
                  <CheckCircleIcon color="success" /> : 
                  <RadioButtonUncheckedIcon color="disabled" />
                }
              </ListItemIcon>
              <ListItemText 
                primary={`${item.product_name} x ${item.quantity}`} 
                sx={{ textDecoration: item.item_status === 'prepared' ? 'line-through' : 'none' }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          variant="contained"
          fullWidth
          disabled={!allItemsPrepared || isCompleting}
          onClick={handleCompleteOrder}
        >
          {isCompleting ? 'Completing...' : 'Complete Order'}
        </Button>
      </CardActions>
      {error && <Typography color="error" variant="body2" sx={{ p: 2 }}>{error}</Typography>}
    </Card>
  );
};

export default OrderCard;