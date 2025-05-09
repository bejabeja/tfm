import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Spinner from "../components/spinner/Spinner";
import {
  selectAuthLoading,
  selectIsAuthenticated,
} from "../store/auth/authSelectors";

const PrivateLayout = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authLoading = useSelector(selectAuthLoading);

  if (authLoading) {
    return <Spinner />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateLayout;
