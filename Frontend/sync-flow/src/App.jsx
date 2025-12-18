import LandingPageRoute from "./routes/LandingPageRoute";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import { useAuth } from "./hooks/Auth";
const App = () => {
  useAuth();
  console.log("useAuth", useAuth());
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000} // 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route element={<PublicRoute/>}>
        <Route path="/" element={<LandingPageRoute />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        </Route>
        
        <Route path="*" element={<div>404 Not Found</div>} />

        <Route  element={<ProtectedRoute/>}>
        <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
