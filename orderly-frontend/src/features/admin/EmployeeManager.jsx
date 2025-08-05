import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  CircularProgress, Typography, Button, Alert 
} from '@mui/material';
import EditRoleModal from './EditRoleModal'; // Import the new modal

const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for controlling the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/employees');
      setEmployees(response.data);
    } catch (error) {
      setError("Failed to fetch employees");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpenModal = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setIsModalOpen(false);
  };

  if (loading) return <CircularProgress />;

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.id}</TableCell>
                <TableCell>{employee.full_name}</TableCell>
                <TableCell>{employee.username}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell align="right">
                  <Button size="small" variant="outlined" onClick={() => handleOpenModal(employee)}>
                    Edit Role
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EditRoleModal
        employee={selectedEmployee}
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchEmployees} // Re-fetch employees on successful update
      />
    </>
  );
};

export default EmployeeManager;