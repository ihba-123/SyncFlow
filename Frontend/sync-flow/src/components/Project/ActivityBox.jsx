'use client'

import React from 'react'
import { Activity as ActivityIcon, MessageSquare, CheckCircle2, Edit3, Plus, Trash2, Eye } from 'lucide-react'
import { cn } from '../../utils/utils'

const activityData = [
  {
    id: '1',
    user: 'Sarah Anderson',
    action: 'Completed task',
    type: 'completed',
    timestamp: '2 hours ago',
    description: '"Fix responsive design issues" marked as done',
    avatar: 'SA',
    color: 'bg-blue-500',
  },
  {
    id: '2',
    user: 'Marcus Chen',
    action: 'Added comment',
    type: 'commented',
    timestamp: '4 hours ago',
    description: '"Great progress on the new design system layout"',
    avatar: 'MC',
    color: 'bg-purple-500',
  },
  {
    id: '3',
    user: 'Alex Johnson',
    action: 'Created task',
    type: 'created',
    timestamp: '1 day ago',
    description: '"Update documentation with new components"',
    avatar: 'AJ',
    color: 'bg-green-500',
  },
  {
    id: '4',
    user: 'Emma Davis',
    action: 'Edited task',
    type: 'edited',
    timestamp: '2 days ago',
    description: 'Updated priority to "High"',
    avatar: 'ED',
    color: 'bg-orange-500',
  },
  {
    id: '5',
    user: 'James Wilson',
    action: 'Viewed project',
    type: 'viewed',
    timestamp: '3 days ago',
    description: 'Reviewed project timeline',
    avatar: 'JW',
    color: 'bg-pink-500',
  },
]

const activityTypeConfig = {
  created: { icon: Plus, color: 'text-green-600', bgColor: 'bg-green-100' },
  edited: { icon: Edit3, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  commented: { icon: MessageSquare, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  completed: { icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  deleted: { icon: Trash2, color: 'text-red-600', bgColor: 'bg-red-100' },
  viewed: { icon: Eye, color: 'text-gray-600', bgColor: 'bg-gray-100' },
}

export function ActivityBox() {
  return (
    <div className="w-full lg:sticky lg:top-32 lg:h-fit">
      <div className="rounded-lg sm:rounded-2xl border border-border bg-white p-3 sm:p-4 md:p-6 shadow-lg flex flex-col h-full lg:max-h-[calc(100vh-200px)]">
        
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 flex-shrink-0">
          <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
            <ActivityIcon size={18} className="text-primary sm:size-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">
              Recent Activity
            </h3>
            <p className="text-xs text-muted-foreground">
              Project timeline and updates
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-4 sm:mb-6 flex-shrink-0" />

        {/* Scrollable Activity List */}
        <div className="space-y-3 sm:space-y-4 overflow-y-auto flex-1 pr-1 sm:pr-2">
          {activityData.map((activity) => {
            const typeConfig = activityTypeConfig[activity.type]
            const IconComponent = typeConfig.icon

            return (
              <div
                key={activity.id}
                className="flex gap-2 sm:gap-4 pb-3 sm:pb-4 border-b border-border/50 last:pb-0 last:border-b-0"
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div
                    className={cn(
                      'w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm font-bold',
                      activity.color
                    )}
                  >
                    {activity.avatar}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                        {activity.user}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.action}
                      </p>
                    </div>

                    <div
                      className={cn(
                        'p-1 rounded-lg flex-shrink-0',
                        typeConfig.bgColor
                      )}
                    >
                      <IconComponent
                        size={14}
                        className={cn('sm:size-4', typeConfig.color)}
                      />
                    </div>
                  </div>

                  {activity.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-1">
                      {activity.description}
                    </p>
                  )}

                  <span className="text-xs text-muted-foreground/70">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Button */}
        <div className="border-t border-border/50 mt-4 sm:mt-6 pt-3 sm:pt-4 flex-shrink-0">
          <button className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors">
            View all activity →
          </button>
        </div>
      </div>
    </div>
  )
}