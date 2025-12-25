import { useState } from "react";
import { useAuth } from "../../hooks/Auth";
import { useUserProfile } from "../../hooks/UserProfile";
import { Mail, Calendar, Edit3 } from "lucide-react";

export default function UserProfile() {
  const [previewPhoto, setPreviewPhoto] = useState("");

  const { data: authData } = useAuth();
  const { name, photo, bio } = useUserProfile();

  const displayName = name || "Hello";
  const initials = displayName.charAt(0).toUpperCase();
  const email = authData?.email || "abhishekbhatta110@gmail.com";
  const joinDate = "Dec 25, 2025"; // Make dynamic later if needed
  const userBio = bio || "No bio yet. Click Edit Profile to add one.";

  const stats = [
    { label: "Notes Created", value: 0 },
    { label: "Quizzes Created", value: 0 },
    { label: "Quizzes Attempted", value: 0 },
    { label: "Average Score", value: "0%" },
    { label: "Current Streak", value: 1 },
  ];

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreviewPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Main Profile Card */}
        <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden">
          {/* Top Section */}
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 lg:gap-8">
              {/* Avatar */}
              <div className="relative group shrink-0">
                {previewPhoto || authData?.photo || photo ? (
                  <img
                    src={previewPhoto || authData?.photo || photo}
                    alt={displayName}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-800"
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-cyan-500 flex items-center justify-center text-4xl sm:text-5xl font-bold text-white border-4 border-gray-800">
                    {initials}
                  </div>
                )}

                <label className="absolute inset-0 rounded-full cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* User Info & Edit Button */}
              <div className="flex-1 text-center sm:text-left w-full">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="max-w-2xl">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-1">
                      {displayName}
                    </h1>

                    {/* Bio */}
                    {userBio && (
                      <p className="text-gray-300 text-base mb-6 leading-relaxed">
                        {userBio}
                      </p>
                    )}

                    {/* Email & Join Date */}
                    <div className="space-y-3 text-left">
                      <div className="flex items-center gap-3 text-gray-400">
                        <Mail className="w-5 h-5 flex-shrink-0" />
                        <span className="text-base break-all">{email}</span>
                      </div>
                      
                    </div>
                  </div>

                  
                  <button className="flex items-center gap-2 px-4 py-1 bg-gray-800/80 hover:bg-gray-700 text-white text-sm font-medium rounded-sm transition-all duration-200  active:scale-95  h-12  justify-center">
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}