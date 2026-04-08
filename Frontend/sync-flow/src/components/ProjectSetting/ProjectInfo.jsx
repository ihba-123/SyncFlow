import { ShieldAlert } from "lucide-react";
import React from "react";

const ProjectInfo = ({ project }) => {
  return (
    <div>
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Project Info
        </h2>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Type</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {project.is_solo ? "Solo" : "Team"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Created</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {new Date(project.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">
              Last Updated
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {new Date(project.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <ShieldAlert className="h-4 w-4" />
          
        </h2>
        <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
          Leaving this page with unsaved changes will ask for confirmation.
        </p>
      </div>
    </div>
  );
};

export default ProjectInfo;
