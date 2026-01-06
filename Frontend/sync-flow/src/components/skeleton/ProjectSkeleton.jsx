import React from "react";

const ProjectSkeleton = () => {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#020617] overflow-hidden">
      {/* Background Decorative Orb */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-5 bg-blue-500" />
      </div>

      <main className="relative z-10 mx-auto max-w-5xl px-5 py-10 md:py-14 animate-pulse">
        
        {/* Header Skeleton */}
        <header className="flex flex-col gap-8 mb-12">
          <div className="space-y-3">
            {/* Title Skeleton - Modern Blue Tint in Light Mode */}
            <div className="h-10 w-64 bg-blue-100/50 dark:bg-white/10 rounded-xl border border-blue-200/20" />
          </div>

          {/* Realistic Toggle Skeleton */}
          <div className="w-full sm:w-[350px] h-[64px] p-1.5 bg-blue-100/30 dark:bg-white/5 border border-blue-200/50 dark:border-white/10 rounded-2xl flex gap-2 shadow-inner">
            <div className="flex-1 bg-white dark:bg-white/10 rounded-xl shadow-sm" />
            <div className="flex-1 bg-white/40 dark:bg-white/5 rounded-xl" />
          </div>
        </header>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className="bg-white/80 dark:bg-white/[0.02] border border-blue-100 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col h-full shadow-sm shadow-blue-500/5"
            >
              {/* Photo Container Skeleton (h-48) - Deep Blue-Slate Tint */}
              <div className="w-full h-48 bg-blue-50 dark:bg-slate-900/50 relative overflow-hidden">
                {/* Shimmer Effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/20 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                
                {/* Badge Skeleton */}
                <div className="absolute top-3 left-3 h-6 w-20 bg-blue-100 dark:bg-white/10 rounded-lg border border-blue-200/30 dark:border-white/5" />
              </div>

              {/* Content Skeleton */}
              <div className="p-6 flex flex-col flex-1 space-y-4">
                {/* Date Skeleton */}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-200 dark:bg-white/10" />
                  <div className="h-3 w-24 bg-blue-100 dark:bg-white/10 rounded" />
                </div>

                {/* Title Skeleton */}
                <div className="h-5 w-3/4 bg-blue-200/40 dark:bg-white/20 rounded-md" />

                {/* Description Skeleton */}
                <div className="space-y-2">
                  <div className="h-3 w-full bg-blue-100/60 dark:bg-white/10 rounded" />
                  <div className="h-3 w-5/6 bg-blue-100/60 dark:bg-white/10 rounded" />
                </div>

                {/* Footer Skeleton */}
                <div className="mt-auto pt-5 border-t border-blue-50 dark:border-white/5 flex items-center justify-between">
                  <div className="h-3 w-28 bg-blue-100 dark:bg-white/10 rounded" />
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-white/10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ProjectSkeleton;