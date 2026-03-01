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
import { useProject } from "../../hooks/useProject";
import { FiUserPlus } from "react-icons/fi";
import { ProjectHeaderSkeleton } from "../skeleton/ProjectHeaderSkeleton";

export function ProjectHeader() {
  const { data, isLoading: projectLoading } = useActiveProject();
  const { id } = useParams();
  const { data: teamData } = useTeamList(id);
  const { is_solo } = useProject();
  const role = teamData?.user_role;
  const navigate = useNavigate();
  
  const values = data?.active_project || {};

  // Fetch Members
  const {
    data: membersData,
    isLoading: membersLoading,
    error: membersError,
  } = useQuery({
    queryKey: ["projectMembers", id],
    queryFn: () => getProjectMembers(id),
    enabled: !!id,
  });

  const members = membersData?.joined_members || [];
  const visibleMembers = members.slice(0, 5); // Only show first 5
  const hiddenCount = members.length - visibleMembers.length;

  const userInvite = () => {
    navigate(`/projects/${id}/invite`);
  };

  if (projectLoading || membersLoading) {
    return (
       <ProjectHeaderSkeleton/>
    );
  }

  if (membersError) return <div className="p-4 text-red-500 text-center">Failed to load members</div>;

  return (
    <div className="mb-6 sm:mb-8">
      <div className="relative px-2 sm:px-4 md:px-8 pb-4 sm:pb-6 mt-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg border border-border dark:border-gray-700 p-4 sm:p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            
            {/* 1. Project Image */}
            <div className="shrink-0">
              <div className="overflow-hidden rounded-xl border border-border dark:border-gray-700 shadow-md group">
                <img
                  src={
                    values.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      values.name || "Project"
                    )}&background=random&color=fff&size=128`
                  }
                  alt={values.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>

            {/* 2. Project Info & Action */}
            <div className="flex-1 w-full">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="text-center md:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white mb-2">
                    {values.name}
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground dark:text-gray-300 mb-4 max-w-2xl line-clamp-2">
                    {values.description}
                  </p>
                </div>

                {/* Invite Button - Fixed size for md/sm screens */}
                {role === "admin" && !is_solo && (
                  <div className="flex justify-center md:justify-end">
                    <button
                      onClick={userInvite}
                      className="flex items-center justify-center gap-2 cursor-pointer
                                 w-fit min-w-[150px] /* Force consistent size */
                                 bg-gray-700 hover:bg-gray-800 dark:bg-white dark:text-black 
                                 rounded-xl px-5 py-2.5 text-sm font-semibold text-white
                                 shadow-md transition-all active:scale-95 whitespace-nowrap"
                    >
                      <FiUserPlus size={18} />
                      <span>Invite member</span>
                    </button>
                  </div>
                )}
              </div>

              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-5 border-t border-gray-100 dark:border-gray-700">
                
                {/* Avatar Stack Section */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-3.5 transition-all duration-300">
                    {visibleMembers.map((member) => (
                      <div key={member.id} className="relative group">
                        {/* Name Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                          <div className="bg-gray-900 dark:bg-gray-700 text-white text-[10px] px-2 py-1 rounded shadow-xl whitespace-nowrap">
                            {member.name}
                          </div>
                          <div className="w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45 -mt-1 mx-auto"></div>
                        </div>

                        <Avatar className="h-9 w-9 border-2 border-white dark:border-gray-800 transition-transform group-hover:scale-110 group-hover:z-10 cursor-pointer">
                          {member.photo ? (
                            <AvatarImage src={member.photo} alt={member.name} />
                          ) : (
                            <AvatarFallback className="bg-blue-600 text-white text-[10px] font-bold">
                              {member.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </div>
                    ))}

                    {/* Hidden Count Indicator */}
                    {hiddenCount > 0 && (
                      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-300 z-0">
                        +{hiddenCount}
                      </div>
                    )}
                  </div>
                  
                  {hiddenCount > 0 && (
                    <span className="text-[11px] text-muted-foreground hidden sm:block">
                      Team members
                    </span>
                  )}
                </div>

                {/* Date Created */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
                  <Calendar size={14} />
                  <span>
                    Created: {values.created_at ? new Date(values.created_at).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}