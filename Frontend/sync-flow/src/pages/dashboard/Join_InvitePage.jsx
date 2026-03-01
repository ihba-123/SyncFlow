import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { joinLink } from "../../api/invite_join";

const JoinInvitePage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  // CRITICAL: This ref prevents the double-request in React Strict Mode
  const joinAttempted = useRef(false);

  const mutation = useMutation({
    mutationFn: (inviteToken) => joinLink(inviteToken),
    retry: false, // Do not retry a 400 error
    onSuccess: (data) => {
      // Redirect to the project dashboard after success
      setTimeout(() => {
        navigate(`/projects/${data.project_id}`, { replace: true });
      }, 1500);
    },
  });

  useEffect(() => {
    // Only call the API if we have a token and haven't tried yet
    if (token && !joinAttempted.current) {
      joinAttempted.current = true;
      mutation.mutate(token);
    }
  }, [token, mutation]);

  // --- UI STATES ---

  if (mutation.isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
        <h2 className="text-xl font-semibold text-slate-800">Joining Project...</h2>
      </div>
    );
  }

  if (mutation.isError) {
    // This grabs the "detail" or "error" message sent by your Django ValidationError
    const errorMessage = mutation.error?.response?.data?.error || 
                         mutation.error?.response?.data?.detail || 
                         "This invitation link is invalid or has expired.";

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center border border-red-100">
          <div className="text-red-500 text-5xl mb-4">✕</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Unable to Join</h2>
          <p className="text-slate-600 mb-6">{errorMessage}</p>
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

  if (mutation.isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center border border-green-100">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Success!</h2>
          <p className="text-slate-600 mb-4">You've joined the team. Redirecting...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default JoinInvitePage;