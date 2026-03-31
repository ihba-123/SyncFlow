import { useKanban } from "../../stores/KanbanContext";
import KanbanColumn from "./KanbanColumn";
import ProgressBar from "./ProgressBar";
import TaskModal from "./TaskModal";
import { DragDropContext } from "@hello-pangea/dnd";

export default function KanbanBoard() {
  const cols     = useKanban((s) => s.cols);
  const darkMode = useKanban((s) => s.darkMode);
  const moveTask = useKanban((s) => s.moveTask);

  const totalTasks = cols.reduce((s, c) => s + c.tasks.length, 0);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    // Dropped outside any droppable
    if (!destination) return;
    // Dropped back in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index       === destination.index
    ) return;

    moveTask(draggableId, source.droppableId, destination.droppableId, destination.index);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={[
        "h-full flex flex-col font-sans transition-colors duration-300 ",
        darkMode
          ? "bg-[#0f1117] text-slate-100"
          : "bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 text-slate-900",
      ].join(" ")}>

        {/* ── Top bar ──────────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between px-6 pt-5 pb-1
          flex-wrap gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500
              shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
            <h1 className={`text-lg font-semibold tracking-tight
              ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
              Kanban
            </h1>
          </div>
          <span className={`text-xs tabular-nums
            ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
            {totalTasks} task{totalTasks !== 1 ? "s" : ""} across {cols.length} columns
          </span>
        </header>

        {/* ── Progress bar ─────────────────────────────────────────────────── */}
        <ProgressBar />

        {/* ── Scrollable board ─────────────────────────────────────────────── */}
        {/*
          `overflow-x-auto overflow-y-hidden` on <main>:
            - Horizontal scroll for the columns row
            - Clips any accidental vertical overflow from child absolute elements
          `flex-1 min-h-0`:
            - Takes remaining vertical space
            - min-h-0 lets the flex child shrink below its content height
              (critical when KanbanBoard is inside a flex column parent)
        */}
        <main className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden px-6 pb-6 pt-3">
          {/*
            `w-max` — sizes to its children so the scroll container knows
            how far to scroll without needing min-w-max tricks.
            `h-full` — passes full height down to columns so they fill
            the available vertical space cleanly.
          */}
          <div className="flex gap-4 w-max h-full items-start">
            {cols.map((col) => (
              <KanbanColumn key={col.id} col={col} />
            ))}
          </div>
        </main>

        {/* ── Modal (portalled to top of z-stack) ──────────────────────────── */}
        <TaskModal />
      </div>
    </DragDropContext>
  );
}
