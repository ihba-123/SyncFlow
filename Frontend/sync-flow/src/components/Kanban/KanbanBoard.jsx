import { useEffect, useMemo, useRef, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useKanban } from "../../stores/KanbanStore";
import { khanbanService } from "../../api/khanban_api";
import { useKanbanSocket } from "../../hooks/useKanbanSocket";
import { useActiveProjectStore } from "../../stores/ActiveProject";
import { useThemeStore } from "../../stores/ThemeStore";
import KanbanColumn from "./KanbanColumn";
import ProgressBar from "./ProgressBar";
import TaskModal from "./TaskModal";

const getColsSignature = (columns) => {
  if (!Array.isArray(columns)) return "";
  return columns
    .map((col) => {
      const taskSig = (col.tasks || [])
        .map((task) => `${task.id}:${task.status || ""}:${task.order || ""}`)
        .join("|");
      return `${col.id}[${taskSig}]`;
    })
    .join(";");
};

export default function KanbanBoard() {
  const queryClient = useQueryClient();
  const activeProject = useActiveProjectStore((s) => s.activeProject);
  const project_id = activeProject?.id;
  const cols = useKanban((s) => s.cols);
  const setCols = useKanban((s) => s.setCols);
  const markPendingTask = useKanban((s) => s.markPendingTask);
  const clearPendingTask = useKanban((s) => s.clearPendingTask);
  const upsertTaskFromServer = useKanban((s) => s.upsertTaskFromServer);
  const buildColsFromTasks = useKanban((s) => s.buildColsFromTasks);
  const reorderTaskLocal = useKanban((s) => s.reorderTask);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [assignedFilter, setAssignedFilter] = useState("");
  const lastColsSignatureRef = useRef("");
  // Socket
  useKanbanSocket();

  const isSoloProject = activeProject?.is_solo === true;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const filters = useMemo(() => {
    const nextFilters = {};
    if (debouncedSearch) nextFilters.search = debouncedSearch;
    if (statusFilter) nextFilters.status = statusFilter;
    if (priorityFilter) nextFilters.priority = priorityFilter;
    if (!isSoloProject && assignedFilter) nextFilters.assigned_to = assignedFilter;
    return nextFilters;
  }, [debouncedSearch, statusFilter, priorityFilter, assignedFilter, isSoloProject]);

  const tasksQueryKey = useMemo(
    () => ["tasks", project_id, filters],
    [project_id, filters]
  );

  // ── FETCH TASKS ─────────────────────────────
  const { data: tasks = [], isLoading, isFetching } = useQuery({
    queryKey: tasksQueryKey,
    queryFn: () => khanbanService.getTasks(project_id, filters),
    enabled: !!project_id,
    placeholderData: (prev) => prev,
  });

  // Reset board immediately when switching project to avoid stale cross-project cards.
  useEffect(() => {
    lastColsSignatureRef.current = "";
    setCols([]);
    setAssignedFilter("");
  }, [project_id, setCols]);

  // Always rebuild grouped columns from server result (including filtered results).
  useEffect(() => {
    if (!isLoading) {
      const newCols = buildColsFromTasks(tasks);
      const nextSignature = getColsSignature(newCols);
      if (lastColsSignatureRef.current !== nextSignature) {
        setCols(newCols);
        lastColsSignatureRef.current = nextSignature;
      }
    }
  }, [tasks, isLoading, buildColsFromTasks, setCols]);

  const assigneeOptions = useMemo(() => {
    if (isSoloProject) return [];

    const seen = new Set();
    const options = [];

    tasks.forEach((task) => {
      const assigned = task?.assigned_to;
      if (!assigned) return;

      const id =
        typeof assigned === "object"
          ? String(assigned.id ?? assigned.user_id ?? assigned.pk ?? "")
          : String(assigned);

      if (!id || seen.has(id)) return;
      seen.add(id);

      const label =
        typeof assigned === "object"
          ? assigned.name || assigned.username || assigned.email || `User ${id}`
          : `User ${id}`;

      options.push({ value: id, label });
    });

    return options.sort((a, b) => a.label.localeCompare(b.label));
  }, [tasks, isSoloProject]);


  // ── REORDER MUTATION ───────────────────────
 // In KanbanBoard.js
const reorderMutation = useMutation({
  mutationFn: ({ taskId, payload }) =>
    khanbanService.reorderTask(project_id, taskId, payload),
  onSuccess: (updatedTask) => {
    upsertTaskFromServer(updatedTask);
    queryClient.setQueryData(tasksQueryKey, (oldTasks) => {
      if (!oldTasks) return [updatedTask];
      return oldTasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    });
  },
  onError: (err, variables) => {
    console.error("Reorder failed:", err);
    if (variables?.previousCols) {
      setCols(variables.previousCols);
    }
    if (variables?.taskId) {
      clearPendingTask(variables.taskId);
    }
  },
  onSettled: (_data, _error, variables) => {
    if (variables?.taskId) {
      clearPendingTask(variables.taskId);
    }
    queryClient.invalidateQueries({ queryKey: ["tasks", project_id] });
  },
},);

  // ── DRAG END ───────────────────────────────
  const onDragEnd = (result) => {
  const { draggableId, destination, source } = result;
  if (!destination) return;
  if (source.droppableId === destination.droppableId && source.index === destination.index) return;

  const previousCols = useKanban.getState().cols;

  // Optimistic UI (immediate move)
  const moved = reorderTaskLocal(draggableId, source.droppableId, destination.droppableId, destination.index);
  if (!moved) return;
  markPendingTask(draggableId);

  // Backend call
  const state = useKanban.getState();
  const destCol = state.cols.find(c => c.id === destination.droppableId);
  if (!destCol) return;

  const movedIndex = destCol.tasks.findIndex((t) => String(t.id) === String(draggableId));
  const prevTask = movedIndex > 0 ? destCol.tasks[movedIndex - 1] : null;
  const nextTask = movedIndex >= 0 && movedIndex < destCol.tasks.length - 1
    ? destCol.tasks[movedIndex + 1]
    : null;

  const payload = { status: destination.droppableId };
  if (prevTask) payload.prev_task_id = prevTask.id;
  if (nextTask) payload.next_task_id = nextTask.id;

  reorderMutation.mutate({ taskId: draggableId, payload, previousCols });
};

  if (isLoading) return <div className="p-10 text-slate-700 dark:text-slate-300">Loading Board...</div>;

  const totalTasks = tasks.length;
  const hasActiveFilters = Boolean(
    debouncedSearch || statusFilter || priorityFilter || (!isSoloProject && assignedFilter)
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-full min-h-0 flex flex-col font-sans bg-linear-to-br from-slate-100 via-white to-indigo-100/50 text-slate-900 dark:from-[#0b1120] dark:via-[#0f172a] dark:to-[#131a32] dark:text-slate-100 transition-colors duration-200">
        <header className="flex items-center justify-between px-6 pt-5 pb-1 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <h1 className="text-lg font-semibold">Kanban Board</h1>
          </div>
          <span className="text-xs text-slate-600 dark:text-slate-300">
            {totalTasks} task{totalTasks !== 1 ? "s" : ""} across {cols.length} columns
          </span>
        </header>

        <div className="px-6 pb-2 pt-1">
          <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-slate-200 bg-white/80 p-2.5 dark:border-slate-700/70 dark:bg-slate-900/50">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search tasks by title or description..."
              className="min-w-[220px] flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {!isSoloProject && (
              <select
                value={assignedFilter}
                onChange={(e) => setAssignedFilter(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="">All Assignees</option>
                {assigneeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setDebouncedSearch("");
                  setStatusFilter("");
                  setPriorityFilter("");
                  setAssignedFilter("");
                }}
                className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Clear
              </button>
            )}
          </div>
          {isFetching && !isLoading && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Updating filtered tasks...</p>
          )}
        </div>

        <ProgressBar />

        <main className="kanban-x-scroll flex-1 min-h-0 overflow-x-auto overflow-y-hidden px-6 pb-6 pt-3">
          {totalTasks === 0 && (
            <div className="mb-3 rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-2 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-300">
              {hasActiveFilters
                ? "No tasks match your current filters. Clear filters or add a task using a column + button."
                : "No tasks yet. Use the + button in any column to create your first task."}
            </div>
          )}

          <div className="flex h-full min-h-0 gap-4 w-max items-stretch">
            {cols.map((col) => (
              <KanbanColumn key={col.id} col={col} />
            ))}
          </div>
        </main>

        <TaskModal />
      </div>
    </DragDropContext>
  );
}