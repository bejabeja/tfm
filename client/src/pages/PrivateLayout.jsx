import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateLayout = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div className="loading-spinner">Loading private...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateLayout;
