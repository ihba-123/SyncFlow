import { useState } from "react";
import { User, Users, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@mui/material";
import { cn } from "../../utils/utils";

export function CreateProject() {
  const [projectType, setProjectType] = useState("solo");
  const [description, setDescription] = useState("");

  return (
    <div className="min-h-screen  flex items-center justify-center px-4 py-3 transition-colors duration-500">
      <div className="w-full max-w-2xl">
        <form className=" dark:bg-slate-900/40 backdrop-blur-xl  dark:border-slate-700/30 rounded-sm shadow-2xl p-8 flex flex-col gap-8 ring-1 ring-white/30 dark:ring-slate-900/50">
          <div className="px-2 -mt-5 pt-5 pb-6 border-b border-slate-200 dark:border-slate-700">
            <nav className="flex items-center  gap-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
              <span>Projects</span> 
              <ChevronRight size={16} />
              <span className="font-medium text-slate-900 dark:text-slate-100">
                New Project
              </span>
            </nav>

            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Create New Project
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Organize your tasks and collaborate with ease. Start by filling in
              the details below.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-800 dark:text-slate-200 text-sm font-semibold flex items-center gap-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full h-12 px-4 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-slate-600/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 transition-all outline-none"
              placeholder="Enter project name"
              required
            />
          </div>

          {/* Project Type Selector */}
          <div className="flex flex-col gap-3">
            <label className="text-slate-800 dark:text-slate-200 text-sm font-semibold">
              Project Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option: Solo */}
              <div
                onClick={() => setProjectType("solo")}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all bg-white/40 dark:bg-slate-800/40 backdrop-blur-md",
                  projectType === "solo"
                    ? "border-blue-500/70 dark:border-blue-400/80 ring-2 ring-blue-500/30 dark:ring-blue-400/40 shadow-lg shadow-blue-500/10 dark:shadow-blue-400/20"
                    : "border-white/40 dark:border-slate-600/50 hover:border-blue-400/50 dark:hover:border-blue-400/60 hover:bg-white/60 dark:hover:bg-slate-700/50"
                )}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100/80 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <User size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Solo Project
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    For personal tasks
                  </span>
                </div>
                {projectType === "solo" && (
                  <CheckCircle2
                    className="ml-auto text-blue-600 dark:text-blue-400"
                    size={20}
                  />
                )}
              </div>

              
              <div
                onClick={() => setProjectType("team")}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all bg-white/40 dark:bg-slate-800/40 backdrop-blur-md",
                  projectType === "team"
                    ? "border-purple-500/70 dark:border-purple-400/80 ring-2 ring-purple-500/30 dark:ring-purple-400/40 shadow-lg shadow-purple-500/10 dark:shadow-purple-400/20"
                    : "border-white/40 dark:border-slate-600/50 hover:border-purple-400/50 dark:hover:border-purple-400/60 hover:bg-white/60 dark:hover:bg-slate-700/50"
                )}
              >
                <div className="w-10 h-10 rounded-full bg-purple-100/80 dark:bg-purple-900/60 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                  <Users size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Team Project
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Collaborate with others
                  </span>
                </div>
                {projectType === "team" && (
                  <CheckCircle2
                    className="ml-auto text-purple-600 dark:text-purple-400"
                    size={20}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Description Input */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-800 dark:text-slate-200 text-sm font-semibold">
              Description{" "}
              
            </label>
            <textarea
              className="w-full min-h-[140px] px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/40 dark:border-slate-600/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/30 transition-all outline-none resize-none"
              placeholder="Describe your project goals, milestones, and scope..."
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="text-xs text-slate-600 dark:text-slate-400 text-right">
              {description.length}/500 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/30 dark:border-slate-700/50">
            <button
              type="button"
              className="px-6 h-12 rounded-sm text-slate-700 dark:text-slate-300 font-semibold bg-white/40 dark:bg-slate-800/50 backdrop-blur hover:bg-white/60 dark:hover:bg-slate-700/60 transition-all text-sm"
            >
              Cancel
            </button>
            <Button
            variant="contained"
              type="submit"
              className="px-8 h-12  bg-blue-600/90 hover:bg-blue-600 dark:bg-blue-500/90 dark:hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 dark:shadow-blue-500/40 backdrop-blur transition-all active:scale-95 text-sm"
            >
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
