import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setActiveProjects } from "../api/active_project";
import { useActiveProjectStore } from "../stores/ActiveProject";

export const useSetActiveProject = () => {
  const queryClient = useQueryClient();
  const setActiveProject = useActiveProjectStore(
    (state) => state.setActiveProject
  );
  const reset = useActiveProjectStore((state) => state.reset);

  return useMutation({
    mutationFn: setActiveProjects,

    onSuccess: (data) => {
      const project = data?.active_project || null;

      // Update cache
      queryClient.setQueryData(["activeProject"], {
        active_project: project,
      });

      // Sync Zustand properly
      if (project) {
        setActiveProject(project);
      } else {
        reset();
      }
    },
  });
};