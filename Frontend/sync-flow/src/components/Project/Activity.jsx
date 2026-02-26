'use client'

import React from 'react'
import { ChevronRight, FileText, MessageSquare, Trash2, Plus, CheckCircle2, User } from 'lucide-react'
import { cn } from '../../utils/utils'

const activities = [
  {
    id: '1',
    user: 'Sarah Chen',
    avatar: 'SC',
    action: 'completed task',
    target: 'Design homepage mockups',
    type: 'completed',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    user: 'Marcus Johnson',
    avatar: 'MJ',
    action: 'commented on',
    target: 'API integration',
    type: 'commented',
    timestamp: '4 hours ago',
  },
  {
    id: '3',
    user: 'Elena Rodriguez',
    avatar: 'ER',
    action: 'created task',
    target: 'User testing session',
    type: 'created',
    timestamp: '1 day ago',
  },
  {
    id: '4',
    user: 'James Mitchell',
    avatar: 'JM',
    action: 'edited',
    target: 'Project timeline',
    type: 'edited',
    timestamp: '2 days ago',
  },
  {
    id: '5',
    user: 'Alex Taylor',
    avatar: 'AT',
    action: 'deleted task',
    target: 'Old design file',
    type: 'deleted',
    timestamp: '3 days ago',
  },
]

const getActivityIcon = (type) => {
  switch (type) {
    case 'created':
      return <Plus size={16} className="text-blue-600" />
    case 'edited':
      return <FileText size={16} className="text-orange-600" />
    case 'commented':
      return <MessageSquare size={16} className="text-purple-600" />
    case 'completed':
      return <CheckCircle2 size={16} className="text-green-600" />
    case 'deleted':
      return <Trash2 size={16} className="text-red-600" />
    default:
      return <User size={16} className="text-gray-600" />
  }
}

const getActivityBg = (type) => {
  switch (type) {
    case 'created':
      return 'bg-blue-50'
    case 'edited':
      return 'bg-orange-50'
    case 'commented':
      return 'bg-purple-50'
    case 'completed':
      return 'bg-green-50'
    case 'deleted':
      return 'bg-red-50'
    default:
      return 'bg-gray-50'
  }
}

export function Activity() {
  return (
    <div className="flex flex-col gap-2">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className={cn(
            'flex items-start gap-3 p-2 sm:p-3 rounded-lg transition-colors hover:bg-secondary cursor-pointer group',
            getActivityBg(activity.type)
          )}
        >
          {/* Avatar */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary text-white flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
            {activity.avatar}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-foreground">
              <span className="font-semibold">{activity.user}</span>{' '}
              <span className="text-muted-foreground">{activity.action}</span>{' '}
              <span className="font-medium text-foreground truncate">{activity.target}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
          </div>

          {/* Icon - show on hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">
            {getActivityIcon(activity.type)}
          </div>
        </div>
      ))}
    </div>
  )
}