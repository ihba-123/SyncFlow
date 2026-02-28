import React from "react";
import { Calendar } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { useActiveProject } from "../../hooks/useActiveProject";
import { getProjectMembers } from "../../api/Project";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export function ProjectHeader() {
  const { data, isLoading } = useActiveProject();
  const { id } = useParams();

  const values = data?.active_project || {};

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
  const visibleMembers = members.slice(0, 5);
  const hiddenCount = members.length - visibleMembers.length;

  if (isLoading) return <div>Loading project...</div>;
  if (membersLoading) return <div>Loading members...</div>;
  if (membersError) return <div>Failed to load members</div>;

  return (
    <div className="mb-6 sm:mb-8">
      <div className="relative px-2 py-20 sm:px-4 md:px-8 pb-4 sm:pb-6 -mt-12 sm:-mt-16 md:-mt-20">
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-border dark:border-gray-700 p-3 sm:p-4 md:p-6">
          <div className="flex flex-col  sm:flex-row items-start justify-between gap-4 sm:gap-6 md:gap-8">
            {/* Project Image */}
            <div className="flex justify-center md:justify-start shrink-0 w-full sm:w-auto">
              <div className="overflow-hidden rounded-xl  border border-border dark:border-gray-700 shadow-md group">
                <img
                  src={
                    values.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      values.name || "Project",
                    )}&background=random&color=fff&size=128`
                  }
                  alt={values.name}
                  className="
                    w-48 h-48 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44
                    object-cover
                    transition-transform duration-300 ease-in-out
                    group-hover:scale-110
                  "
                />
              </div>
            </div>

            {/* Project Info */}
            <div className="flex-1  text-center sm:text-left w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-3">
                <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-foreground dark:text-white text-balance">
                  {values.name}
                </h1>
              </div>

              <p className="text-md sm:text-base text-muted-foreground dark:text-gray-300 mb-3 sm:mb-4 line-clamp-2">
                {values.description}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 md:gap-8">
                <div className="flex items-center gap-2">
                  <div className="flex  -space-x-3">
                    {visibleMembers.map((member) => (
                      <div key={member.id} className="relative group">
                        <Avatar
                          className="
                            border-2 border-white
                            h-8 w-8 sm:h-9 sm:w-9
                            transition-all duration-300 ease-out
                            group-hover:scale-125
                            group-hover:z-20
                            cursor-pointer
                          "
                        >
                          {member.photo ? (
                            <AvatarImage src={member.photo} alt={member.name} />
                          ) : (
                            <AvatarFallback
                              className={
                                member.role === "Admin"
                                  ? "bg-red-500 text-white text-xs font-bold"
                                  : "bg-blue-500 text-white text-xs font-bold"
                              }
                            >
                              {member.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>

                        {/* Tooltip: member name */}
                        <div
                          className="
                          absolute bottom-full left-1/2 -translate-x-1/2
                          mb-1 px-2 py-1
                          bg-gray-900 dark:bg-gray-700 text-white dark:text-white text-xs rounded-md
                          whitespace-nowrap
                          opacity-0
                          pointer-events-none
                          group-hover:opacity-100
                          transition-opacity duration-200
                        "
                        >
                          {member.name}
                        </div>
                      </div>
                    ))}
                  </div>

                  {hiddenCount > 0 && (
                    <span
                      className="text-xs sm:text-sm text-muted-foreground dark:text-gray-300 ml-2 cursor-pointer"
                      title={members
                        .slice(5)
                        .map((m) => m.name)
                        .join(", ")}
                    >
                      +{hiddenCount} more
                    </span>
                  )}
                </div>

                {/* Created Date */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground dark:text-gray-300">
                  <Calendar size={16} />
                  <span className="whitespace-nowrap">
                    {values.created_at
                      ? new Date(values.created_at).toLocaleDateString()
                      : ""}
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
