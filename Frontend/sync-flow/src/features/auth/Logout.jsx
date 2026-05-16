// src/components/Logout.jsx
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Logout as logoutApi } from "../../api/auth";
import { useAuthStore } from "../../stores/AuthStore";
import { toast } from "react-toastify";
import { Button, CircularProgress } from "@mui/material";
import { Settings } from "lucide-react";
import { useProject } from "../../hooks/useProject";
import { clearAccessToken } from "../../utils/authToken";

const Logout = () => {
  const navigate = useNavigate();
  const clearUser = useAuthStore((s) => s.clearUser);
  const queryClient = useQueryClient();
  const clearProject = useProject((state) => state.clearProject);
  const mutation = useMutation({
    mutationFn: logoutApi,
   onSuccess: () => {
    queryClient.clear(); 
  
    clearUser();
    clearAccessToken();
  
    // localStorage.removeItem("isAuthenticated");
    // localStorage.removeItem("project-active-storage");
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  },
    onError: () => {
      queryClient.removeQueries({ queryKey: ["auth"], exact: true });
      clearUser();
      clearAccessToken();
      navigate("/login", { replace: true });
      toast.success("Logged out");
    },
  });

  return (
    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer text-red-700"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
     <Settings className="w-4 h-4" />
      {mutation.isPending ? <CircularProgress enableTrackSlot size="30px" /> : "Logout"}
    </button>
  );
  
};

export default Logout;

  