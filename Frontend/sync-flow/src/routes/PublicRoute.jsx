import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/Auth";
import Loader from "../components/Spinner";

const PublicRoute = () => {
  const { hasCheckedAuth, data } = useAuth();
  // console.log(hasCheckedAuth , is_Authenticated , data)
  if (!hasCheckedAuth) {
    return <div className="min-h-screen  flex justify-center bg-white items-center"><Loader /></div>;
  }

  if (data) {
    return <Navigate to="/dashboard" replace />;
  } 

  return <Outlet />;
};

export default PublicRoute;