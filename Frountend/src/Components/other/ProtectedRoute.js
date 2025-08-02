import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  
  return <Outlet />;
};

export default PrivateRoute;
