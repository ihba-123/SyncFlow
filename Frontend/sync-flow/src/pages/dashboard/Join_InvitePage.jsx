import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { joinLink } from "../../api/invite_join";
import { useAuth } from "../../hooks/Auth";
import { useSetActiveProject } from "../../hooks/useSetActiveProject";

const JoinInvitePage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { is_Authenticated } = useAuth();
  const setActiveProjectMutation = useSetActiveProject();
  const joinAttempted = useRef(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const joinAndSetActive = async () => {
      if (!token || joinAttempted.current) return;
      joinAttempted.current = true;
      setLoading(true);

      try {
        //  Join the project
        const data = await joinLink(token);
        // Set the project as active
        await setActiveProjectMutation.mutateAsync(data.project_id);

        // Navigate to project page
        navigate(`/projects/${data.project_id}`, { replace: true });
      } catch (err) {
        console.error("Failed to join project:", err);
        setError(
          err?.response?.data?.error ||
          err?.response?.data?.detail ||
          "This invitation link is invalid or has expired."
        );
      } finally {
        setLoading(false);
      }
    };

    joinAndSetActive();
  }, [token, navigate, setActiveProjectMutation]);



  useEffect(() => {
    const joinProcess = async () => {
      if (!token || joinAttempted.current || !is_Authenticated) return;
      joinAttempted.current = true;
      setLoading(true);

      try {
        const data = await joinLink(token); 
        // This call triggers the 'member_joined' broadcast on the backend!
        
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        await setActiveProjectMutation.mutateAsync(data.project_id);
        navigate(`/projects/${data.project_id}`, { replace: true });
      } catch (err) {
        setError(err?.response?.data?.detail || "Invalid invite.");
      } finally {
        setLoading(false);
      }
    };
    joinProcess();
  }, [token, is_Authenticated]);




  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
        <h2 className="text-xl font-semibold text-slate-800">
          Joining Project...
        </h2>
      </div>
    );
  }

  // If user is not authenticated
  if (!is_Authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] p-4">
        <div
          className="max-w-md w-full p-8 rounded-2xl text-center
          backdrop-blur-xl bg-white/70 dark:bg-white/10
          border border-white/30 dark:border-white/10
          shadow-xl"
        >
          <div className="text-5xl mb-4">🔐</div>

          <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">
            Join Project
          </h2>

          <p className="text-slate-600 dark:text-slate-300 mb-6">
            You need an account to join this team.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(`/signup?invite=${token}`)}
              className="w-full py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Create Account
            </button>

            <button
              onClick={() => navigate(`/login?invite=${token}`)}
              className="w-full py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Error UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center border border-red-100">
          <div className="text-red-500 text-5xl mb-4">✕</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Unable to Join
          </h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Default fallback (rarely visible)
  return null;
};

export default JoinInvitePage;