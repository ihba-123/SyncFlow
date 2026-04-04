import React from 'react'
import {
  BarChart3,
  Gauge
} from "lucide-react";
import { useActiveProjectStore } from '../../stores/ActiveProject';
import { ChartPanel, DonutChart } from '../../pages/dashboard/DashboardSections';

const ChartComponent = ({ dashboardQuery,statusSeries, totalTasks, progress, doneTasks, velocity_last_7_days, openTasks, highPriorityTasks,summaryLine ,activeOwners }) => {
        const activeProject = useActiveProjectStore((state) => state.activeProject);
         const isSoloProject = !!activeProject?.is_solo;
         const heroAccent = isSoloProject ? "#0ea5e9" : "#8b5cf6";
  return (
    <div>
       <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr] ">
              <ChartPanel
                title="Status distribution"
                subtitle={    
                  isSoloProject
                    ? "How your personal workload is spread across stages."
                    : "How the team's work is spread across the board."
                }
                icon={BarChart3}
              >
                <DonutChart
                  items={statusSeries}
                  total={totalTasks}
                  centerLabel="Progress"
                  centerValue={`${progress}%`}
                />
              </ChartPanel>

              <ChartPanel
                title="Live snapshot"
                subtitle="Auto-refreshes every few seconds and on websocket updates."
                icon={Gauge}
              >
                <div className="space-y-4">
                  <div className="rounded-sm border border-slate-200/80 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/50">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400">
                          Workspace mode
                        </p>
                        <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                          {isSoloProject ? "Solo" : "Team"}
                        </p>
                      </div>
                      <div
                        className="rounded-2xl px-3 py-2 text-sm font-bold text-white"
                        style={{
                          background: `linear-gradient(135deg, ${heroAccent}, #1392ec)`,
                        }}
                      >
                        Live
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {summaryLine}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-white/10 dark:bg-slate-950/50">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                        Priority pressure
                      </p>
                      <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                        {highPriorityTasks}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        High-priority items in flight
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-white/10 dark:bg-slate-950/50">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                        Owners with work
                      </p>
                      <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                        {activeOwners}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Members currently assigned tasks
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/90 px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-900/50">
                    <span className="text-slate-500 dark:text-slate-400">
                      Last refresh
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {dashboardQuery.dataUpdatedAt
                        ? new Date(
                            dashboardQuery.dataUpdatedAt,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now"}
                    </span>
                  </div>
                </div>
              </ChartPanel>
            </section>
    </div>
  )
}

export default ChartComponent
