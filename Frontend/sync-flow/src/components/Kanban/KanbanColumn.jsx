import { useKanban } from "../../stores/KanbanContext";
import TaskCard from "./TaskCard";
import { Droppable } from "@hello-pangea/dnd";

export default function KanbanColumn({ col }) {
  const { openCreate } = useKanban();

  return (
  
    <div className="flex flex-col w-[280px] min-w-[260px] rounded-2xl overflow-hidden
      bg-[#131929] border border-slate-700/40
      shadow-[0_4px_24px_rgba(0,0,0,0.5)]">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3.5
        border-b border-slate-700/40 flex-shrink-0 bg-[#131929]">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${col.accent}`} />
          <span className="text-sm font-semibold text-slate-200 truncate">{col.title}</span>
          <span className="text-[11px] font-mono bg-slate-800 text-slate-500
            px-2 py-0.5 rounded-full border border-slate-700/60 flex-shrink-0 tabular-nums">
            {col.tasks.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => openCreate(col.id)}
          aria-label={`Add task to ${col.title}`}
          className="w-7 h-7 ml-2 flex-shrink-0 rounded-lg flex items-center justify-center
            bg-slate-800 border border-slate-700/60 text-slate-400 text-base
            hover:bg-indigo-600 hover:border-indigo-600 hover:text-white
            transition-all duration-150 focus:outline-none focus:ring-2
            focus:ring-indigo-500/50"
        >
          +
        </button>
      </div>

      {/* ── Droppable card list ─────────────────────────────────────────────── */}
      <Droppable droppableId={col.id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={[
              // flex-1 + min-h-0 = takes remaining height without overflowing parent
              "flex-1 min-h-0 flex flex-col gap-2.5 p-3",
              "overflow-y-auto",
              "scrollbar-thin scrollbar-thumb-slate-700/70 scrollbar-track-transparent",
              "transition-colors duration-150",
              snapshot.isDraggingOver ? "bg-indigo-500/[0.04]" : "bg-transparent",
            ].join(" ")}
          >
            {col.tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                colId={col.id}
                index={index}
              />
            ))}

            {/* DnD placeholder — keeps column height stable while dragging */}
            {provided.placeholder}

            {/* Empty state */}
            {col.tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="border-2 border-dashed border-slate-700/30 rounded-xl
                min-h-[52px] flex items-center justify-center
                text-xs text-slate-700 select-none">
                No tasks yet
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
