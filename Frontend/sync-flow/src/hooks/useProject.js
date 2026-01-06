import { useProjectStore } from "../stores/ProjectType";
import { useMutation } from "@tanstack/react-query";
import { createProject } from "../api/Project";

export const useProject = () => {
  const setProject = useProjectStore((state) => state.setProject);
  const clearProject = useProjectStore((state) => state.clearProject);
  const project = useProjectStore((state) => state.project);
  const is_solo = useProjectStore((state) => state.is_solo);

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      setProject(data); 
    },
    onError: (err) => {
      console.log(err);
      clearProject();
    },
  });

  return { mutate: mutation.mutate, isLoading: mutation.isLoading, project, is_solo };
};
