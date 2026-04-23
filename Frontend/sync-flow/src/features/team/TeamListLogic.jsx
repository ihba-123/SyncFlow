import { useQuery } from "@tanstack/react-query";
import { getProjectMembers } from "../../api/Project";

export const useTeamList = (id) => {
  return useQuery({
    queryKey: ["members", id],
    queryFn: () => getProjectMembers(id),
    enabled: Boolean(id),
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });
};

