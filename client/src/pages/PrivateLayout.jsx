import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateLayout = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  console.log("isAuthenticated", isAuthenticated);
  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateLayout;
