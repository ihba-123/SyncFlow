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
import useTheme from "./hooks/useTheme";
import { EditProfile } from "./features/profile/EditProfile";
import ProgressBar from "./components/ui/ProgressBar";
import WelcomePage from "./pages/dashboard/WelcomePage";
import Project from "./pages/dashboard/Project";
import { CreateProject } from "./features/project/CreateProject";
import { SoloProject } from "./features/project/SoloProject";
import ProjectDetail from "./features/project/ProjectDetail";
import TeamList from "./features/team/TeamList";
import InvitePage from "./pages/dashboard/InvitePage";
import Join_InvitePage from "./pages/dashboard/Join_InvitePage";
import { Archive } from "lucide-react";
import ProjectRestore from "./features/RestoreProject/ProjectRestore";
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


          <Route path="/join/:token" element={<Join_InvitePage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/edit-profile" element={<EditProfile />} />
          <Route path="/dashboard/profile" element={<UserProfileEdit />} />
          <Route path="/dashboard/project" element={<Project/>} />
          <Route path="/dashboard/create-project" element={<CreateProject/>} />
          <Route path="/dashboard/solo-project" element={<SoloProject/>} />
          <Route path="/welcome/" element={<WelcomePage />} />  
          <Route path="/project-archive" element={<ProjectRestore/>} />

          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/projects/:project_id/invite" element={<InvitePage />} />
          <Route path="/teams/:id/Projectmembers" element={<TeamList />} />
          <Route path="/users/:id" element={<UserProfileEdit />} />
        </Route>
        <Route path="*" element={<div>404 Not Found</div>} />

      </Routes>
    </div>
  );
};

export default App;
