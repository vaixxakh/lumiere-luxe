// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  if (!user || !user.isAdmin) {

    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
