import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  // If the user is not authenticated, redirect them to the login page.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the route requires specific roles and the user's role is not included,
  // redirect them to a safe page (like the homepage).
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If the user is authenticated and has the correct role, render the component.
  return children;
};

export default ProtectedRoute;