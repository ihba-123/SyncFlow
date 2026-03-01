'use client';

import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Trash2, Calendar, Clock, LayoutGrid, Archive } from 'lucide-react';

const mockProjects = [
  { id: '1', name: 'Analytics Dashboard', description: 'Real-time analytics and reporting platform with deep data visualization.', deletedDate: '2024-02-15', retentionDays: 30 },
  { id: '2', name: 'Mobile App Backend', description: 'Node.js REST API for cross-platform iOS and Android applications.', deletedDate: '2024-02-10', retentionDays: 20 },
  { id: '3', name: 'E-Commerce Platform', description: 'Full-stack solution with Stripe payment integration and inventory management.', deletedDate: '2024-02-08', retentionDays: 5 },
  { id: '4', name: 'Legacy Migration', description: 'Data migration utility for converting legacy SQL systems to NoSQL.', deletedDate: '2024-01-28', retentionDays: 2 },
];

export default function ProjectRestore() {
  const [projects, setProjects] = useState(mockProjects);
  const [restoring, setRestoring] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const handleAction = (id, type) => {
    type === 'restore' ? setRestoring(id) : setDeleting(id);
    setTimeout(() => {
      setProjects(projects.filter((p) => p.id !== id));
      setRestoring(null);
      setDeleting(null);
    }, 600);
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 dark:text-slate-100
      bg-[#f8fafc] dark:bg-[#020617]
      dark:bg-[radial-gradient(at_top_right,_rgba(99,102,241,0.08),_transparent),radial-gradient(at_bottom_left,_rgba(168,85,247,0.08),_transparent)]">

      <main className="max-w-7xl  mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20">

      
        <header className="mb-12 md:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6">

          <div className="space-y-4 -pb-16 max-w-2xl">

            <h1 className="font-black tracking-tight leading-tight
              text-[clamp(1.8rem,5vw,3.5rem)]">
              Project Archive.
            </h1>

            <p className="text-slate-500 dark:text-slate-400 
              text-[clamp(0.9rem,2vw,1.1rem)] 
              leading-relaxed">
              Recover deleted projects within 30 days or purge them permanently.
            </p>
          </div>

        </header>

        {/* Empty State */}
        {projects.length === 0 ? (
          <div className="py-16 md:py-24 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center bg-white/30 dark:bg-white/[0.01]">
            <LayoutGrid className="text-slate-300 dark:text-slate-800 mb-4" size={48} />
            <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">
              Vault is empty
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`group relative overflow-hidden transition-all duration-500
                ${restoring === project.id || deleting === project.id ? 'opacity-0 scale-95 -translate-y-4' : ''}
                bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl
                border border-white/40 dark:border-white/[0.08]
                rounded-3xl p-4 sm:p-6 md:p-8
                shadow-lg hover:-translate-y-1`}
              >

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl 
                      bg-gradient-to-br from-slate-100 to-slate-200 
                      dark:from-white/5 dark:to-white/[0.01]
                      flex items-center justify-center shadow-inner">
                      <span className="text-xl sm:text-2xl font-black text-slate-400 dark:text-slate-600">
                        {project.name.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">

                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-bold tracking-tight 
                        text-[clamp(1rem,2.5vw,1.3rem)]">
                        {project.name}
                      </h3>

                      <div className={`text-[10px] sm:text-xs font-black uppercase px-2 py-1 rounded-full border
                        ${project.retentionDays <= 7
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                        {project.retentionDays} Days Remaining
                      </div>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400
                      text-[clamp(0.85rem,2vw,0.95rem)]
                      leading-relaxed break-words">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-indigo-500" />
                        {new Date(project.deletedDate).toLocaleDateString()}
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-indigo-500" />
                        Auto Purge Active
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-row sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">

                    <button
                      onClick={() => handleAction(project.id, 'restore')}
                      disabled={restoring || deleting}
                      className="flex-1 lg:flex-none  cursor-pointer px-6 py-3 rounded-xl
                      bg-slate-900 dark:bg-white text-white dark:text-slate-900
                      text-sm font-bold transition-all active:scale-95">
                      <div className="flex items-center justify-center gap-2">
                        <RotateCcw size={16} />
                        Restore
                      </div>
                    </button>

                    <button
                      onClick={() => handleAction(project.id, 'delete')}
                      disabled={restoring || deleting}
                      className="p-3 rounded-xl bg-slate-100  cursor-pointer dark:bg-white/5
                      text-red-400 hover:text-rose-500 flex justify-center items-center gap-2 transition-all active:scale-95">
                      <Trash2 size={18} />
                        <span className=" text-rose-500">Delete</span>
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}