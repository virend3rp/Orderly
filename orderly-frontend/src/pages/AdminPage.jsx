import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Container } from '@mui/material';
import EmployeeManager from '../features/admin/EmployeeManager';
import ProductManager from '../features/admin/ProductManager';
import SkillManager from '../features/admin/SkillManager';

// Helper component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminPage = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 2 }}>
        Admin Panel
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="admin tabs">
            <Tab label="Employee Management" id="admin-tab-0" />
            <Tab label="Product Management" id="admin-tab-1" />
            <Tab label="Skill Management" id="admin-tab-2" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <EmployeeManager />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ProductManager />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <SkillManager />
        </TabPanel>
      </Box>
    </Container>
  );
};

export default AdminPage;