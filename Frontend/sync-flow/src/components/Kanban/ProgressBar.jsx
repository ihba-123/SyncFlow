import { useKanban, selectProgressPct, selectCompletedCount } from "../../stores/KanbanContext";

export default function ProgressBar() {
  // Individual selectors → each only re-renders when its own value changes
  const progressPct     = useKanban(selectProgressPct);
  const completedCount  = useKanban(selectCompletedCount);
  const totalCount      = useKanban((s) => s.cols.flatMap((c) => c.tasks).length);

  return (
    <div className="px-6 pt-4 pb-2 flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider select-none">
            Overall Progress
          </span>
          <span className="text-xs font-mono text-slate-500 tabular-nums">
            {completedCount}/{totalCount} tasks
          </span>
        </div>
        <span className="text-sm font-semibold font-mono text-indigo-400 tabular-nums">
          {progressPct}%
        </span>
      </div>

      {/* Track */}
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out will-change-[width]"
          style={{
            width:      `${progressPct}%`,
            background: "linear-gradient(90deg, #4f46e5, #6c7fff, #a78bfa)",
          }}
        />
      </div>
    </div>
  );
}
