import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "~/components/provider/authcontext";

const Authlayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1>Loading...</h1>
      </div>
    );
  }
  if (isAuthenticated) {
    return (
      <div className=" h-screen flex items-center justify-center">
        <Navigate to={"/dashboard"} />
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
