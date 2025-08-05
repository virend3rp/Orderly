import React from 'react';
import useCartStore from '../store/cartStore';
import { Paper, Typography, Button, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const GlobalOrderCard = () => {
  const { items, toggleCart } = useCartStore();

  if (items.length === 0) {
    return null;
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  return (
    <Paper 
      elevation={8} 
      sx={{ 
        position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        zIndex: 1100, width: '90%', maxWidth: '500px', p: 2,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderRadius: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ShoppingCartIcon sx={{ mr: 1.5 }}/>
        <Typography fontWeight="bold">
          {itemCount} item{itemCount > 1 ? 's' : ''}
        </Typography>
      </Box>
      <Typography variant="h6" fontWeight="bold">
        Total: ${totalPrice}
      </Typography>
      <Button variant="contained" onClick={toggleCart}>
        View Cart
      </Button>
    </Paper>
  );
};

export default GlobalOrderCard;