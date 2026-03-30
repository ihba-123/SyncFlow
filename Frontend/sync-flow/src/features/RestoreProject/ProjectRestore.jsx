import React, { useState, useEffect } from 'react';
import { RotateCcw, Trash2, LayoutGrid, Calendar, Clock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { archivedProjects, deleteProject, restoreProject } from '../../api/Project';
import { toast } from 'react-toastify';
import { useActiveProjectStore } from '../../stores/ActiveProject';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProjectRestore() {
  const [restoring, setRestoring] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const {project_id} = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const resetActiveProject = useActiveProjectStore((state) => state.reset);

  // --- WEBSOCKET FOR REAL-TIME ARCHIVE UPDATES ---
useEffect(() => {
  if (!project_id) return;

  const socket = new WebSocket(`ws://localhost:8000/ws/projects/${project_id}/`);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.action === "project_archived") {
      toast.warning("This project was moved to trash by an admin.");
      
      // 1. Remove from React Query cache so it disappears from sidebar
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      // 2. Redirect the user out of the project view
      navigate("/dashboard", { replace: true });
    }
  };

  return () => socket.close();
}, [project_id, navigate, queryClient]);
  // --- DATA FETCHING ---
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['archivedProjects'],
    queryFn: archivedProjects,
  });

  // --- MUTATIONS ---
  const restoreMutation = useMutation({
    mutationFn: restoreProject,
    onSuccess: (_, projectId) => {
      // Optimistic UI update
      queryClient.setQueryData(['archivedProjects'], (old) =>
        old ? old.filter((p) => p.id !== projectId) : []
      );
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setRestoring(null);
      toast.success('Project restored to workspace');
    },
    onError: () => {
      setRestoring(null);
      toast.error('Failed to restore project');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProject(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['archivedProjects'], (old) =>
        old ? old.filter((p) => p.id !== deletedId) : []
      );
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      resetActiveProject();
      setDeleting(null);
      toast.success('Project purged permanently');
    },
    onError: () => {
      setDeleting(null);
      toast.error('Failed to delete project');
    },
  });

  // --- HANDLERS ---
  const handleRestore = (id) => {
    setRestoring(id);
    restoreMutation.mutate(id);
  };

  const onConfirmDelete = (id) => {
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      setDeleting(id);
      deleteMutation.mutate(id);
    }
  };

  // --- VIEW STATES ---
  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="relative h-12 w-12">
          <div className="absolute h-full w-full rounded-full border-4 border-blue-500/20"></div>
          <div className="absolute h-full w-full animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-500">
        <div className="mb-6 rounded-full bg-gray-100 p-6 dark:bg-gray-800/50">
          <LayoutGrid size={48} className="text-gray-400 dark:text-gray-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">The Vault is Empty</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">No archived projects found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 transition-colors duration-500 dark:bg-[#020617] md:p-12">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <header className="relative mb-12 max-w-3xl">
        <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-black tracking-tight text-transparent dark:from-white dark:to-gray-400 md:text-5xl">
          Project Archive
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Review and recover projects. Items here are kept for <span className="font-semibold text-blue-500">30 days</span>.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => {
          const retentionDays = Math.max(0, 30 - Math.floor(
            (new Date() - new Date(project.updated_at)) / (1000 * 60 * 60 * 24)
          ));

          const isActionable = restoring === project.id || deleting === project.id;

          return (
            <div
              key={project.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 hover:shadow-2xl hover:shadow-blue-500/10 dark:border-white/10 dark:bg-gray-900/40 dark:backdrop-blur-xl ${
                isActionable ? 'scale-95 opacity-50 grayscale' : ''
              }`}
            >
              {/* Image Container */}
              <div className="relative h-48 w-full overflow-hidden">
                {project.image ? (
                  <img src={project.image} alt={project.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <span className="text-5xl font-black text-gray-300 dark:text-gray-700">{project.name.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md ${
                    retentionDays <= 7 ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  } border`}>
                    {retentionDays} Days Left
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4">
                  <h2 className="line-clamp-1 text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {project.name}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                    {project.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-auto space-y-3">
                  <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-4 dark:border-white/5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar size={14} className="text-blue-500" />
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock size={14} className="text-purple-500" />
                      Archived {new Date(project.updated_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleRestore(project.id)}
                      disabled={isActionable}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-gray-800 active:scale-95 dark:bg-white dark:text-black disabled:opacity-50"
                    >
                      <RotateCcw size={16} className={restoring === project.id ? 'animate-spin' : ''} />
                      {restoring === project.id ? 'Restoring...' : 'Restore'}
                    </button>
                    
                    <button
                      onClick={() => onConfirmDelete(project.id)}
                      disabled={isActionable}
                      className="flex aspect-square px-3 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-all hover:bg-red-600 hover:text-white active:scale-95 dark:bg-red-500/10 dark:text-red-400 disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}