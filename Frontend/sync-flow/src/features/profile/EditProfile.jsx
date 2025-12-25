import React, { useState , useEffect } from "react";
import UserProfileEdit from "./UserProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../api/profile";
import { useAuth } from "../../hooks/Auth";
import { useUserProfile } from "../../hooks/UserProfile";

export const EditProfile = () => {
  const [newName, setNewName] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newPhoto, setNewPhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState("");
  const { data: authData } = useAuth();
     const { name, photo, bio } = useUserProfile();



  useEffect(() => {
    setNewName(authData?.name ?? name ?? "");
    setNewBio(authData?.bio ?? bio ?? "");
    setPreviewPhoto(authData?.photo ?? photo ?? "");
  }, [authData, name, bio, photo]);

  const queryClient = useQueryClient();
  const handleSave = () => {
    const formData = new FormData();
    const trimmedName = newName.trim();
    if (trimmedName && trimmedName !== (authData?.name ?? name))
      formData.append("name", trimmedName);
    if (newBio.trim() !== (authData?.bio ?? bio ?? ""))
      formData.append("bio", newBio.trim());
    if (newPhoto) formData.append("photo", newPhoto);
    if (formData.entries().next().done) return;
    mutation.mutate(formData);
  };

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
      queryClient.setQueryData(["chat-profile"], (old) => ({
        ...old,
        name: updatedName,
        bio: data.bio ?? old?.bio,
        photo: data.photo ?? old?.photo,
      }));
      queryClient.setQueryData(["auth"], (old) => ({
        ...old,
        name: updatedName,
        bio: data.bio ?? old?.bio,
        photo: data.photo ?? old?.photo,
      }));
      setNewName(updatedName);
      setNewBio(data.bio ?? "");
      if (data.photo) setPreviewPhoto(data.photo);
      setNewPhoto(null);
    },
    onError: () => alert("Failed to save profile."),
  });

  const handleCancel = () => {
    setNewName(authData?.name ?? name ?? "");
    setNewBio(authData?.bio ?? bio ?? "");
    setPreviewPhoto(authData?.photo ?? photo ?? "");
    setNewPhoto(null);
  };

  const isSaving = mutation.isPending;

  const fileName = newPhoto ? newPhoto.name : null;
  return (
    <div>
      <div className="lg:col-span-7 lg:mt-0 mt-8">
        <div className="bg-gray-900/20 backdrop-blur-2xl  border border-gray-800 rounded-3xl p-6 sm:p-8">
          <div className="space-y-7">
            <div>
              <label className="text-sm font-medium text-gray-400 mb-2 block">
                Name
              </label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter your name"
                disabled={isSaving}
                className="w-full px-5 py-4 rounded-2xl bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:bg-gray-800/60 transition-all duration-200"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400 mb-2 block">
                Bio
              </label>
              <textarea
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                rows={4}
                placeholder="Write a short bio..."
                disabled={isSaving}
                className="w-full px-5 py-4 rounded-2xl bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:bg-gray-800/60 resize-none transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-2">Max 240 characters</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400 mb-2 block">
                Profile Photo
              </label>
              <label className="block w-full px-5 py-10 rounded-2xl bg-gray-800/40 backdrop-blur-xl border-2 border-dashed border-gray-700 text-center cursor-pointer hover:border-gray-600 hover:bg-gray-800/60 transition-all duration-200 relative overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isSaving}
                />

                {fileName ? (
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 mx-auto text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-gray-300 font-medium text-sm px-4 break-words max-w-full">
                      {fileName}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Click or drag to replace
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 mx-auto text-gray-500 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-gray-400">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                )}
              </label>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-lg bg-gray-800/70 text-gray-400 hover:bg-gray-800 hover:text-gray-200 text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-900 flex items-center justify-center gap-2 text-sm transition shadow-sm"
              >
                {isSaving ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
   
      </div>
    </div>
  );
};

export default EditProfile;
