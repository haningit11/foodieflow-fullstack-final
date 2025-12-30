import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * AdminRoute Component
 * 
 * Protects routes that should only be accessible by administrators.
 * Checks if the user is logged in AND has the 'admin' role.
 * If not, redirects to the login page, preserving the attempted location.
 */
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Redirect if not logged in or not an admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
