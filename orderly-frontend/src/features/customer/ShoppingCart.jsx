import React, { useState } from 'react';
import apiClient from '../../api/axiosConfig';
import useCartStore from '../../store/cartStore';
import {
  Drawer, Typography, List, ListItem, ListItemText, Button, Box, IconButton, Divider, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const ShoppingCart = () => {
  const { items, removeFromCart, clearCart, isCartOpen, toggleCart } = useCartStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    const orderData = {
      items: items.map(item => ({ product_id: item.id, quantity: item.quantity })),
    };

    try {
      const response = await apiClient.post('/orders', orderData);
      setMessage({ type: 'success', text: `Order placed! Your order number is ${response.data.order_number}.`});
      clearCart();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to place order. Please try again.'});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer
      anchor="bottom"
      open={isCartOpen}
      onClose={toggleCart}
    >
      <Box sx={{ width: 'auto', p: 2 }} role="presentation">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2" gutterBottom>Your Order</Typography>
          <IconButton onClick={toggleCart}><CloseIcon /></IconButton>
        </Box>
        <Divider />
        {message.text && <Alert severity={message.type} sx={{ my: 2 }}>{message.text}</Alert>}
        
        {items.length === 0 && !message.text ? (
          <Typography sx={{ mt: 2 }} color="text.secondary">Your cart is empty.</Typography>
        ) : (
          <List>
            {items.map((item) => (
              <ListItem key={item.id} disablePadding secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.id)}>
                  <DeleteIcon />
                </IconButton>
              }>
                <ListItemText primary={`${item.name} x ${item.quantity}`} secondary={`$${(item.price * item.quantity).toFixed(2)}`} />
              </ListItem>
            ))}
          </List>
        )}

        {items.length > 0 && (
          <>
            <Divider sx={{ my: 2 }}/>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h5" fontWeight="bold">${calculateTotal()}</Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={isSubmitting}
              onClick={handlePlaceOrder}
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </Button>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default ShoppingCart;