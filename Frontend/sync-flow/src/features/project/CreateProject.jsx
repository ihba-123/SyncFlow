import { useState } from "react";
import {
  User,
  Users,
  Upload,
  X,
  Loader2,
  Folder,
  ArrowRight,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { cn } from "../../utils/utils";
import ProgressBar from "../../components/ui/ProgressBar";
import { useProject } from "../../hooks/useProject";

export function CreateProject() {
  const queryClient = useQueryClient();

  const [is_solo, setIs_solo] = useState(null);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
    if (!name.trim() || is_solo === null || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("is_solo", is_solo);
    if (image) formData.append("image", image);

    mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        toast.success("Project created successfully!");
        setName("");
        setDescription("");
        setIs_solo(null);
        removeImage();
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Failed to create project");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 transition-colors duration-500 bg-slate-50 dark:bg-[#020617] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full" />

      {isPending && (
        <div className="fixed top-0 left-0 w-full z-[9999]">
          <ProgressBar apiLoading={true} />
        </div>
      )}

      <div className="w-full max-w-xl z-10">
        <form
          onSubmit={handleProject}
          className="bg-white dark:bg-slate-900/60 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl p-6 md:p-10 flex flex-col gap-6 md:gap-8"
        >
          {/* Header */}
          <div className="text-center md:text-left space-y-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              Create <span className="text-blue-600 dark:text-blue-500">Project</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-bold">
              Initialize your next big idea.
            </p>
          </div>

          {/* Toggle Selector - Solo (Blue) vs Team (Purple) */}
          <div className="bg-slate-100 dark:bg-black/20 p-1.5 rounded-2xl flex border border-slate-200 dark:border-white/5 shadow-inner">
            <button
              type="button"
              onClick={() => setIs_solo(true)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all duration-300 uppercase tracking-widest",
                is_solo === true 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-[1.02]" 
                  : "text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-800"
              )}
            >
              <User size={16} /> Solo
            </button>
            <button
              type="button"
              onClick={() => setIs_solo(false)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all duration-300 uppercase tracking-widest",
                is_solo === false 
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/40 scale-[1.02]" 
                  : "text-slate-500 dark:text-slate-400 hover:text-purple-600 hover:bg-white dark:hover:bg-slate-800"
              )}
            >
              <Users size={16} /> Team
            </button>
          </div>

          {/* Project Name */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-[0.2em] ml-1">
              Project Identification <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <Folder className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Asset Name..."
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:border-blue-500 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold placeholder:text-slate-400 dark:placeholder:text-slate-700"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-[0.2em] ml-1">Cover Art</label>
            {!imagePreview ? (
              <label className="h-28 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-slate-50 dark:bg-[#020617]/50 hover:bg-white dark:hover:bg-[#020617] transition-all group overflow-hidden">
                <Upload className="text-slate-400 dark:text-slate-700 group-hover:text-blue-600 mb-1 transition-colors" size={20} />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Select Media Asset</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            ) : (
              <div className="relative h-32 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 group">
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <button type="button" onClick={removeImage} className="bg-white text-red-600 p-2 rounded-full hover:scale-110 transition-transform">
                     <X size={16} />
                   </button>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-[0.2em] ml-1">
              Documentation <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Primary objectives..."
              className="w-full h-28 p-4 rounded-2xl bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:border-blue-500 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none font-bold text-sm placeholder:text-slate-400 dark:placeholder:text-slate-700"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className={cn(
              "w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.97] shadow-xl",
              isPending
                ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                : is_solo === false 
                  ? "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25" 
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25"
            )}
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Synchronizing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Deploy {is_solo === false ? 'Team' : 'Solo'} Project</span>
                <ArrowRight size={18} />
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}