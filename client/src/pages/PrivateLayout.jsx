import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/loading/Loading";

const PrivateLayout = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <Loading />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateLayout;
