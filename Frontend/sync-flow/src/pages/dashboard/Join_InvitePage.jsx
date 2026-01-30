import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { joinLink } from "../../api/invite_join";

const Join_InvitePage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const { mutate, data, isLoading, isError, error, isSuccess } = useMutation({
    mutationFn: joinLink,
  });

  // Automatically call mutation when component mounts
  useEffect(() => {
    if (token) {
      mutate(token);
    }
  }, [token, mutate]);

  // Redirect to project after success
  useEffect(() => {
    if (isSuccess && data?.project_id) {
      const timer = setTimeout(() => {
        navigate(`/projects/${data.project_id}`, { replace: true });
      }, 1500); // 1.5s delay
      return () => clearTimeout(timer);
    }
  }, [isSuccess, data, navigate]);

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg flex flex-col items-center">
          <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 mb-4" />
          <p className="text-gray-700 font-medium">Verifying invite link...</p>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-6 bg-red-100 rounded-lg shadow-lg flex flex-col items-center">
          <svg
            className="w-12 h-12 text-red-500 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
            />
          </svg>
          <p className="text-red-700 font-medium">
            {error?.response?.data?.error || "Invalid or expired invite"}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- Success State ---
  if (isSuccess && data?.message) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-6 bg-green-100 rounded-lg shadow-lg flex flex-col items-center">
          <svg
            className="w-12 h-12 text-green-500 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p className="text-green-700 font-medium">{data.message}</p>
          <p className="text-green-600 text-sm mt-2">
            Redirecting you to the project...
          </p>
        </div>
      </div>
    );
  }

  return null;
};



export default Join_InvitePage
