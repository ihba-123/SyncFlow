import React from 'react'
import { CheckCircle2, FolderKanban, Target, TrendingUp } from "lucide-react";
import { useActiveProjectStore } from '../../stores/ActiveProject';
import {
  MetricCard
} from "../../pages/dashboard/DashboardSections";
import { toNumber } from '../../utils/dashboardUtils';

const MetricCards = ( {  totalTasks, progress, doneTasks, velocity_last_7_days, openTasks, highPriorityTasks}  ) => {
    const activeProject = useActiveProjectStore((state) => state.activeProject);
    const projectId = activeProject?.id;
     const isSoloProject = !!activeProject?.is_solo;
     const heroAccent = isSoloProject ? "#0ea5e9" : "#8b5cf6";
  return (
    <div>
       <section className="grid gap-4   md:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                icon={FolderKanban}
                label="Total tasks"
                value={totalTasks}
                detail={
                  projectId
                    ? `Across ${activeProject?.name || "this project"}`
                    : "No project selected"
                }
                accent={heroAccent}
              />
              <MetricCard
                icon={CheckCircle2}
                label="Completion"
                value={`${progress}%`}
                detail={`${doneTasks} tasks marked done`}
                accent="#10b981"
              />
              <MetricCard
                icon={TrendingUp}
                label="7-day velocity"
                value={toNumber(velocity_last_7_days)}
                detail="Tasks completed in the last 7 days"
                accent="#f59e0b"
              />
              <MetricCard
                icon={Target}
                label="Open work"
                value={openTasks}
                detail={`${highPriorityTasks} high-priority items`}
                accent="#ef4444"
              />
            </section>
    </div>
  )
}

export default MetricCards
