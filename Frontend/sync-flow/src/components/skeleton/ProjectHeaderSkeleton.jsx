import React from "react";

export function ProjectHeaderSkeleton() {
  return (
    <div className="mb-6 sm:mb-8 animate-pulse">
      <div className="relative px-2 sm:px-4 md:px-8 pb-4 sm:pb-6 mt-4">
        {/* Main Skeleton Card */}
        <div className="bg-slate-100/50 dark:bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-white/10 shadow-sm">
          
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            
            {/* 1. Image Skeleton */}
            <div className="shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl bg-slate-200 dark:bg-white/10" />
            </div>

            {/* 2. Content Skeleton */}
            <div className="flex-1 w-full">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                
                {/* Title & Description Lines */}
                <div className="flex flex-col items-center md:items-start flex-1 space-y-3">
                  <div className="h-8 w-3/4 sm:w-1/2 bg-slate-200 dark:bg-white/10 rounded-lg" />
                  <div className="h-4 w-full bg-slate-200 dark:bg-white/5 rounded-md" />
                  <div className="h-4 w-5/6 bg-slate-200 dark:bg-white/5 rounded-md" />
                </div>

                {/* Button Skeleton */}
                <div className="h-10 w-40 bg-slate-300 dark:bg-white/20 rounded-xl" />
              </div>

              {/* Bottom Row Skeleton */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-5 border-t border-slate-200 dark:border-white/5">
                
                {/* Avatar Stack Skeleton */}
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="h-9 w-9 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-white/10" 
                    />
                  ))}
                </div>

                {/* Date Skeleton */}
                <div className="h-4 w-32 bg-slate-200 dark:bg-white/5 rounded-md" />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}