import { useParams } from "react-router-dom";
import { useTeamList } from "../team/TeamListLogic";
import { ActivityBox } from "../../components/Project/ActivityBox";
import { DangerZone } from "../../components/Project/DangerZone";
import { ProjectHeader } from "../../components/Project/ProjectHeader";
import { TooltipProvider } from "@radix-ui/react-tooltip";

const ProjectDetail = () => {
  const { id, project_id } = useParams();
  const activeProjectId = project_id || id; // Handle both param names
  const { data } = useTeamList(id);
  const role = data?.user_role;

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 p-2 sm:p-4 md:p-8 min-h-screen bg-[#f8fafc] dark:bg-[#020617]
      dark:bg-[radial-gradient(at_top_left,_rgba(56,189,248,0.05),_transparent),radial-gradient(at_bottom_right,_rgba(139,92,246,0.05),_transparent)]"
    >
      {/* Main Content Area: Header + Kanban */}
      <div className="flex-1 min-w-0 flex flex-col gap-6">
        <TooltipProvider delayDuration={200}>
          <ProjectHeader />
        </TooltipProvider>

        {/* Kanban Board Container */}
        <div className="flex-1 bg-white/50 dark:bg-zinc-900/20 rounded-3xl border border-zinc-200 dark:border-zinc-800/50 overflow-hidden">
        {/* // The KanbanBoard component is responsible for fetching its own data and managing its state. */}
        </div>
      </div>

      {/* Sidebar: Danger Zone & Activity */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4 sm:gap-6 md:gap-8">
        <div className="lg:h-fit">
          {role === "viewer" ? null : (
            <DangerZone projectId={activeProjectId} />
          )}
        </div>

        <ActivityBox projectId={activeProjectId} />
      </div>
    </div>
  );
};

export default ProjectDetail;