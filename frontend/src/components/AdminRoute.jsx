import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin()) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default AdminRoute;
