import { ArrowRight, FolderKanban, ShieldCheck, Sparkles, Users2 } from 'lucide-react'
import React, { Activity } from 'react'

const WelcomeCard = ({ data, summaryLine, projectId, activeProject, dashboardQuery, isSoloProject, navigate, setShowCreateProject }) => {
  return (
    <div>
         <section className="rounded-md border border-white/70 bg-white/85 p-5 shadow-[0_22px_55px_-34px_rgba(15,23,42,0.55)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-md border border-white/80 bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                <Sparkles className="h-3.5 w-3.5" />
                Live workspace dashboard
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
                  Welcome back, {data.name} !
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                  {summaryLine}{" "}
                  {projectId
                    ? `You're viewing ${activeProject?.name || "the active project"}.`
                    : "Select a project to open its dashboard."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 dark:bg-white/5">
                  <FolderKanban className="h-4 w-4" />
                  {projectId
                    ? activeProject?.name || `Project #${projectId}`
                    : "No active project"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 dark:bg-white/5">
                  {isSoloProject ? (
                    <ShieldCheck className="h-4 w-4" />
                  ) : (
                    <Users2 className="h-4 w-4" />
                  )}
                  {isSoloProject ? "Solo project" : "Team project"}
                </span>
                {dashboardQuery.isFetching && (
                  <span className="inline-flex items-center gap-2 rounded-sm bg-emerald-500/10 px-3 py-1.5 text-emerald-600 dark:text-emerald-300">
                    <Activity className="h-4 w-4 animate-pulse" />
                    Syncing live data
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard/project")}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-slate-200/90 bg-white px-4 py-3 text-sm font-black tracking-wide text-slate-800 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 shadow-sm dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:hover:bg-slate-900"
              >
                <FolderKanban className="h-4 w-4" />
                Projects
              </button>
              <button
                type="button"
                onClick={() => setShowCreateProject(true)}
                className="inline-flex items-center justify-center gap-2 rounded-sm scale-100 cursor-pointer border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-black tracking-wide text-white shadow-[0_10px_30px_-16px_rgba(15,23,42,0.75)] transition-all hover:-translate-y-0.5 hover:bg-slate-800 dark:border-white/10 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                <ArrowRight className="h-4 w-4" />
                Create project
              </button>
            </div>
          </div>
        </section>
    </div>
  )
}

export default WelcomeCard
