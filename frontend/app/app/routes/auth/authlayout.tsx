import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "~/components/provider/authcontext";
import React, { useEffect } from "react";

const Authlayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      <Navigate to={'/dashboard'}/>
    }
  }, [isLoading, isAuthenticated, navigate]);
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1>Loading...</h1>
      </div>
    );
  }
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Outlet />
    </div>
  );
};

export default Authlayout;
