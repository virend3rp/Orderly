import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute'; 
import AuthenticatedLayout from './components/AuthenticatedLayout';
import ShoppingCart from './features/customer/ShoppingCart'; // Import the global cart drawer

import LoginPage from './pages/LoginPage';
import CustomerViewPage from './pages/CustomerViewPage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import ConsolidationDashboardPage from './pages/ConsolidationDashboardPage'; 
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      {/* The ShoppingCart drawer is now at the top level, available to the app */}
      <ShoppingCart />
      
      <Routes>
        {/* ... All your <Route> components remain exactly the same ... */}
        <Route path="/" element={<CustomerViewPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route 
          path="/staff/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['staff', 'admin']}>
              <AuthenticatedLayout>
                <StaffDashboardPage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/consolidation/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['consolidation', 'admin']}>
              <AuthenticatedLayout>
                <ConsolidationDashboardPage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AuthenticatedLayout>
                <AdminPage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;