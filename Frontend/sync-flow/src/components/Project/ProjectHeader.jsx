import React from "react";
import { Calendar } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/Avatar";
import { useActiveProject } from "../../hooks/useActiveProject";
import { getProjectMembers } from "../../api/Project";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useTeamList } from "../../features/team/TeamListLogic";
import { FiUserPlus, FiEdit3 } from "react-icons/fi";
import { ProjectHeaderSkeleton } from "../skeleton/ProjectHeaderSkeleton";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@radix-ui/react-tooltip";

export function ProjectHeader() {
  const { data, isLoading: projectLoading } = useActiveProject();
  const { id } = useParams();
  const { data: teamData } = useTeamList(id);
  const role = teamData?.user_role;
  const navigate = useNavigate();

  const values = data?.active_project || {};
  const isSoloProject = values.is_solo;
  const canInvite = role === "admin" && isSoloProject === false;
  
  // Fetch Members
  const {
    data: membersData,
    isLoading: membersLoading,
    error: membersError,
  } = useQuery({
    queryKey: ["projectMembers", id],
    queryFn: () => getProjectMembers(id),
    enabled: !!id,
    refetchInterval: 5000,
  });

  const members = membersData?.joined_members || [];
  const limit = 3;
  const visibleMembers = members.slice(0, limit);
  const hiddenCount = members.length - limit;

  const userInvite = () => navigate(`/projects/${id}/invite`);
  const handleEdit = () => navigate(`/projects/${id}/edit`);

  if (projectLoading || membersLoading) return <ProjectHeaderSkeleton />;
  if (membersError) return navigate("/dashboard");

  return (
    <TooltipProvider>
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-border dark:border-gray-800 overflow-hidden">
          <div className="p-5 sm:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-10">
              
              {/* 1. Project Image - Scaled for screens */}
              <div className="shrink-0">
                <div className="relative group overflow-hidden rounded-2xl border border-border dark:border-gray-700 shadow-sm w-32 h-32 sm:w-40 sm:h-40 lg:w-38 lg:h-38">
                  <img
                    src={
                      values.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(values.name)}&background=random&color=fff&size=200`
                    }
                    alt={values.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>

              {/* 2. Main Content Area */}
              <div className="flex-1 w-full flex flex-col">
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                  {/* Title and Description */}
                  <div className="text-center md:text-left flex-1 min-w-0">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground dark:text-white truncate">
                        {values.name}
                      </h1>
                      {role === "admin" && (
                        <button
                          onClick={handleEdit}
                          className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
                          aria-label="Edit Project"
                        >
                          <FiEdit3 size={20} />
                        </button>
                      )}
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground dark:text-gray-400 max-w-3xl line-clamp-2 md:line-clamp-3">
                      {values.description}
                    </p>
                  </div>

                  {/* Desktop Action Button */}
                  {canInvite && (
                    <div className="hidden  md:block">
                      <button
                        onClick={userInvite}
                        className="flex items-center gap-2 cursor-pointer bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3  rounded font-semibold shadow-lg hover:shadow-xl text-sm hover:-translate-y-0.5 transition-all active:scale-95 whitespace-nowrap"
                      >
                        <FiUserPlus size={15} />
                        <span>Invite Member</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-border dark:bg-gray-800 my-6" />

                {/* Footer Section: Members & Meta */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  {/* Member Stack */}
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {visibleMembers.map((member, index) => (
                        <Tooltip key={member.id}>
                          <TooltipTrigger asChild>
                            <div 
                              className="relative" 
                              style={{ zIndex: 10 - index }}
                            >
                              <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-900 shadow-sm transition-transform hover:scale-110 hover:-translate-y-1 cursor-pointer">
                                {member.photo ? (
                                  <AvatarImage src={member.photo} alt={member.name} className="object-cover" />
                                ) : (
                                  <AvatarFallback className="bg-slate-100 dark:bg-gray-800 text-xs font-bold">
                                    {member.name?.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-slate-900 text-white px-2 py-1 rounded text-xs">
                            {member.name}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                      
                      {hiddenCount > 0 && (
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900 text-xs font-bold text-gray-600 dark:text-gray-300 z-0">
                          +{hiddenCount}
                        </div>
                      )}
                    </div>
                    {hiddenCount > 0 && (
                      <p className="hidden lg:block text-xs font-medium text-muted-foreground">
                        {hiddenCount} more member{hiddenCount > 1 ? "s" : ""} joined
                      </p>
                    )}
                  </div>

                  {/* Project Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-border dark:border-gray-700">
                      <Calendar size={16} className="text-primary" />
                      <span className="font-medium">
                        Created: {values.created_at ? new Date(values.created_at).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Mobile-only Action Button (Visible only on small screens) */}
                  {canInvite && (
                    <div className="w-full md:hidden">
                      <button
                        onClick={userInvite}
                        className="w-48 flex items-center text-sm justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3.5 rounded font-bold shadow-md active:scale-[0.98] transition-transform"
                      >
                        <FiUserPlus size={15} />
                        <span>Invite Member</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}