import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleDot,
  Clock3,
  FolderKanban,
  Gauge,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users2,
} from "lucide-react";
import { dashboardService } from "../../api/khanban_api";
import useProjectSocket from "../../hooks/useProjectSocket";
import { useAuthStore } from "../../stores/AuthStore";
import { useActiveProjectStore } from "../../stores/ActiveProject";
import { CreateProject } from "../../features/project/CreateProject";

const STATUS_ORDER = ["todo", "in_progress", "inreview", "done"];
const STATUS_LABELS = {
  todo: "To Do",
  in_progress: "In Progress",
  inprogress: "In Progress",
  inreview: "Review",
  done: "Done",
};

const STATUS_COLORS = {
  todo: "#60a5fa",
  in_progress: "#f59e0b",
  inprogress: "#f59e0b",
  inreview: "#a855f7",
  done: "#10b981",
};

const PRIORITY_ORDER = ["low", "medium", "high"];
const PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const PRIORITY_COLORS = {
  low: "#38bdf8",
  medium: "#f59e0b",
  high: "#fb7185",
};

const toNumber = (value) => Number(value) || 0;

const normalizeKey = (value) => {
  if (value === null || value === undefined) return "";
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
};

const getLabel = (key, fallback = "Unknown") =>
  STATUS_LABELS[key] || PRIORITY_LABELS[key] || fallback;

const buildSeries = (items = [], order = [], colors = {}, labels = {}) => {
  const map = new Map();

  items.forEach((item) => {
    const rawKey = normalizeKey(
      item?.status ?? item?.priority ?? item?.name ?? item?.label,
    );
    const key = rawKey === "inprogress" ? "in_progress" : rawKey;
    const value = toNumber(item?.count ?? item?.task_count ?? item?.value ?? 0);

    if (!key) return;

    map.set(key, {
      key,
      value,
      label: labels[key] || getLabel(key, item?.label || item?.name || key),
      color: colors[key] || "#94a3b8",
    });
  });

  return order
    .map(
      (key) =>
        map.get(key) || {
          key,
          value: 0,
          label: labels[key] || getLabel(key, key),
          color: colors[key] || "#94a3b8",
        },
    )
    .filter(
      (item) =>
        item.value > 0 || items.length === 0 || order.includes(item.key),
    );
};

const buildWorkloadSeries = (items = []) => {
  return items
    .map((item) => {
      const name =
        item?.assigned_to__email ||
        item?.assigned_to__name ||
        item?.assigned_to_name ||
        item?.name ||
        item?.label;
      const key = item?.assigned_to__id ?? name ?? "unassigned";
      const label = name || "Unassigned";

      return {
        key,
        label,
        value: toNumber(item?.task_count ?? item?.count ?? 0),
      };
    })
    .filter((item) => item.value > 0);
};

const sumValues = (items = []) =>
  items.reduce((total, item) => total + toNumber(item?.value), 0);

const buildConicGradient = (
  items = [],
  fallback = "rgba(148, 163, 184, 0.35)",
) => {
  const total = sumValues(items);
  if (!total) return `conic-gradient(${fallback} 0 100%)`;

  let start = 0;
  const segments = items.map((item) => {
    const share = (toNumber(item.value) / total) * 100;
    const end = start + share;
    const segment = `${item.color || fallback} ${start}% ${end}%`;
    start = end;
    return segment;
  });

  return `conic-gradient(${segments.join(", ")})`;
};

const getDisplayName = (user) => {
  if (!user) return "there";
  return user.name || user.full_name || user.username || user.email || "there";
};

function MetricCard({ icon: Icon, label, value, detail, accent = "#1392ec" }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/85 p-5 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
      <div className="absolute inset-0 pointer-events-none bg-linear-to-br from-white/70 via-transparent to-transparent dark:from-white/5" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {value}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {detail}
          </p>
        </div>
        <div
          className="rounded-2xl border border-white/70 p-3 shadow-sm dark:border-white/10"
          style={{
            background: `linear-gradient(135deg, ${accent}1f, ${accent}0d)`,
          }}
        >
          <Icon className="h-6 w-6" style={{ color: accent }} />
        </div>
      </div>
    </div>
  );
}

function ChartPanel({ title, subtitle, children, icon: Icon }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 px-5 py-4 dark:border-white/10 sm:px-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400">
            <Icon className="h-4 w-4" />
            <span>{title}</span>
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function DonutChart({ items, total, centerLabel, centerValue }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[220px_1fr] lg:items-center">
      <div className="flex items-center justify-center">
        <div
          className="relative h-[220px] w-[220px] rounded-full p-3"
          style={{ background: buildConicGradient(items) }}
        >
          <div className="absolute inset-10 flex flex-col items-center justify-center rounded-full bg-white text-center shadow-inner shadow-slate-900/10 dark:bg-slate-950 dark:shadow-black/40">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
              {centerLabel}
            </span>
            <span className="mt-2 text-4xl font-black text-slate-900 dark:text-white">
              {centerValue}
            </span>
            <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {total} tasks total
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item) => {
            const percent = total ? Math.round((item.value / total) * 100) : 0;
            return (
              <div key={item.key} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {item.label}
                  </span>
                  <span className="font-bold text-slate-500 dark:text-slate-400">
                    {item.value} ({percent}%)
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(percent, 2)}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            No data yet. Create tasks to populate this graph.
          </div>
        )}
      </div>
    </div>
  );
}

function BarChart({ items, total, emptyLabel }) {
  return (
    <div className="space-y-4">
      {items.length > 0 ? (
        items.map((item) => {
          const percent = total ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={item.key} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {item.label}
                </span>
                <span className="font-bold text-slate-500 dark:text-slate-400">
                  {item.value}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.max(percent, 2)}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          {emptyLabel}
        </div>
      )}
    </div>
  );
}

function TeamLoadCard({ items, isSolo }) {
  if (isSolo) {
    return (
      <div className="space-y-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          Solo project focus
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          This workspace is owned by one person, so the dashboard emphasizes
          progress, urgency, and delivery cadence instead of team balance.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-slate-950">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              Momentum
            </p>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              Live
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-slate-950">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              Cadence
            </p>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              Focused
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-slate-950">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              Owner
            </p>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              1
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.length > 0 ? (
        items.map((item, index) => {
          const color =
            index % 3 === 0
              ? "#38bdf8"
              : index % 3 === 1
                ? "#8b5cf6"
                : "#10b981";
          return (
            <div
              key={item.key}
              className="space-y-2 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-slate-900/50"
            >
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-semibold text-slate-700 dark:text-slate-200">
                  {item.label}
                </span>
                <span className="font-bold text-slate-500 dark:text-slate-400">
                  {item.value} tasks
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(item.value * 12, 10)}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          No assigned work yet.
        </div>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-32 rounded-3xl bg-white/70 dark:bg-white/5 animate-pulse" />
        <div className="h-32 rounded-3xl bg-white/70 dark:bg-white/5 animate-pulse" />
        <div className="h-32 rounded-3xl bg-white/70 dark:bg-white/5 animate-pulse" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-[420px] rounded-[28px] bg-white/70 dark:bg-white/5 animate-pulse" />
        <div className="h-[420px] rounded-[28px] bg-white/70 dark:bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const activeProject = useActiveProjectStore((state) => state.activeProject);
  const user = useAuthStore((state) => state.user);
  const projectId = activeProject?.id;
  const isSoloProject = !!activeProject?.is_solo;
  const [showCreateProject, setShowCreateProject] = useState(false);

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
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 2000,
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

  const totalTasks = sumValues(statusSeries);
  const doneTasks =
    statusSeries.find((item) => item.key === "done")?.value || 0;
  const openTasks = Math.max(totalTasks - doneTasks, 0);
  const progress = Math.round(toNumber(stats.total_progress));
  const highPriorityTasks =
    prioritySeries.find((item) => item.key === "high")?.value || 0;
  const activeOwners = workloadSeries.length;
  const displayName = getDisplayName(user);

  const summaryLine = isSoloProject
    ? "Personal delivery dashboard for one owner."
    : "Team delivery dashboard with live workload visibility.";

  const heroAccent = isSoloProject ? "#0ea5e9" : "#8b5cf6";

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#07111c] dark:text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.1),transparent_30%)]" />

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="rounded-4xl border border-white/70 bg-white/85 p-5 shadow-[0_22px_55px_-34px_rgba(15,23,42,0.55)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                <Sparkles className="h-3.5 w-3.5" />
                Live workspace dashboard
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
                  Welcome back, {displayName}
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
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-emerald-600 dark:text-emerald-300">
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
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200/90 bg-white px-4 py-3 text-sm font-black tracking-wide text-slate-800 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 shadow-sm dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:hover:bg-slate-900"
              >
                <FolderKanban className="h-4 w-4" />
                Projects
              </button>
              <button
                type="button"
                onClick={() => setShowCreateProject(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-black tracking-wide text-white shadow-[0_10px_30px_-16px_rgba(15,23,42,0.75)] transition-all hover:-translate-y-0.5 hover:bg-slate-800 dark:border-white/10 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                <ArrowRight className="h-4 w-4" />
                Create project
              </button>
            </div>
          </div>
        </section>

        {!projectId ? (
          <section className="rounded-4xl border border-dashed border-slate-300/80 bg-white/80 p-8 text-center shadow-[0_18px_45px_-28px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-950/60">
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
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/90 bg-white px-4 py-3 text-sm font-black tracking-wide text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:hover:bg-slate-900"
              >
                Open project
              </button>
            </div>
          </section>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                value={toNumber(stats.velocity_last_7_days)}
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

            <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
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
                  <div className="rounded-3xl border border-slate-200/80 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/50">
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

            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <ChartPanel
                title="Priority mix"
                subtitle="Where the board needs attention right now."
                icon={Sparkles}
              >
                <BarChart
                  items={prioritySeries}
                  total={sumValues(prioritySeries)}
                  emptyLabel="No priority data available yet."
                />
              </ChartPanel>

              <ChartPanel
                title={isSoloProject ? "Solo focus" : "Team load"}
                subtitle={
                  isSoloProject
                    ? "A compact overview for single-owner projects."
                    : "Distribution of assigned work across contributors."
                }
                icon={isSoloProject ? ShieldCheck : Users2}
              >
                <TeamLoadCard items={workloadSeries} isSolo={isSoloProject} />
              </ChartPanel>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
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
              <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
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
              <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
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
