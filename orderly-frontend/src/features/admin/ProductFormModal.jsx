import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import { Modal, Box, Typography, Button, TextField, Alert } from '@mui/material';

// Use the same style box from the other modal
const style = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4,
};

const ProductFormModal = ({ open, onClose, onSuccess, productToEdit }) => {
  const [formData, setFormData] = useState({
    product_code: '', name: '', description: '', price: '', skill_group_id: ''
  });
  const [error, setError] = useState('');
  
  const isEditMode = Boolean(productToEdit);

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        product_code: productToEdit.product_code,
        name: productToEdit.name,
        description: productToEdit.description || '',
        price: productToEdit.price,
        skill_group_id: productToEdit.skill_group_id,
      });
    } else {
      // Reset form for "Create" mode
      setFormData({ product_code: '', name: '', description: '', price: '', skill_group_id: '' });
    }
  }, [productToEdit, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isEditMode) {
        await apiClient.patch(`/admin/products/${productToEdit.id}`, formData);
      } else {
        await apiClient.post('/admin/products', formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6">{isEditMode ? 'Edit Product' : 'Create New Product'}</Typography>
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
        <TextField name="name" label="Product Name" value={formData.name} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="product_code" label="Product Code" value={formData.product_code} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="description" label="Description" value={formData.description} onChange={handleChange} fullWidth margin="normal" multiline rows={2} />
        <TextField name="price" label="Price" type="number" value={formData.price} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="skill_group_id" label="Skill Group ID" type="number" value={formData.skill_group_id} onChange={handleChange} fullWidth margin="normal" required />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProductFormModal;