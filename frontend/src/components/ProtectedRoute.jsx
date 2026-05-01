import React from 'react';
import { Navigate } from 'react-router-dom';
import { useProtectedRoute } from '../js/components/ProtectedRoute.js';

const ProtectedRoute = ({ children }) => {
  const { isAuthed, location } = useProtectedRoute();

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
