import { useKanban } from "../../stores/KanbanStore";
import { useMemo } from "react";

export default function ProgressBar({ tasks }) {
  // Get columns from store
  const cols = useKanban((s) => s.cols);
  const normalizeStatus = (status) => (status === "inprogress" ? "in_progress" : status);

  // If tasks are passed (from TanStack Query), build temporary cols
  const computedCols = useMemo(() => {
    if (!tasks) return cols;
    const colMap = { todo: [], in_progress: [], review: [], done: [] };
    tasks.forEach((task) => {
      const normalizedStatus = normalizeStatus(task.status);
      if (colMap[normalizedStatus]) colMap[normalizedStatus].push(task);
    });
    return Object.keys(colMap).map((key) => ({
      id: key,
      title: key === "in_progress" ? "In Progress" : key.charAt(0).toUpperCase() + key.slice(1),
      tasks: colMap[key].sort((a, b) => (a.order || "").localeCompare(b.order || "")),
    }));
  }, [tasks, cols]);

  // Calculate progress from flattened task statuses so drag updates reflect immediately.
  const allTasks = computedCols.flatMap((column) =>
    column.tasks.map((task) => ({ ...task, status: normalizeStatus(task.status || column.id) }))
  );
  const totalCount = allTasks.length;
  const completedCount = allTasks.filter((task) => task.status === "done").length;
  const progressPct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="px-6 pt-4 pb-2 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider select-none">
            Overall Progress
          </span>
          <span className="text-xs font-mono text-slate-600 dark:text-slate-500 tabular-nums">
            {completedCount}/{totalCount} tasks
          </span>
        </div>
        <span className="text-sm font-semibold font-mono text-indigo-400 tabular-nums">
          {progressPct}%
        </span>
      </div>

      {/* Track */}
      <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out will-change-[width]"
          style={{
            width: `${progressPct}%`,
            background: "linear-gradient(90deg, #4f46e5, #6c7fff, #a78bfa)",
          }}
        />
      </div>
    </div>
  );
}