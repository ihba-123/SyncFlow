import React from "react";
import { FiUserPlus } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useProjectRoleStore } from "../../stores/ProjectRoleStore";
import { useTeamList } from "../team/TeamListLogic";
import { useProject } from "../../hooks/useProject";
import { ActivityBox } from "../../components/Project/ActivityBox";
import { Activity } from "../../components/Project/Activity";
import { DangerZone } from "../../components/Project/DangerZone";
import { ProjectHeader } from "../../components/Project/ProjectHeader";
const ProjectDetail = () => {
  const { id, project_id } = useParams();
  const { data } = useTeamList(id);
  const role = data?.user_role;
  const navigate = useNavigate();
  const userInvite = () => {
    navigate(`/projects/${project_id || id}/invite`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 p-2 sm:p-4 md:p-8">
      <div className="flex-1 min-w-0">
        <ProjectHeader />
      </div>
       <div className="w-full lg:w-1/4 lg:min-w-64 flex flex-col gap-4 sm:gap-6 md:gap-8">
          {/* Danger zone - sticky on large screens */}
          <div className="  lg:h-fit">
            <DangerZone />
          </div>

       
            <ActivityBox />
      
        </div>

      {/* {role === "admin" && !is_solo ? (
        <button
          onClick={userInvite}
          className="flex items-center cursor-pointer justify-center gap-2 w-6/12 sm:w-auto 
                g-white dark:bg-white/90 bg-blue-700 dark:text-black dark:shadow-none rounded-xl border border-slate-500/50 dark:border-white/10 scale-3d
                px-5 py-2.5 text-sm sm:text-base font-medium text-white
                shadow-lg hover:scale-[1.02] transition"
        >
          <FiUserPlus size={16} />
          Invite member
        </button>
      ) : null} */}
    </div>
  );
};

export default ProjectDetail;
