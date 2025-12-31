// src/components/Logout.jsx
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Logout as logoutApi } from "../../api/auth";
import { useAuthStore } from "../../stores/AuthStore";
import { toast } from "react-toastify";
import { Button, CircularProgress } from "@mui/material";
import { Settings } from "lucide-react";

const Logout = () => {
  const navigate = useNavigate();
  const clearUser = useAuthStore((s) => s.clearUser);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
    queryClient.removeQueries(["user-profile"]); // clear profile query
    queryClient.removeQueries(["chat-profile"]); // clear chat queries  
    queryClient.clear();
    clearUser();
    localStorage.removeItem("isAuthenticated");
    navigate("/login", { replace: true });
  },
    onError: () => {
      // Even if backend fails, logout locally (cookies cleared)
      queryClient.removeQueries({ queryKey: ["auth"], exact: true });
      clearUser();
      navigate("/login", { replace: true });
      toast.success("Logged out");
    },
  });

  return (
    <button className="w-full flex text-red-700 items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer text-destructive"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
     <Settings className="w-4 h-4" />
      {mutation.isPending ? <CircularProgress enableTrackSlot size="30px" /> : "Logout"}
    </button>
  );
  
};

export default Logout;

  