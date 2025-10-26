import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRouteForDashboard = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // if no token then send to login
    return <Navigate to="/login" replace />;
  }


  return children;
};

export default PrivateRouteForDashboard;
