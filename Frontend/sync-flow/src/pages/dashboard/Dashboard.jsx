import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CircleDot,
  Clock3,
  FolderKanban,
  RefreshCw,
} from "lucide-react";
import { dashboardService } from "../../api/khanban_api";
import useProjectSocket from "../../hooks/useProjectSocket";
import { useActiveProjectStore } from "../../stores/ActiveProject";
import { CreateProject } from "../../features/project/CreateProject";
import {
  buildSeries,
  buildWorkloadSeries,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  PRIORITY_ORDER,
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_ORDER,
  sumValues,
  toNumber,
} from "../../utils/dashboardUtils";
import { ChartPanel } from "./DashboardSections";
import { DashboardSkeleton } from "../../components/skeleton/DashboardSkeleton";
import { LineChart } from "../../components/DashboardComponent/LineChart";
import MetricCards from "../../components/DashboardComponent/MetricCards";
import ChartComponent from "../../components/DashboardComponent/ChartComponent";
import ChartPanelComponent from "../../components/DashboardComponent/ChartPanelComponent";
import { useUserProfile } from "../../hooks/UserProfile";
import WelcomeCard from "../../components/DashboardComponent/WelcomeCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const activeProject = useActiveProjectStore((state) => state.activeProject);
  const projectId = activeProject?.id;
  const isSoloProject = !!activeProject?.is_solo;
  const [showCreateProject, setShowCreateProject] = useState(false);
  const data = useUserProfile((state) => state.name);
  useEffect(() => {
    if (!showCreateProject) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setShowCreateProject(false);
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [showCreateProject]);

  const dashboardQuery = useQuery({
    queryKey: ["project-dashboard", projectId],
    queryFn: () => dashboardService(projectId),
    enabled: Boolean(projectId),
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 30000,
    retry: 1,
  });

  useProjectSocket(projectId, (message) => {
    if (!message) return;
    if (
      message.type === "task_update" ||
      message.type === "activity_log" ||
      message.type === "project_update"
    ) {
      queryClient.invalidateQueries({
        queryKey: ["project-dashboard", projectId],
      });
    }
  });

  const stats = dashboardQuery.data || {};
  const statusSeries = useMemo(
    () =>
      buildSeries(
        stats.status_distribution || [],
        STATUS_ORDER,
        STATUS_COLORS,
        STATUS_LABELS,
      ),
    [stats.status_distribution],
  );
  const prioritySeries = useMemo(
    () =>
      buildSeries(
        stats.priority_distribution || [],
        PRIORITY_ORDER,
        PRIORITY_COLORS,
        PRIORITY_LABELS,
      ),
    [stats.priority_distribution],
  );
  const workloadSeries = useMemo(
    () => buildWorkloadSeries(stats.workload_distribution || []),
    [stats.workload_distribution],
  );

  const lineTrendSeries = useMemo(
    () => [
      {
        key: "completed",
        label: "Completed tasks",
        color: "#38bdf8",
        points: (stats.task_completion_trend_last_7_days || []).map((item) => ({
          date: item.date,
          label: item.label,
          value: item.value,
        })),
      },
    ],
    [stats.task_completion_trend_last_7_days],
  );

  const dashboardSummary = useMemo(() => {
    const totalTasks = sumValues(statusSeries);
    const doneTasks =
      statusSeries.find((item) => item.key === "done")?.value || 0;

    return {
      totalTasks,
      doneTasks,
      openTasks: Math.max(totalTasks - doneTasks, 0),
      progress: Math.round(toNumber(stats.total_progress)),
      highPriorityTasks:
        prioritySeries.find((item) => item.key === "high")?.value || 0,
      activeOwners: workloadSeries.length,
    };
  }, [
    prioritySeries,
    stats.total_progress,
    statusSeries,
    workloadSeries.length,
  ]);

  

  const summaryLine = isSoloProject
    ? "Personal delivery dashboard for one owner."
    : "Team delivery dashboard with live workload visibility.";

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#07111c] dark:text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.1),transparent_30%)]" />

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
     
    <WelcomeCard  
      name={data}
      summaryLine={summaryLine}
      projectId={projectId}
      activeProject={activeProject}
      dashboardQuery={dashboardQuery}
      isSoloProject={isSoloProject}
      navigate={navigate}
      setShowCreateProject={setShowCreateProject}
      data={data}
    />
        {/* //Shows different states: no project, loading, error, or the dashboard content */}
        {!projectId ? (
          <section className="rounded-sm border border-dashed border-slate-300/80 bg-white/80 p-8 text-center shadow-[0_18px_45px_-28px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-950/60">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <FolderKanban className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              No active project selected
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Pick a project from the Projects page to unlock charts, workload
              balance, and live progress tracking.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard/project")}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-black tracking-wide text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800 dark:border-white/10 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Go to projects
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => dashboardQuery.refetch()}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/90 bg-white px-4 py-3 text-sm font-black tracking-wide text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:hover:bg-slate-900"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </section>
        ) : dashboardQuery.isLoading ? (
          <DashboardSkeleton />
        ) : dashboardQuery.isError ? (
          <section className="rounded-4xl border border-rose-200 bg-rose-50/90 p-8 text-center text-rose-700 shadow-[0_18px_45px_-28px_rgba(225,29,72,0.35)] dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
            <p className="text-lg font-bold">
              Dashboard data could not be loaded.
            </p>
            <p className="mt-2 text-sm text-rose-600/80 dark:text-rose-200/80">
              Try again or open the project board to verify the project is still
              available.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => dashboardQuery.refetch()}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-black tracking-wide text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800 dark:border-white/10 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
              <button
                type="button"
                onClick={() => navigate(`/projects/${projectId}`)}
                className="inline-flex items-center gap-2 rounded-sm border border-slate-200/90 bg-white px-4 py-3 text-sm font-black tracking-wide text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:hover:bg-slate-900"
              >
                Open project
              </button>
            </div>
          </section>
        ) : (
          <>
            {/* // Passes the summary metrics to the MetricCards component for display */}
            <MetricCards
              dashboardSummary={dashboardSummary}
              totalTasks={dashboardSummary.totalTasks}
              progress={dashboardSummary.progress}
              doneTasks={dashboardSummary.doneTasks}
              velocity_last_7_days={stats.velocity_last_7_days}
              openTasks={dashboardSummary.openTasks}
              highPriorityTasks={dashboardSummary.highPriorityTasks}
            />

            {/* // Passes the chart data and summary to the ChartComponent for rendering the charts and live snapshot */}
            <ChartComponent
              dashboardSummary={dashboardSummary}
              dashboardQuery={dashboardQuery}
              totalTasks={dashboardSummary.totalTasks}
              progress={dashboardSummary.progress}
              doneTasks={dashboardSummary.doneTasks}
              velocity_last_7_days={stats.velocity_last_7_days}
              openTasks={dashboardSummary.openTasks}
              statusSeries={statusSeries}
              highPriorityTasks={dashboardSummary.highPriorityTasks}
              summaryLine={summaryLine}
              activeOwners={dashboardSummary.activeOwners}
            />

            {/* // Renders the priority mix and team load charts using the ChartPanelComponent */}
            <ChartPanelComponent
              prioritySeries={prioritySeries}
              workloadSeries={workloadSeries}
              isSoloProject={isSoloProject}
            />

            {/* // Renders the activity trend line chart using the ChartPanel component and LineChart */}
            <section className="grid gap-6 xl:grid-cols-1">
              <ChartPanel
                title="Activity trend"
                subtitle="Daily completed tasks for the last 7 days."
                icon={Activity}
              >
                <LineChart
                  series={lineTrendSeries}
                  title="Activity trend"
                  xLabel="Days"
                  yLabel="Tasks"
                  emptyLabel="No activity trend data available yet."
                />
              </ChartPanel>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-sm border border-white/70 bg-white/85 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                  <Clock3 className="h-4 w-4 text-sky-500" />
                  Real-time updates
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  The dashboard refreshes automatically and listens to project
                  websocket events so task movement and project changes appear
                  quickly.
                </p>
              </div>
              <div className="rounded-sm border border-white/70 bg-white/85 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                  <CircleDot className="h-4 w-4 text-emerald-500" />
                  Project mode
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {isSoloProject
                    ? "Solo mode keeps the interface focused on delivery and personal throughput."
                    : "Team mode emphasizes collaboration, ownership, and workload balance."}
                </p>
              </div>
              <div className="rounded-sm border border-white/70 bg-white/85 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                  <RefreshCw className="h-4 w-4 text-violet-500" />
                  Sync health
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {dashboardQuery.isFetching
                    ? "Fetching the latest snapshot now."
                    : "Snapshot is stable and ready for live updates."}
                </p>
              </div>
            </section>
          </>
        )}
      </main>

      {showCreateProject && (
        <div
          className="fixed inset-0 flex items-center justify-center px-4 py-6"
          style={{ zIndex: 120 }}
        >
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-xl"
            onClick={() => setShowCreateProject(false)}
          />
          <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CreateProject
              embedded
              onClose={() => setShowCreateProject(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
