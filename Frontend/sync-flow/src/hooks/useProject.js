import { useProjectStore } from "../stores/ProjectType";
import { useActiveProjectStore } from "../stores/ActiveProject";
import { useMutation } from "@tanstack/react-query";
import { createProject } from "../api/Project";

export const useProject = () => {
  const setProject = useProjectStore((state) => state.setProject);
  const clearProject = useProjectStore((state) => state.clearProject);
  const setActiveProject = useActiveProjectStore((state) => state.setActiveProject);
  const project = useProjectStore((state) => state.project);
  const is_solo = useProjectStore((state) => state.is_solo);

    
  const setProjectMeta = (projectData) => {
    setProject(projectData); 
  };

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      setProject(data); 
      const activeProject = data?.active_project || null;
      if (activeProject) {
        setActiveProject({
          id: activeProject.id ?? data?.project_id,
          name: activeProject.name ?? data?.project_name ?? "",
          description: data?.description ?? "",
          image: data?.image ?? "",
          is_solo: data?.is_solo ?? activeProject.is_solo ?? null,
        });
      }
    },
    onError: (err) => {
      clearProject();
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isLoading: mutation.isPending,
    project,
    is_solo,
    setProjectMeta,
  };
};
