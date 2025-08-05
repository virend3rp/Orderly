import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  CircularProgress, Button, Box, Typography, Alert
} from '@mui/material';
import ProductFormModal from './ProductFormModal';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      // Reset states on each fetch
      setLoading(true);
      setError(''); 
      const response = await apiClient.get('/admin/products');
      setProducts(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch products. Please check your connection or log in again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiClient.delete(`/admin/products/${productId}`);
        fetchProducts(); // Refresh list after deleting
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete product.');
        console.error(err);
      }
    }
  };

  // --- Main Render Logic ---
  // First, handle loading and error states exclusively.
  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  // Only if there is no loading or error, render the main content.
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Products</Typography>
        <Button variant="contained" onClick={handleOpenCreate}>Create New Product</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Skill Group</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.product_code}</TableCell>
                <TableCell>${parseFloat(product.price).toFixed(2)}</TableCell>
                <TableCell>{product.group_name}</TableCell>
                <TableCell align="right">
                  <Button size="small" sx={{ mr: 1 }} onClick={() => handleOpenEdit(product)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(product.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ProductFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchProducts}
        productToEdit={editingProduct}
      />
    </>
  );
};

export default ProductManager;