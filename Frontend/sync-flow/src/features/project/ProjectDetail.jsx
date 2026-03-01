import { useParams } from "react-router-dom";
import { useTeamList } from "../team/TeamListLogic";
import { ActivityBox } from "../../components/Project/ActivityBox";
import { DangerZone } from "../../components/Project/DangerZone";
import { ProjectHeader } from "../../components/Project/ProjectHeader";
const ProjectDetail = () => {
  const { id, project_id } = useParams();
  const { data } = useTeamList(id);
  const role = data?.user_role;

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 p-2 sm:p-4 md:p-8">
      <div className="flex-1 min-w-0">
        <ProjectHeader />
      </div>
      <div className="w-full lg:w-1/4 lg:min-w-64 flex flex-col gap-4 sm:gap-6 md:gap-8">
        
        <div className="  lg:h-fit">
          {role === "viewer" ? null : (
            <DangerZone projectId={project_id || id} />
          )}
        </div>

        <ActivityBox />
      </div>
    </div>
  );
};

export default ProjectDetail;
