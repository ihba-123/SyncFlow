import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/Auth";
import Loader from "../components/Spinner";

const ProtectedRoute = () => {
  const { hasCheckedAuth, data, isError } = useAuth(); // data = user

  if (!hasCheckedAuth) {
    return <div className="h-screen-full mt-56 flex justify-center items-center"><Loader /></div>;
  }

  if (!data || isError) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;