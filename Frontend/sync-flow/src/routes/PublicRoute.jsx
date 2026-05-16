import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/Auth";

const PublicRoute = () => {
  const { hasCheckedAuth, data } = useAuth();
  
  if (!hasCheckedAuth) {
    return null;
  }

  if (data) {
    return <Navigate to="/dashboard" replace />;
  } 

  return <Outlet />;
};

export default PublicRoute;