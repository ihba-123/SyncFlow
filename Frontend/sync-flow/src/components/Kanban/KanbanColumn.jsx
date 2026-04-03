import { memo } from "react";
import { useKanban } from "../../stores/KanbanStore";
import TaskCard from "./TaskCard";
import { Droppable } from "@hello-pangea/dnd";

function KanbanColumn({ col }) {
  const openCreate = useKanban((s) => s.openCreate);

  return (
    <div
      className="flex flex-col w-[280px] min-w-[260px] rounded-2xl overflow-hidden
      bg-white border border-slate-200
      h-[58vh] min-h-[420px] max-h-[700px]
      sm:h-[60vh] sm:min-h-[460px]
      lg:h-[62vh] lg:min-h-[500px]
      dark:bg-[#131929] dark:border-slate-700/40
      shadow-[0_4px_18px_rgba(15,23,42,0.12)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3.5
        border-b border-slate-200 shrink-0 bg-white
        dark:border-slate-700/40 dark:bg-[#131929]"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/*  SAFE accent fallback */}
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${col.accent || "bg-slate-500"}`}
          />

          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
            {col.title}
          </span>

          <span
            className="text-[11px] font-mono px-2 py-0.5 rounded-full border
            border-slate-300/70 bg-white/70 text-slate-600
            dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700/60 shrink-0 tabular-nums"
          >
            {col.tasks.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => openCreate(col.id)}
          className="w-7 h-7 ml-2 shrink-0 rounded-lg flex items-center justify-center
            bg-slate-100 border border-slate-300 text-slate-600
            dark:bg-slate-800 dark:border-slate-700/60 dark:text-slate-400
            hover:bg-indigo-600 hover:text-white transition-all"
        >
          +
        </button>
      </div>

      {/* Droppable */}
      <Droppable droppableId={col.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={[
              "flex-1 min-h-0 flex flex-col gap-2.5 p-3 overflow-y-auto pr-1",
              snapshot.isDraggingOver ? "bg-indigo-100/70 dark:bg-indigo-500/10" : "",
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

            {provided.placeholder}

            {/* Empty state */}
            {col.tasks.length === 0 && !snapshot.isDraggingOver && (
              <div
                className="border-2 border-dashed border-slate-700/30 rounded-xl
                min-h-[52px] flex items-center justify-center
                text-xs text-slate-500 dark:text-slate-700"
              >
                No tasks yet
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default memo(KanbanColumn);
