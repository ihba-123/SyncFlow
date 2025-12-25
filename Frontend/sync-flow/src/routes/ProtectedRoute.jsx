import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/Auth";
import Loader from "../components/Spinner";
import { Sidebar } from "../components/ProtectedNav/SideNavbar";
import { ProtectedNavbar } from "../components/ProtectedNav/ProtectedNavbar";
import { useEffect, useState } from "react";
import { cn } from "../utils/utils";

const ProtectedRoute = () => {
  const { hasCheckedAuth, data, isError } = useAuth();

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [isExpanded, setIsExpanded] = useState(false); // always closed on reload

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsExpanded(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!hasCheckedAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <Loader />
      </div>
    );
  }

  if (!data || isError) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] ">
      <Sidebar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        isMobile={isMobile}
      />

      {isMobile && isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          className="fixed inset-0  dark:bg-[var(--background)]   backdrop-blur-sm z-40"
        />
      )}  

      <ProtectedNavbar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        isMobile={isMobile}
      />

      <main
        className={cn(
          "pt-16 min-h-screen transition-all duration-300",
          !isMobile && (isExpanded ? "pl-64" : "pl-16")
        )}
      >
        <Outlet />
      </main>
    </div>
  );
};


export default ProtectedRoute;