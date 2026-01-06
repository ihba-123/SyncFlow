import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Users2,
  Plus,
  Calendar,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { projectList } from "../../api/Project";
import { useProjectStore } from "../../stores/ProjectType";
import ProjectSkeleton from "../../components/skeleton/ProjectSkeleton";

const Project = () => {
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem("projectViewMode") || "solo"
  );
  const { setIsSolo } = useProjectStore();

  const {
    data: projects,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: ({ pageParam = 1 }) => projectList(pageParam),
    getNextPageParam: (lastPage) => {
      if (!lastPage.data.next) return undefined;
      return new URL(lastPage.data.next).searchParams.get("page");
    },
    select: (data) => data.pages.flatMap((page) => page.data.results),
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  useEffect(() => {
    setIsSolo(viewMode === "solo");
    localStorage.setItem("projectViewMode", viewMode);
  }, [viewMode, setIsSolo]);

  const soloProjects = projects?.filter((p) => p.is_solo) || [];
  const teamProjects = projects?.filter((p) => !p.is_solo) || [];

  const loadMoreRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      },
      { threshold: 1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadMoreRef.current, hasNextPage, fetchNextPage]);

  // --- SKELETON TRIGGER ---
  // This shows the skeleton only during the initial fetch
  if (status === "loading") {
    return <ProjectSkeleton />;
  }

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans transition-colors duration-500 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[100px] opacity-20 transition-colors duration-1000 ${viewMode === 'solo' ? 'bg-blue-400' : 'bg-emerald-400'}`} />
      </div>

      <main className="relative z-10 mx-auto max-w-5xl px-5 py-8 md:py-16">
        <header className="flex flex-col gap-6 -mt-7 mb-10 ">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              {viewMode === "solo" ? "Personal Projects" : "Team Workspace"}
            </h1> 
            <p className="text-xs text-slate-500 dark:text-blue-300/40 font-bold uppercase tracking-tighter mt-1">Status: Operational</p>
          </div>

          <div className="w-full sm:w-[320px] p-1.5 bg-slate-200/50 dark:bg-white/5 backdrop-blur-xl border border-slate-300 dark:border-white/10 rounded-2xl shadow-[inset_0_1px_4px_rgba(0,0,0,0.05)] flex">
            <button
              onClick={() => setViewMode("solo")}
              className={`flex-1 flex items-center justify-center cursor-pointer space-x-2 py-2.5 rounded-xl text-xs font-black transition-all duration-300
                  ${viewMode === "solo" 
                    ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-md ring-1 ring-slate-200 dark:ring-blue-400/50 scale-[1.02]" 
                    : "text-slate-500 dark:text-slate-400"}`}
            >
              <User size={14} />
              <span>SOLO</span>
            </button>
            <button
              onClick={() => setViewMode("team")}
              className={`flex-1 flex items-center justify-center cursor-pointer space-x-2 py-2.5 rounded-xl text-xs font-black transition-all duration-300
                  ${viewMode === "team" 
                    ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-md ring-1 ring-slate-200 dark:ring-blue-400/50 scale-[1.02]" 
                    : "text-slate-500 dark:text-slate-400"}`}
            >
              <Users2 size={14} />
              <span>TEAM</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AddCard label={viewMode === "solo" ? "NEW_PERSONAL" : "NEW_COLLAB"} />
          
          {(viewMode === "solo" ? soloProjects : teamProjects).map((project) => (
            <GlassCard key={project.id} project={project} />
          ))}

          {/* Optional: Show small skeletons at the bottom while loading more pages */}
          {isFetchingNextPage && (
             <div className="h-40 w-full bg-blue-100/20 dark:bg-white/5 animate-pulse rounded-xl" />
          )}
        </div>

        <div ref={loadMoreRef} className="h-20" />
      </main>
    </div>
  );
};

// ... GlassCard and AddCard components remain the same

const GlassCard = ({ project }) => (
  <div className="group  bg-white/80 dark:bg-white/[0.03] backdrop-blur-lg border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-500/40">
    {/* Medium Fixed Height Image Container */}
    <div className="relative w-full h-52 bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-white/5">
      {project.image ? (
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-800">
          <ImageIcon size={28} strokeWidth={1.5} />
        </div>
      )}
      <div className="absolute top-2 right-2">
        <span className="px-2 py-0.5 rounded-md bg-white dark:bg-blue-600/20 text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest border border-slate-100 dark:border-blue-500/30">
          {project.is_solo ? 'SOLO' : 'TEAM'}
        </span>
      </div>
    </div>

    <div className="p-4 flex flex-col">
      <div className="flex items-center gap-1.5 mb-1.5 opacity-50">
        <Calendar size={10} />
        <span className="text-[9px] font-bold uppercase tracking-tighter">
          {new Date(project.created_at).toLocaleDateString()}
        </span>
      </div>
      
      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
        {project.name || "UNNAMED_PROJECT"}
      </h3>
      
      <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-snug line-clamp-2 mt-1.5 mb-4 min-h-[2rem]">
        {project.description || "Project metadata encrypted or unavailable."}
      </p>

      <div className="mt-auto pt-3 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest group-hover:underline">
          Access Unit
        </span>
        <ArrowRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </div>
);

const AddCard = ({ label }) => (
  <div className="group border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl flex flex-col items-center justify-center p-6 min-h-[220px] bg-white/30 dark:bg-transparent hover:bg-white dark:hover:bg-blue-600/5 hover:border-blue-500/50 transition-all cursor-pointer">
    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-3 text-slate-400 group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-all duration-300">
      <Plus size={20} />
    </div>
    <span className="font-bold text-[11px] text-slate-400 dark:text-slate-500 tracking-widest group-hover:text-slate-900 dark:group-hover:text-white">
      {label}
    </span>
  </div>
);

export default Project;