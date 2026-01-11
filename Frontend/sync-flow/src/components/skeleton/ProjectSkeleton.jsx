import React from "react";

const SkeletonCard = () => (
  <div className="bg-white/90 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col h-[350px] animate-pulse">
    {/* Image Area Skeleton */}
    <div className="w-full h-[175px] bg-slate-200 dark:bg-slate-800 relative">
      <div className="absolute top-3 left-3 w-16 h-4 bg-slate-300 dark:bg-slate-700 rounded-lg" />
    </div>

    {/* Content Area Skeleton */}
    <div className="p-5 flex flex-col flex-1">
      <div className="flex items-center gap-1.5 mb-3">
        <div className="w-3 h-3 bg-blue-200 dark:bg-blue-900/30 rounded-full" />
        <div className="w-24 h-2.5 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>

      <div className="w-3/4 h-5 bg-slate-300 dark:bg-slate-700 rounded mb-4" />

      <div className="space-y-2 mb-6">
        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="w-2/3 h-2.5 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
        <div className="w-20 h-2.5 bg-blue-200 dark:bg-blue-900/30 rounded" />
        <div className="w-4 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
    </div>
  </div>
);

const ProjectSkeleton = ({ count = 3 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={`skeleton-${i}`} />
      ))}
    </>
  );
};

export default ProjectSkeleton;import { Calendar, ArrowRight, ImageIcon, Plus, User, Users } from "lucide-react";