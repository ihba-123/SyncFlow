import React, { useState, useEffect, useRef } from "react";
import { User, Users2, Plus, Calendar, Image as ImageIcon, ArrowRight } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { projectList } from "../../api/Project";
import { useProjectStore } from "../../stores/ProjectType";
import ProjectSkeleton from "../../components/skeleton/ProjectSkeleton"; // Path to the file above
import { SoloProject } from "../../features/project/SoloProject";
import { TeamProject } from "../../features/project/TeamProject";

const Project = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem("projectViewMode") || "solo");
  const { setIsSolo } = useProjectStore();

  const { data: projects, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["projects"], 
    queryFn: ({ pageParam = 1 }) => projectList(pageParam),
    getNextPageParam: (lastPage) => {
      if (!lastPage.data.next) return undefined;
      return new URL(lastPage.data.next).searchParams.get("page");
    },
    select: (data) => data.pages.flatMap((page) => page.data.results),
    staleTime: 5 * 60 * 1000,
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
      (entries) => { if (entries[0].isIntersecting && hasNextPage) fetchNextPage(); },
      { threshold: 1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadMoreRef.current, hasNextPage, fetchNextPage]);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans transition-colors duration-500 overflow-x-hidden">
      
      {isModalOpen && viewMode === "solo" && <SoloProject onClose={() => setIsModalOpen(false)}  /> }
      {isModalOpen && viewMode === "team" && <TeamProject onClose={() => setIsModalOpen(false)} /> }

      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[100px] opacity-20 transition-colors duration-1000 ${viewMode === 'solo' ? 'bg-blue-400' : 'bg-purple-400'}`} />
      </div>

      <main className="relative z-10 mx-auto max-w-5xl px-5 py-8 md:py-16">
        <header className="flex flex-col gap-6 -mt-7 mb-10">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase">
              {viewMode === "solo" ? "Personal Projects" : "Team Workspace"}
            </h1> 
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">Status: Operational</p>
          </div>

          <div className="w-full sm:w-[320px] p-1.5 bg-slate-200/50 dark:bg-white/5 backdrop-blur-xl border border-slate-300 dark:border-white/10 rounded-2xl flex">
            <button onClick={() => setViewMode("solo")} className={`cursor-pointer flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-black transition-all ${viewMode === "solo" ? "bg-white dark:bg-blue-600 shadow-blue-500/20 text-blue-600 dark:text-white shadow-md ring-1 ring-slate-200 dark:ring-blue-400/50" : "text-slate-500 dark:text-slate-400"}`}>
              <User size={14} /><span>SOLO</span>
            </button>
            <button onClick={() => setViewMode("team")} className={`flex-1 cursor-pointer  flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-black transition-all ${viewMode === "team" ? "bg-white dark:bg-purple-700 text-blue-600  dark:text-white shadow-md ring-1 ring-slate-200 dark:ring-purple-400/50 shadow-purple-400/20 " : "text-slate-500 dark:text-slate-400"}`}>
              <Users2 size={14} /><span>TEAM</span>
            </button>
          </div>
        </header> 

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {status !== "loading" && (
            <AddCard onClick={() => setIsModalOpen(true)} label={viewMode === "solo" ? "NEW_PERSONAL" : "NEW_COLLAB"} />
          )}      


          {status === "loading" ? (
             <ProjectSkeleton count={6} />
          ) : (
            <>
              {(viewMode === "solo" ? soloProjects : teamProjects).map((project) => (
                <GlassCard key={project.id} project={project} />
              ))}
              
             
              {isFetchingNextPage && <ProjectSkeleton count={3} />}
            </>
          )}
        </div>
        
        <div ref={loadMoreRef} className="h-20" />
      </main>
    </div>
  );
};

const GlassCard = ({ project }) => (
  <div className="group bg-white/90 dark:bg-white/[0.03] backdrop-blur-lg border border-black/30 dark:border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col h-[350px]">
    <div className="relative w-full h-[175px] bg-slate-100 dark:bg-slate-900 border-b border-slate-100 dark:border-white/5 flex items-center justify-center overflow-hidden">
      {project.image ? (
        <img 
          src={project.image} 
          alt={project.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
      ) : (
        <ImageIcon size={32} className="text-slate-300 dark:text-slate-700" />
      )}
      <div className="absolute top-3 left-3">
        <span className="px-2 py-1 rounded-lg bg-white/90 dark:bg-blue-600/20 text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest border border-slate-100 dark:border-blue-500/30">
          {project.is_solo ? 'INDIVIDUAL' : 'NETWORK'}
        </span>
      </div>
    </div>
    <div className="p-5 flex flex-col flex-1">
      <div className="flex items-center gap-1.5 mb-2 text-slate-400">
        <Calendar size={12} className="text-blue-500" />
        <span className="text-[10px] font-bold uppercase tracking-tighter">{new Date(project.created_at).toLocaleDateString()}</span>
      </div>
      <h3 className="text-md font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">{project.name || "UNNAMED_ASSET"}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed line-clamp-2 mt-1.5 mb-5 min-h-[2.5rem]">{project.description || "No project metadata available."}</p>
      <div className="mt-auto pt-4 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest group-hover:underline cursor-pointer">Launch Unit</span>
        <ArrowRight size={16} className="text-black/70 dark:text-slate-400 group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
      </div>
    </div>
  </div>
);

const AddCard = ({ label, onClick }) => (
  <div onClick={onClick} className="group border-2 border-dashed border-black/40 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 min-h-[350px] bg-white/30 dark:bg-transparent hover:border-blue-500 hover:bg-white dark:hover:bg-blue-500/5 transition-all cursor-pointer">
    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
      <Plus size={24} />
    </div>
    <span className="font-black text-[10px] text-slate-400 tracking-[0.2em] uppercase group-hover:text-blue-600">{label}</span>
  </div>
);

export default Project;