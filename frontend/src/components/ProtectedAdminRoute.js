// components/ProtectedAdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  if (!isAdmin) {
    alert("❌ Access denied. Admins only.");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
