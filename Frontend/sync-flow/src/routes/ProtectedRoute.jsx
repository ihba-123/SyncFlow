import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/Auth";
import { useState, useEffect } from "react";
import { cn } from "../utils/utils";
import { Sidebar } from "../components/ProtectedNav/SideNavbar";
import { ProtectedNavbar } from "../components/ProtectedNav/ProtectedNavbar";
import ProgressBar from "../components/ui/ProgressBar";

const ProtectedRoute = () => {
  const { hasCheckedAuth, data, isError } = useAuth();

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  // CHANGE HERE: Start with sidebar CLOSED by default on all devices
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!hasCheckedAuth) {
    return null;
  }

  if (!data || isError) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen  bg-card text-foreground ">
      <ProgressBar />
      <Sidebar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        isMobile={isMobile}
      />

      {/* Mobile overlay when sidebar is open */}
      {isMobile && isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          className="fixed inset-0 dark:bg-black/10 bg-white/30 backdrop-blur-sm z-40"
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
