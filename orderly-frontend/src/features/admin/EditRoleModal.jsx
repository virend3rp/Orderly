import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import { Modal, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const EditRoleModal = ({ employee, open, onClose, onSuccess }) => {
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // When the modal opens with an employee, set the current role in the state
    if (employee) {
      setRole(employee.role);
    }
  }, [employee]);

  const handleSave = async () => {
    setError('');
    try {
      await apiClient.patch(`/admin/employees/${employee.id}/role`, { role });
      onSuccess(); // Notify parent to refresh data
      onClose();   // Close the modal
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role.');
    }
  };

  if (!employee) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Change Role for {employee.full_name}
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="role-select-label">Role</InputLabel>
          <Select
            labelId="role-select-label"
            value={role}
            label="Role"
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value={'staff'}>Staff</MenuItem>
            <MenuItem value={'consolidation'}>Consolidation</MenuItem>
            <MenuItem value={'admin'}>Admin</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditRoleModal;