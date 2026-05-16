import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { googleLogin } from "../../api/auth";
import { useAuthStore } from "../../stores/AuthStore";
import { setAccessToken } from "../../utils/authToken";

const fallbackClassName =
  "flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50";

export default function GoogleAuthButton({
  label = "Continue with Google",
  navigateTo = "/dashboard",
}) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const buttonWidth = 340;

  const loginMutation = useMutation({
    mutationFn: googleLogin,
    onSuccess: (response) => {
      const user = response?.data?.user || null;
      const accessToken = response?.data?.access;
      if (user) {
        setUser(user);
        queryClient.setQueryData(["auth"], user);
      }
      if (accessToken) {
        setAccessToken(accessToken);
      }

      toast.success("Welcome back, " + (user?.name || "User") + "!");
      navigate(navigateTo, { replace: true });
    },
    onError: (error) => {
      const detail = error.response?.data?.detail;
      toast.error(detail || "Google sign-in failed. Please try again.");
    },
  });

  const handleSuccess = (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      toast.error("Google did not return a valid credential.");
      return;
    }

    loginMutation.mutate(idToken.trim());
  };

  const handleError = () => {
    toast.error("Google sign-in was cancelled or failed.");
  };

  if (!clientId) {
    return (
      <button
        type="button"
        className={fallbackClassName}
        disabled
        title="Set VITE_GOOGLE_CLIENT_ID to enable Google sign-in"
      >
        <FcGoogle className="h-5 w-5" />
        {label}
      </button>
    );
  }

  return (
    <div className="relative flex w-full  justify-center overflow-hidden rounded-xl">
      <div className={loginMutation.isPending ? "pointer-events-none opacity-60" : ""}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          width={buttonWidth}
          shape="rectangular"
          theme="outline"
          size="large"
          text="signin_with"
          useOneTap={false}
        />
      </div>

      {loginMutation.isPending && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/75 backdrop-blur-sm">
          <div className="flex items-center  gap-2 w-[90%] border-2 border-blue-50 justify-center rounded-sm bg-blue-50 text-black px-4 py-2 text-sm font-semibold  shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in with Google..........
          </div>
        </div>
      )}
    </div>
  );
}
