import React from 'react'
import { Calendar } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Badge } from '../../components/ui/Badge'
import { useActiveProject } from '../../hooks/useActiveProject'
import { getProjectMembers } from '../../api/Project'
const teamMembers = [
  { name: 'Alice', initials: 'A', color: 'bg-blue-500' },
  { name: 'Bob', initials: 'B', color: 'bg-purple-500' },
  { name: 'Charlie', initials: 'C', color: 'bg-pink-500' },
]

export function ProjectHeader() {
  const { data, isLoading } = useActiveProject();

  const values = data?.active_project || {};
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="mb-6 sm:mb-8">

      {/* Header content - overlapped */}
      <div className="relative px-2 py-20 sm:px-4 md:px-8 pb-4 sm:pb-6 -mt-12 sm:-mt-16 md:-mt-20">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-border p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6 md:gap-8">
            {/* Project Image */}
            <div className="flex-shrink-0 w-full sm:w-auto">
              <img
                src={values.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(values.name)}&background=random&color=fff&size=128`}
                alt={values.name}
                className="w-full sm:w-32 md:w-40 h-auto sm:h-24 md:h-32 rounded-lg sm:rounded-xl object-cover shadow-md border border-border"
              />
            </div>

            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-balance">{values.name}</h1>
                <Badge className="bg-primary text-white font-medium w-fit">Active</Badge>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                {values.description}
              </p>

              {/* Meta info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 md:gap-8">
                {/* Team members */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-3">
                    {teamMembers.map((member, i) => (
                      <Avatar key={i} className="border-2 border-white h-6 w-6 sm:h-8 sm:w-8">
                        <AvatarFallback className={`${member.color} text-white text-xs font-bold`}>
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground ml-2">+2 more</span>
                </div>

                {/* Created date */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Calendar size={14} className="sm:size-4" />
                  <span className="whitespace-nowrap"> {new Date(values.created_at).toLocaleDateString()} </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
