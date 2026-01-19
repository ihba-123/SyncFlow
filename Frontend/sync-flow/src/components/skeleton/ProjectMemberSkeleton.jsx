import React from "react";

export const TeamViewSkeleton = ({ membersLength = 3, invitesLength = 2 }) => {
  // membersLength and invitesLength can be dynamic
  const memberSkeletons = Array.from({ length: membersLength });
  const inviteSkeletons = Array.from({ length: invitesLength });

  return (
    <div className="min-h-screen -mt-5 bg-slate-50 text-slate-900 dark:bg-[#0a0c14] dark:text-slate-100">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Skeleton */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-10 w-64 bg-slate-300 dark:bg-white/10 rounded-lg animate-pulse"></div>
          <div className="h-10 w-36 bg-slate-300 dark:bg-white/10 rounded-lg animate-pulse"></div>
        </div>

        {/* Members Skeleton */}
        <div className="mb-14">
          <div className="h-6 w-48 bg-slate-300 dark:bg-white/20 rounded-md mb-4 animate-pulse"></div>
          <div className="space-y-4">
            {memberSkeletons.map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5
                  rounded-2xl bg-white border border-slate-200
                  dark:bg-white/[0.03] dark:border-white/5
                  p-4 sm:p-5 animate-pulse"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 bg-slate-300 dark:bg-white/10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-300 dark:bg-white/10 rounded w-32"></div>
                    <div className="h-3 bg-slate-200 dark:bg-white/20 rounded w-24"></div>
                  </div>
                </div>
                <div className="flex sm:ml-auto items-center justify-between gap-4 w-full sm:w-auto">
                  <div className="space-y-1 text-right">
                    <div className="h-3 w-16 bg-slate-300 dark:bg-white/10 rounded"></div>
                    <div className="h-4 w-20 bg-slate-300 dark:bg-white/10 rounded"></div>
                  </div>
                  <div className="h-8 w-8 bg-slate-300 dark:bg-white/10 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invites Skeleton */}
        <div>
          <div className="h-6 w-48 bg-slate-300 dark:bg-white/20 rounded-md mb-4 animate-pulse"></div>
          <div className="space-y-4">
            {inviteSkeletons.map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row md:items-center md:justify-between
                  gap-4 rounded-2xl bg-white border border-slate-200
                  dark:bg-white/[0.04] dark:border-white/6 p-4 sm:p-6 animate-pulse"
              >
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 w-48 bg-slate-300 dark:bg-white/10 rounded"></div>
                  <div className="h-3 w-32 bg-slate-200 dark:bg-white/20 rounded"></div>
                  <div className="flex gap-2 mt-2">
                    <div className="h-3 w-20 bg-slate-200 dark:bg-white/20 rounded"></div>
                    <div className="h-3 w-20 bg-slate-200 dark:bg-white/20 rounded"></div>
                  </div>
                </div>
                <div className="flex gap-3 mt-2 md:mt-0">
                  <div className="h-8 w-32 bg-slate-200 dark:bg-white/10 rounded"></div>
                  <div className="h-8 w-8 bg-slate-200 dark:bg-white/10 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamViewSkeleton;
