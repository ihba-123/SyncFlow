import { useParams } from "react-router-dom";
import { useTeamList } from "../team/TeamListLogic";
import { ActivityBox } from "../../components/Project/ActivityBox";
import { DangerZone } from "../../components/Project/DangerZone";
import { ProjectHeader } from "../../components/Project/ProjectHeader";
import { GroupChatBox } from "../../components/Project/GroupChatBox";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import KanbanBoard from "../../components/Kanban/KanbanBoard";
import { useActiveProjectStore } from "../../stores/ActiveProject";
import useProjectSocket from "../../hooks/useProjectSocket";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const ProjectDetail = () => {
  const { id, project_id } = useParams();
  const activeProjectId = project_id || id; // Handle both param names
  const { data } = useTeamList(id);
  const role = data?.user_role;
  const joinedMembers = data?.joined_members || [];
  const activeProject = useActiveProjectStore((s) => s.activeProject);
  const resetActiveProject = useActiveProjectStore((s) => s.reset);
  const isTeamProject = activeProject?.is_solo === false;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useProjectSocket(activeProjectId, (payload) => {
    const action = payload?.action || payload?.type;

    const isArchiveEvent = action === "project_archived" || action === "project_trashed";
    const isDeleteEvent = action === "project_deleted" || action === "project_permanently_deleted";

    if (isArchiveEvent || isDeleteEvent) {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["archivedProjects"] });

      if (String(activeProject?.id) === String(activeProjectId)) {
        resetActiveProject();
        toast.info(
          isArchiveEvent
            ? "This project was moved to trash by admin."
            : "This project was deleted by admin."
        );
        navigate("/dashboard", { replace: true });
      }
    }
  });

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 p-2 sm:p-4 md:p-8 min-h-0 bg-[#f8fafc] dark:bg-[#020617]
      dark:bg-[radial-gradient(at_top_left,rgba(56,189,248,0.05),transparent),radial-gradient(at_bottom_right,rgba(139,92,246,0.05),transparent)]"
    >
      {/* Main Content Area: Header + Kanban */}
      <div className="flex-1 min-w-0 flex flex-col gap-6">
        <TooltipProvider delayDuration={200}>
          <ProjectHeader />
        </TooltipProvider>

        {/* Kanban Board Container */}
        <div className="w-full bg-white/50 dark:bg-zinc-900/20 rounded border border-zinc-200 dark:border-zinc-800/50 overflow-hidden">
       
        <KanbanBoard />
        </div>
      </div>

      

      {/* Sidebar: Danger Zone & Activity */}
      <div className="w-full lg:w-88 xl:w-100 2xl:w-md shrink-0 flex flex-col gap-4 sm:gap-6 md:gap-8">
     
          {isTeamProject && (
            <GroupChatBox
              projectName="Project Team"
              projectId={activeProjectId}
              members={joinedMembers}
            />
          )}
          <ActivityBox projectId={activeProjectId} />

      </div>
    </div>
  );
};

export default ProjectDetail;