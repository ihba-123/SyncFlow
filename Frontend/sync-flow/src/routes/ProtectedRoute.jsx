import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/Auth";
import Loader from "../components/Spinner";
import { Sidebar } from "../components/ProtectedNav/SideNavbar";
import { ProtectedNavbar } from "../components/ProtectedNav/ProtectedNavbar";
import { useEffect, useState } from "react";
import { cn } from "../utils/utils";
// import ProtectedNavbar from "../routes/"

const ProtectedRoute = () => {
  const { hasCheckedAuth, data, isError } = useAuth();  


  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const [isExpanded, setIsExpanded] = useState(false) 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) 

  // Update on resize
useEffect(() => {
  const checkMobile = () => {
    const mobile = window.innerWidth < 768
    setIsMobile(mobile)

    if (mobile) {
      setIsExpanded(false) 
    }
  }

  window.addEventListener("resize", checkMobile)
  return () => window.removeEventListener("resize", checkMobile)
}, [])


  // Handle mobile menu toggle
useEffect(() => {
  if (isMobile) {
    setIsExpanded(isMobileMenuOpen)
  }
}, [isMobileMenuOpen, isMobile])


  if (!hasCheckedAuth) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    )
  }

  if (!data || isError) {
    return <Navigate to="/login" replace />
  }
  // background-color: var(--foreground);
  // color: var(--background);
  return (
    <div className="min-h-screen ">
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} isMobile={isMobile} />
      <ProtectedNavbar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        isMobile={isMobile}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <main
        className={cn(
          "pt-16 min-h-screen transition-all duration-300",
          isExpanded && !isMobile ? "pl-64" : "pl-16",
          isMobile && "pl-0"
        )}
      >
        <Outlet />
      </main>
    </div>
  )
}

export default ProtectedRoute