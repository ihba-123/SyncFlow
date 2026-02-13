import React from "react";
import { FiUserPlus } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useProjectRoleStore } from "../../stores/ProjectRoleStore";
import { useTeamList } from "../team/TeamListLogic";
import { useProject } from "../../hooks/useProject";
const ProjectDetail = () => {
  const { id , project_id } = useParams();
  const { setRole, isAdmin } = useProjectRoleStore();
  const { is_solo } = useProject();
  const {data} = useTeamList(id);
  const role = data?.user_role;
  const navigate = useNavigate();
    const userInvite = () => {
    navigate(`/projects/${project_id || id}/invite`);
  }

  return (
    <div>
    {role==="admin" && !is_solo ? (
                <button onClick={userInvite}
                  className="flex items-center cursor-pointer justify-center gap-2 w-6/12 sm:w-auto 
                g-white dark:bg-white/90 bg-blue-700 dark:text-black dark:shadow-none rounded-xl border border-slate-500/50 dark:border-white/10 scale-3d
                px-5 py-2.5 text-sm sm:text-base font-medium text-white
                shadow-lg hover:scale-[1.02] transition"
                >
                  <FiUserPlus size={16} />
                  Invite member
                </button>
              ) : null}
    </div>
  );
};

export default ProjectDetail;
