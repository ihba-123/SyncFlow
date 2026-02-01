import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { joinLink } from "../../api/invite_join";

const JoinInvitePage = () => {
  const { token } = useParams(); // ← better typing
  const navigate = useNavigate();

  console.log("Invite token:", token); // debug

  const mutation = useMutation({
    mutationFn: (inviteToken) => joinLink(inviteToken), // explicit arg
    // OR — if your joinLink expects object:   mutationFn: ({ token }: { token: string }) => joinLink({ token }),
    retry: false, // usually no retry on invite links
    onSuccess: (responseData) => {
      // Assuming your API returns something like { message, project_id }
      if (responseData?.project_id) {
        setTimeout(() => {
          navigate(`/projects/${responseData.project_id}`, { replace: true });
        }, 1400);
      }
    },
    onError: (err) => {
      console.error("Join failed:", err);
    },
  });

  useEffect(() => {
    if (token) {
      mutation.mutate(token);
    } else {
      // Optional: show nice error if no token in URL
      mutation.reset(); // just in case
    }
  }, [token]); // no need to depend on mutate

  // ────────────────────────────────────────────────
  //               RENDER STATES
  // ────────────────────────────────────────────────

  if (mutation.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-sm w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-gray-800">Verifying invite...</h2>
          <p className="text-gray-500 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (mutation.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full border border-red-200">
          <div className="mx-auto mb-6 text-red-500">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-700 mb-3">Oops!</h2>
          <p className="text-red-600 mb-6">
            {mutation.error?.response?.data?.error || "This invite is invalid or has expired."}
          </p>
          <button
            onClick={() => navigate("/dashboard", { replace: true })}
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (mutation.isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-10 bg-white rounded-2xl shadow-2xl max-w-md w-full border border-green-200">
          <div className="mx-auto mb-6 text-green-500">
            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-green-800 mb-3">Welcome aboard!</h2>
          <p className="text-green-700 text-lg mb-2">{mutation.data?.message || "You've successfully joined the workspace."}</p>
          <p className="text-gray-500">Redirecting to your project...</p>
        </div>
      </div>
    );
  }

  // Fallback — should rarely reach here
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-600 text-lg">No invite token found in the URL.</p>
    </div>
  );
};

export default JoinInvitePage;