import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useActiveProjectStore } from "../stores/ActiveProject";
import { fetchActiveProject } from "../api/active_project";

export const useActiveProject = () => {
  const setFromProjectStatus = useActiveProjectStore((state) => state.setFromProjectStatus);

  const query = useQuery({
    queryKey: ["activeProject"],
    queryFn: fetchActiveProject,
    staleTime: 0, 
    gcTime: 0,
  });

  useEffect(() => {
    if (query.data) {
      setFromProjectStatus(query.data);
    }
  }, [query.data, setFromProjectStatus]);

  return query;
};