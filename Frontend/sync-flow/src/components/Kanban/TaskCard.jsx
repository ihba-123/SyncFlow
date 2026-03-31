import { useKanban, AVATARS, getTagColor } from "../../stores/KanbanContext";
import { Draggable } from "@hello-pangea/dnd";

const PRIORITY_MAP = {
  high: { label: "High", classes: "bg-rose-500/15 text-rose-300 border border-rose-500/25" },
  med:  { label: "Med",  classes: "bg-amber-500/15 text-amber-300 border border-amber-500/25" },
  low:  { label: "Low",  classes: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25" },
};

export default function TaskCard({ task, colId, index }) {
  const { openEdit, openDelete } = useKanban();
  const priority = PRIORITY_MAP[task.priority] ?? PRIORITY_MAP.low;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={[
            // Base — fully opaque so it never composites against a white parent
            "group/card relative rounded-xl p-3.5",
            "bg-[#1e2640] border border-slate-700/50",
            "cursor-grab active:cursor-grabbing",
            "transition-all duration-150",
            // Hover — only border/shadow change, bg stays opaque
            "hover:border-indigo-500/40",
            "hover:shadow-[0_2px_12px_rgba(0,0,0,0.4)]",
            // Dragging — ring highlight, elevated shadow, no bg change
            snapshot.isDragging
              ? "ring-2 ring-indigo-500/70 shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 rotate-[0.5deg]"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {/* Edit / Delete — appear on hover (large), always visible on small) */}
{/* Edit / Delete — visible on screens < xl, hover on xl+ */}
<div
  className="absolute top-2.5 right-2.5 flex gap-1
             opacity-100 xl:opacity-0 xl:group-hover/card:opacity-100
             transition-opacity duration-100"
>
  <button
    onClick={(e) => { e.stopPropagation(); openEdit(task, colId); }}
    className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-400
               hover:bg-indigo-500 hover:text-white transition-all
               flex items-center justify-center text-xs"
    title="Edit task"
    aria-label="Edit task"
  >
    ✎
  </button>
  <button
    onClick={(e) => { e.stopPropagation(); openDelete(task, colId); }}
    className="w-6 h-6 rounded-md bg-rose-500/20 text-rose-400
               hover:bg-rose-500 hover:text-white transition-all
               flex items-center justify-center text-xs"
    title="Delete task"
    aria-label="Delete task"
  >
    ✕
  </button>
</div>

          {/* Title */}
          <p className="text-sm font-medium text-slate-200 leading-snug pr-14 mb-1.5">
            {task.title}
          </p>

          {/* Description */}
          {task.desc && (
            <p className="text-xs text-slate-500 leading-relaxed mb-2.5 line-clamp-2">
              {task.desc}
            </p>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2.5">
              {task.tags.map((t) => {
                const c = getTagColor(t);
                return (
                  <span
                    key={t}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono
                      border ${c.bg} ${c.text} ${c.border}`}
                  >
                    {t}
                  </span>
                );
              })}
            </div>
          )}

          {/* Footer: priority + attachments + avatars */}
          <div className="flex items-center justify-between gap-2 flex-wrap mt-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold
                uppercase tracking-wide ${priority.classes}`}>
                {priority.label}
              </span>
              {task.attachments.length > 0 && (
                <span className="text-[10px] text-slate-600 flex items-center gap-0.5"
                  title={`${task.attachments.length} attachment${task.attachments.length > 1 ? "s" : ""}`}>
                  📎 {task.attachments.length}
                </span>
              )}
            </div>

            {task.assignees.length > 0 && (
              <div className="flex -space-x-1.5" role="list" aria-label="Assignees">
                {task.assignees.map((idx) => (
                  <div
                    key={idx}
                    role="listitem"
                    className={`w-5 h-5 rounded-full ${AVATARS[idx].color}
                      border-2 border-[#1e2640]
                      flex items-center justify-center text-white font-bold`}
                    style={{ fontSize: 8 }}
                    title={AVATARS[idx].initials}
                  >
                    {AVATARS[idx].initials}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
