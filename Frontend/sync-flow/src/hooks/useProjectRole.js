import { useEffect } from "react";
import { useTeamList } from "../features/team/TeamListLogic";
import { useAuth } from "./Auth";
import { useProjectRoleStore } from "../stores/ProjectRoleStore";
import { useActiveProjectStore } from "../stores/ActiveProject";

export const useProjectRole = () => {
  const { activeProject } = useActiveProjectStore();
  const { data } = useTeamList(activeProject?.id);
  const { data: authData } = useAuth();
  const { setRole } = useProjectRoleStore();

  useEffect(() => {
    if (!data || !authData) return;

    const joined = data.joined_members || [];

    const myRole = joined.find(
      (member) => member.id === authData.id
    )?.role;

    if (myRole) {
      setRole(myRole, activeProject.id);
    }
  }, [data, authData, activeProject, setRole]);
};