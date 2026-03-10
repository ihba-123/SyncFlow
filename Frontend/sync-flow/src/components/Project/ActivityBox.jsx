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

  const activities = data || []

  return (
 
    <div className="w-full lg:sticky lg:top-32 h-[500px] sm:h-[550px] lg:h-[600px] max-h-[calc(100vh-150px)]">
      
  
      <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        
      
        <div className="flex-shrink-0 p-5 border-b border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
              <ActivityIcon size={20} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base tracking-tight truncate">Timeline</h3>
              <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 uppercase font-semibold tracking-wider">Live Updates</p>
            </div>
          </div>
        </div>

        {/* SCROLLABLE LIST AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-6">
          <div className="relative space-y-8">
         
            <div className="absolute left-[17px] top-1 bottom-1 w-[1.5px] bg-slate-100 dark:bg-slate-800" />

            {activities.map((activity, idx) => {
              const type = mapActionToType[activity.action] || 'viewed'
              const config = activityTypeConfig[type]
              const Icon = config.icon
              const initials = activity.user?.slice(0, 2).toUpperCase() || '??'

              return (
                <div key={activity.id || idx} className="group relative flex gap-4 items-start">
                  
                  {/* Indicator Section */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="h-9 w-9 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-[11px] font-bold text-white shadow-md ring-2 ring-white dark:ring-slate-900 group-hover:scale-110 transition-transform">
                      {initials}
                    </div>
                    <div className={cn(
                      "absolute -bottom-1 -right-1 p-1 rounded-md ring-2 ring-white dark:ring-slate-900 shadow-sm",
                      config.bgColor,
                      config.color
                    )}>
                      <Icon size={10} strokeWidth={3} />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                        {activity.user}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-full flex-shrink-0">
                        <Clock size={10} />
                        {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 group/arrow">
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug truncate">
                        <span className="capitalize font-medium text-slate-600 dark:text-slate-300">
                          {activity.action.replace(/_/g, ' ')}
                        </span>
                        {activity.details && <span className="text-slate-400 dark:text-slate-600 font-normal"> · {activity.details}</span>}
                      </p>
                      <ChevronRight size={12} className="text-slate-300 dark:text-slate-600 group-hover/arrow:translate-x-1 transition-all opacity-0 group-hover/arrow:opacity-100 flex-shrink-0" />
                    </div>

                    <span className="text-[10px] text-slate-400 dark:text-slate-600 mt-1 block">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* STICKY FOOTER FADE */}
        <div className="flex-shrink-0 h-10 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none absolute bottom-0 left-0 right-0 z-20 rounded-b-[24px]" />
      </div>

      {/* Internal Custom Scrollbar Styles */}
      <style>{`
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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  )
}