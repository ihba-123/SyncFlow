import { useRef, useState } from "react";
import { User, Users, Upload, X, Loader2, Folder, ArrowRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cn } from "../../utils/utils";
import ProgressBar from "../../components/ui/ProgressBar";
import { useProject } from "../../hooks/useProject";
import GameButton from "../../components/ui/GameButton";

export function CreateProject({ embedded = false, onClose }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [is_solo, setIs_solo] = useState(null);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const submitLockedRef = useRef(false);

  const { mutate, isPending } = useProject();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleProject = (e) => {
    e.preventDefault();
    if (submitLockedRef.current || isPending) return;

    if (!name.trim() || is_solo === null || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    submitLockedRef.current = true;

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("is_solo", is_solo);
    if (image) formData.append("image", image);

    mutate(formData, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        toast.success("Project created successfully!");
        setName("");
        setDescription("");
        setIs_solo(null);
        removeImage();
        submitLockedRef.current = false;

        // Navigate to the newly created project
        if (data?.data?.id) {
          setTimeout(() => {
            navigate(`/projects/${data.data.id}`);
          }, 500);
        }

        if (onClose) onClose();
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Failed to create project");
        submitLockedRef.current = false;
      },
    });
  };

  return (
    <div
      className={
        embedded
          ? "relative flex items-center justify-center px-4 py-4 transition-colors duration-500"
          : "min-h-screen flex items-center justify-center px-4 py-8 transition-colors duration-500 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 relative overflow-hidden"
      }
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {isPending && (
        <div className="fixed left-0 top-0 z-9999 w-full">
          <ProgressBar apiLoading={true} />
        </div>
      )}

      <div className="relative z-10 w-full max-w-lg">
        <form
          onSubmit={handleProject}
          className="relative flex flex-col gap-6 border border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 p-6 shadow-lg backdrop-blur-xl rounded-xl md:p-7"
        >
          {/* Header with close button */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-900 text-gray-900 dark:text-white">
                Create Project
              </h1>
              <p className="text-xs font-500 text-gray-600 dark:text-gray-400">
                Start your next big idea
              </p>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-105 active:scale-95"
                aria-label="Close create project dialog"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Solo vs Team Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Project Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIs_solo(true)}
                className={cn(
                  "relative flex items-center justify-center gap-2 py-3 px-3 font-bold text-xs transition-all duration-300 border rounded-lg",
                  is_solo === true
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white shadow-lg"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                <User size={16} />
                <span>Solo</span>
              </button>
              <button
                type="button"
                onClick={() => setIs_solo(false)}
                className={cn(
                  "relative flex items-center justify-center gap-2 py-3 px-3 font-bold text-xs transition-all duration-300 border rounded-lg",
                  is_solo === false
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white shadow-lg"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                <Users size={16} />
                <span>Team</span>
              </button>
            </div>
          </div>

          {/* Project Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Project Name <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <Folder
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 group-focus-within:text-gray-900 dark:group-focus-within:text-white transition-colors"
                size={16}
              />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                placeholder="Enter project name"
                className="w-full py-2.5 pl-10 pr-3 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:border-gray-900 dark:focus:border-white focus:bg-white dark:focus:bg-gray-800 outline-none transition-all font-500 placeholder:text-gray-500 dark:placeholder:text-gray-500 rounded-lg"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Cover Image
            </label>
            {!imagePreview ? (
              <label className="relative flex flex-col items-center justify-center py-8 px-3 border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group overflow-hidden rounded-lg">
                <Upload className="text-gray-400 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400 mb-1 transition-colors" size={20} />
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                  Click to upload
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            ) : (
              <div className="relative overflow-hidden border border-gray-200 dark:border-gray-700 group rounded-lg">
                <img src={imagePreview} className="w-full h-32 object-cover" alt="Preview" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="bg-white text-red-600 p-2 hover:bg-gray-100 transition-all active:scale-90"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              placeholder="Describe your project..."
              className="w-full py-2.5 px-3 h-24 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:border-gray-900 dark:focus:border-white focus:bg-white dark:focus:bg-gray-800 outline-none transition-all resize-none font-500 placeholder:text-gray-500 dark:placeholder:text-gray-500 rounded-lg"
            />
          </div>

          {/* Submit Button */}
          <GameButton
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isPending}
            disabled={isPending || is_solo === null}
          >
            {is_solo === false ? "Create Team Project" : "Create Solo Project"}
            <ArrowRight size={18} />
          </GameButton>
        </form>
      </div>
    </div>
  );
}
