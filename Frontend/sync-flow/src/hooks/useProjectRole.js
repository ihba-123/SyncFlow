import { useEffect } from "react";
import { useTeamList } from "../features/team/TeamListLogic";
import { useAuth } from "./Auth";
import { useProjectRoleStore } from "../stores/ProjectRoleStore";
import { useActiveProjectStore } from "../stores/ActiveProject";

export const useProjectRole = () => {
  const { activeProject } = useActiveProjectStore();
  const { data: authData, is_Authenticated } = useAuth();
  const { data } = useTeamList(
    is_Authenticated ? activeProject?.id : null
  );
  const { setRole } = useProjectRoleStore();

  useEffect(() => {
    if (!is_Authenticated || !data || !authData || !activeProject?.id) return;

    const joined = data.joined_members || [];

    const myRole = joined.find(
      (member) => member.id === authData.id
    )?.role;

    if (myRole) {
      setRole(myRole, activeProject.id);
    }
  }, [data, authData, activeProject, is_Authenticated, setRole]);
};