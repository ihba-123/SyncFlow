import { useState, useEffect } from "react";
import { User, ChevronRight, Upload, X } from "lucide-react";
import { Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query"; 
import ProgressBar from "../../components/ui/ProgressBar";
import { toast } from "react-toastify";
import { useProject } from "../../hooks/useProject";

export function SoloProject({ onClose }) {
  const queryClient = useQueryClient();
  const [is_solo] = useState(true);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { mutate, isLoading } = useProject();

  // Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleProject = () => {
    if (!name.trim() || !description.trim()) {
      toast.error("Required fields are missing");
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
        toast.success("Solo project created successfully");
        onClose();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Sync failed");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-xl max-h-[85vh] flex flex-col bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        <ProgressBar apiLoading={isLoading} className="absolute top-0 left-0 w-full z-50" />
        
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
          <div>
            <nav className="flex items-center gap-2 text-[10px] uppercase font-bold text-blue-500 mb-1">
              <span>System</span>
              <ChevronRight size={10} />
              <span>New Entry</span>
            </nav>
            <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase">Initialize Solo Project</h1>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Asset Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-400 dark:border-slate-700 text-sm outline-none focus:border-blue-500 transition-all"
              placeholder="Enter name..."
            />
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
            <User size={16} className="text-blue-500" />
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">Private  workspace</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Visual Data</label>
            {!imagePreview ? (
              <label htmlFor="project-image-input" className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-500 dark:border-slate-800 rounded-2xl cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all">
                <Upload size={20} className="text-slate-400 mb-1" />
                <span className="text-[10px] font-bold text-slate-500">UPLOAD_IMG</span>
                <input id="project-image-input" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            ) : (
              <div className="relative h-32 bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-2" />
                <button onClick={() => {setImage(null); setImagePreview(null);}} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-md">
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Description</label>
            <textarea
              className="w-full min-h-[90px] p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-400 dark:border-slate-700 text-sm outline-none focus:border-blue-500 resize-none"
              placeholder="Asset objective..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 h-10 rounded-xl text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase">Abort</button>
          <Button onClick={handleProject} variant="contained" disabled={isLoading} className="px-6 h-10 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] rounded-xl">
            {isLoading ? "SYNCING..." : "CREATE_ASSET"}
          </Button>
        </div>
      </div>
    </div>
  );
}