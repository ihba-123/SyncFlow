import { useQuery } from "@tanstack/react-query";
import { getProjectMembers } from "../../api/Project";

export const useTeamList = (project_id) => {
  return useQuery({
    queryKey: ["project-members", project_id],
    queryFn: () => getProjectMembers(project_id),
  });
};

