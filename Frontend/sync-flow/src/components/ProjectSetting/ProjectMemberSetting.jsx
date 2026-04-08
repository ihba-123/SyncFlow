import React from 'react'

const ProjectMemberSetting = ({ projectId, teamData, role, navigate, project }) => {
  return (
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 lg:col-span-2">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100">
              <Users className="h-5 w-5 text-sky-500" />
              Team & Access Settings
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage project members and invitation flow from one place.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Role</p>
                <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">{role || "Unknown"}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Members</p>
                <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">{teamData?.joined_members?.length || 0}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Pending Invites</p>
                <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">{teamData?.invites?.length || 0}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate(`/teams/${projectId}/Projectmembers`)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Open Team Members
              </button>
              {!project.is_solo && (
                <button
                  type="button"
                  onClick={() => navigate(`/projects/${projectId}/invite`)}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
                >
                  Open Invite Settings
                </button>
              )}
            </div>
          </div>
  )
}

export default ProjectMemberSetting
