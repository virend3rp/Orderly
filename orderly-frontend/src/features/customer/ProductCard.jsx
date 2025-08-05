import React from 'react';
import useCartStore from '../../store/cartStore';
import { Card, CardContent, CardActions, Typography, Button, CardMedia, Divider } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ProductCard = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
      <CardMedia
        component="img"
        height="140"
        image={`https://placehold.co/600x400?text=${product.name.replace(' ', '+')}`}
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
        <Typography variant="h6" component="p">
          ${parseFloat(product.price).toFixed(2)}
        </Typography>
        <Button 
          size="small" 
          variant="contained" 
          onClick={() => addToCart(product)}
          startIcon={<AddShoppingCartIcon />}
        >
          Add
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;