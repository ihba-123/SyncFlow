import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/Auth";
import Loader from "../components/Spinner";

const PublicRoute = () => {
  const { hasCheckedAuth, data } = useAuth();

  if (!hasCheckedAuth) {
    return <div className="max-h-screen  flex justify-center items-center"><Loader /></div>;
  }

  if (data) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;