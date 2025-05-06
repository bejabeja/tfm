import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Spinner from "../components/spinner/Spinner";

const PrivateLayout = () => {
  const { isAuthenticated, authLoading } = useSelector((state) => state.auth);

  if (authLoading) {
    return <Spinner />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateLayout;
