import { useQuery } from "@tanstack/react-query";
import { getProjectMembers } from "../../api/Project";

export const useTeamList = (id) => {
  return useQuery({
    queryKey: ["members", id],
    queryFn: () => getProjectMembers(id),
    refetchInterval: 3000,
    refetchIntervalInBackground: true,

  staleTime: 0,
  });
};

