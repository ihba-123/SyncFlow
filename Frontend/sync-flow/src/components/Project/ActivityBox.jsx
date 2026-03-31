'use client'

import React from 'react'
import { 
  Activity as ActivityIcon, 
  MessageSquare, 
  CheckCircle2, 
  Edit3, 
  Plus, 
  Trash2, 
  Eye, 
  Clock,
  ChevronRight,
  FolderKanban 
} from 'lucide-react'
import { cn } from '../../utils/utils'
import { useQuery } from '@tanstack/react-query'
import { activityLog } from '../../api/activity_log'
import { useParams } from 'react-router-dom'

const mapActionToType = {
  project_created: 'project',
  project_updated: 'edited',
  project_deleted: 'deleted',
  project_restored: 'project',
  task_created: 'created',
  task_updated: 'edited',
  task_deleted: 'deleted',
  comment_added: 'commented',
  attachment_added: 'created',
  member_added: 'created',
  member_joined: 'created',
}

const activityTypeConfig = {
  project: { icon: FolderKanban, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/30' },
  created: { icon: Plus, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-900/30' },
  edited: { icon: Edit3, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-900/30' },
  commented: { icon: MessageSquare, color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-50 dark:bg-indigo-900/30' },
  completed: { icon: CheckCircle2, color: 'text-cyan-600 dark:text-cyan-400', bgColor: 'bg-cyan-50 dark:bg-cyan-900/30' },
  deleted: { icon: Trash2, color: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-50 dark:bg-rose-900/30' },
  viewed: { icon: Eye, color: 'text-slate-600 dark:text-slate-400', bgColor: 'bg-slate-50 dark:bg-slate-800/40' },
}

export function ActivityBox() {
  const { id } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['activity-log', id],
    queryFn: () => activityLog(id),
  })

  if (isLoading) return <div className="h-[500px] w-full bg-slate-100/50 dark:bg-slate-800/50 animate-pulse rounded-3xl" />
  if (isError) return null

  const activities = data || []

  return (
    /* Outer Container: 
      - Sets a maximum height so it doesn't grow infinitely.
      - On large screens, it sticks to the top.
    */
    <div className="w-full lg:sticky lg:top-24 h-[500px] sm:h-[600px] lg:h-[calc(100vh-160px)] max-h-[800px]">
      <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        
        {/* Header - Fixed (Non-scrollable) */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                <ActivityIcon size={20} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base tracking-tight truncate">
                  Timeline
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest">
                  Activity Feed
                </p>
              </div>
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 custom-scrollbar hover:scrollbar-thumb-slate-300 dark:hover:scrollbar-thumb-slate-700 transition-colors">
          <div className="relative space-y-8 pb-4">
            {/* Timeline Vertical Line */}
            <div className="absolute left-4 sm:left-5 top-2 bottom-2 w-[1.5px] bg-slate-100 dark:bg-slate-800" />

            {activities.length > 0 ? (
              activities.map((activity, idx) => {
                const type = mapActionToType[activity.action] || 'viewed'
                const config = activityTypeConfig[type]
                const Icon = config.icon
                const initials = activity.user?.slice(0, 2).toUpperCase() || '??'

                return (
                  <div key={activity.id || idx} className="group relative flex gap-4 items-start">
                    {/* User Avatar & Action Icon */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-slate-900 dark:bg-slate-700 flex items-center justify-center text-[11px] font-bold text-white shadow-lg ring-4 ring-white dark:ring-slate-900 group-hover:scale-105 transition-transform duration-300">
                        {initials}
                      </div>
                      <div className={cn(
                        "absolute -bottom-1 -right-1 p-1 rounded-md ring-2 ring-white dark:ring-slate-900 shadow-sm transition-transform group-hover:rotate-12",
                        config.bgColor,
                        config.color
                      )}>
                        <Icon size={11} strokeWidth={3} />
                      </div>
                    </div>

                    {/* Information Box */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 mb-1">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                          {activity.user}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-md">
                          <Clock size={10} />
                          {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-1 group/arrow">
                        <div className="flex-1">
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">
                              {activity.action.replace(/_/g, ' ')}
                            </span>
                            {activity.details && (
                              <span className="text-slate-400 dark:text-slate-500 font-normal italic">
                                {" "}- {activity.details}
                              </span>
                            )}
                          </p>
                        </div>
                        <ChevronRight size={14} className="mt-0.5 text-slate-300 dark:text-slate-600 group-hover/arrow:translate-x-1 transition-all opacity-0 group-hover/arrow:opacity-100 flex-shrink-0" />
                      </div>
                      
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-600 mt-2 block">
                        {new Date(activity.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600 mb-3">
                  <ActivityIcon size={32} />
                </div>
                <p className="text-sm font-medium text-slate-400">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Fade (Visual cue that there is more content) */}
        <div className="flex-shrink-0 h-8 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none sticky bottom-0" />
      </div>
      
      {/* Scrollbar Customization CSS (Add this to your globals.css or a style tag) */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
        }
      `}</style>
    </div>
  )
}