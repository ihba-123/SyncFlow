import LandingPageRoute from "./routes/LandingPageRoute";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/dashboard/Dashboard";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import { useUserProfile } from "./hooks/UserProfile";
import UserProfileEdit from "./features/profile/UserProfile";
import { useEffect } from "react";
import useTheme from "./hooks/useTheme";
import { EditProfile } from "./features/profile/EditProfile";
import ProgressBar from "./components/ui/ProgressBar";
const App = () => {
  <ProgressBar />;
  useTheme();
  useUserProfile();
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
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LandingPageRoute />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/edit-profile" element={<EditProfile />} />
          <Route path="/dashboard/profile" element={<UserProfileEdit />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
