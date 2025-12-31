import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../api/profile";
import { useAuth } from "../../hooks/Auth";
import { useUserProfile } from "../../hooks/UserProfile";
import { User, Camera } from "lucide-react";
import ProgressBar from "../../components/ui/ProgressBar";

// Reusable Input
const InputField = ({
  label,
  value,
  onChange,
  disabled,
  placeholder,
  textarea = false,
}) => {
  const Component = textarea ? "textarea" : "input";
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <Component
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        rows={textarea ? 5 : undefined}
        className="w-full px-5 py-3.5 bg-white/70 dark:bg-gray-800/40 backdrop-blur-md border border-gray-400 dark:border-gray-700/50 rounded text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
      />
      {textarea && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Max 240 characters
        </p>
      )}
    </div>
  );
};


const ProfileAvatar = ({ src, onChange, disabled }) => (
  <div className="relative group">
    <div className="w-32 h-32 rounded-full bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-4 border-white/40 dark:border-gray-700/60 flex items-center justify-center overflow-hidden shadow-xl">
      {src ? (
        <img src={src} alt="Profile" className="w-full  h-full object-cover" />
      ) : (
        <User className="w-16 h-16 text-gray-500 dark:text-gray-400" />
      )}
    </div>
    <label className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
      <Camera className="w-8 h-8 text-white" />
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        disabled={disabled}
        className="hidden"
      />
    </label>
  </div>
);

export const EditProfile = () => {
  const [newName, setNewName] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newPhoto, setNewPhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState("");

  const { data: authData } = useAuth();
  const { name, photo, bio , isLoading } = useUserProfile();
  const queryClient = useQueryClient();

  useEffect(() => {
    setNewName(authData?.name ?? name ?? "");
    setNewBio(authData?.bio ?? bio ?? "");
    setPreviewPhoto(authData?.photo ?? photo ?? "");
  }, [authData, name, bio, photo]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      const updatedName = data.user_name || newName;
      queryClient.invalidateQueries(["chat-profile", "auth"]);
      setNewName(updatedName);
      setNewBio(data.bio ?? newBio);
      if (data.photo) setPreviewPhoto(data.photo);
      setNewPhoto(null);
    },
    onError: () => alert("Failed to save profile."),
  });

  const handleSave = () => {
    const formData = new FormData();
    const trimmedName = newName.trim();
    if (trimmedName && trimmedName !== (authData?.name ?? name))
      formData.append("name", trimmedName);
    if (newBio.trim() !== (authData?.bio ?? bio ?? ""))
      formData.append("bio", newBio.trim());
    if (newPhoto) formData.append("photo", newPhoto);
    if ([...formData.entries()].length === 0) return;
    mutation.mutate(formData);
  };

  const handleCancel = () => {
    setNewName(authData?.name ?? name ?? "");
    setNewBio(authData?.bio ?? bio ?? "");
    setPreviewPhoto(authData?.photo ?? photo ?? "");
    setNewPhoto(null);
  };

  const isSaving = mutation.isPending;
  
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-all">
      <ProgressBar apiLoading={isSaving} />
      <div className="flex">
        {/* Sidebar - Hidden on mobile */}
        <aside className="hidden md:block w-80 bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl border-r border-white/20 dark:border-gray-800/40 h-screen fixed overflow-y-auto shadow-2xl">
          <div className="p-8">
            <div className="flex flex-col items-center mb-12">
              <ProfileAvatar
                src={previewPhoto}
                onChange={handlePhotoChange}
                disabled={isSaving}
              />
              <p className="mt-5 text-xl font-semibold text-gray-900 dark:text-white">
                {newName || "Your Name"}
              </p>
            </div>

            <nav className="space-y-3">
              <div className="flex items-center gap-4 px-6 py-4 bg-blue-500/20 dark:bg-blue-600/20 text-black dark:text-blue-300 rounded-xl font-medium border border-blue-400/30 dark:border-blue-500/30">
                <User className="w-5 h-5" />
                Personal Info
              </div>
            </nav>
          </div>
        </aside>

        
        <main className="flex-1 md:ml-80 p-6 sm:p-8 lg:p-12">
          <div className="max-w-3xl mx-auto">
            
            <div className="md:hidden flex flex-col items-center mb-8">
              <ProfileAvatar
                src={previewPhoto}
                onChange={handlePhotoChange}
                disabled={isSaving}
              />
              <p className="mt-5 text-2xl font-semibold text-gray-900 dark:text-white">
                {newName || "Your Name"}
              </p>
            </div>

           
            <div className="md:hidden border-t border-gray-300/50 dark:border-gray-700/50 mb-10"></div>

            {/* Glassy Form Card */}
            <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-8">
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Profile Photo
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <ProfileAvatar
                    src={previewPhoto}
                    onChange={handlePhotoChange}
                    disabled={isSaving}
                  />
                  <div className="text-center sm:text-left text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">Click avatar to upload new photo</p>
                    <p className="mt-1">PNG, JPG • Max 10MB</p>
                  </div>
                </div>
              </div>
                            <div className="flex flex-col sm:flex-row justify-end gap-4  border-t border-gray-400 shadow-sm shadow-gray-700 dark:border-gray-700/50"></div>
              <InputField
                label="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={isSaving}
                placeholder="Enter your name"
              />

              <InputField
                label="Bio"
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                disabled={isSaving}
                placeholder="Write something about yourself..."
                textarea
              />
              <div className="flex flex-col sm:flex-row justify-end gap-4  border-t border-gray-400 shadow-sm shadow-gray-700 dark:border-gray-700/50"></div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 ">
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-3 py-0.2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-sm transition-all duration-200 hover:scale-105 disabled:opacity-70 border border-gray-300 dark:border-gray-600 order-2 text-[14px] sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-background/90 text-gray-800 dark:text-white font-medium rounded-sm transition-all duration-200 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[14px] shadow-sm order-1 sm:order-2"
                >
                  {isSaving && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditProfile;