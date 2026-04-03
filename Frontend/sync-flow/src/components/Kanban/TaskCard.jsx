import { memo } from "react";
import { useKanban } from "../../stores/KanbanStore";
import { Draggable } from "@hello-pangea/dnd";

const getTagColor = (tag) => {
  const colors = [
    "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    "bg-amber-500/10 text-amber-300 border-amber-500/20",
    "bg-rose-500/10 text-rose-300 border-rose-500/20",
  ];
  const index = tag.length % colors.length;
  const [bg, text, border] = colors[index].split(" ");
  return { bg, text, border };
};

const PRIORITY_MAP = {
  high: {
    label: "High",
    classes: "bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/25",
  },
  medium: {
    label: "Medium",
    classes: "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/25",
  },
  low: {
    label: "Low",
    classes: "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25",
  },
};

const STATUS_MAP = {
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "avif"]);

const getAttachmentName = (attachment) =>
  attachment?.name || attachment?.file_name || "file";

const getAttachmentUrl = (attachment) =>
  attachment?.url || attachment?.file || null;

const getAttachmentExt = (attachment) => {
  const name = getAttachmentName(attachment);
  if (!name.includes(".")) return "FILE";
  return name.split(".").pop().toUpperCase();
};

const isImageAttachment = (attachment) => {
  const type = (attachment?.file_type || "").toLowerCase();
  if (IMAGE_EXTENSIONS.has(type)) return true;
  const name = getAttachmentName(attachment);
  const ext = name.includes(".") ? name.split(".").pop().toLowerCase() : "";
  return IMAGE_EXTENSIONS.has(ext);
};

const getStatusLabel = (status) => STATUS_MAP[status] || "Todo";

function TaskCard({ task, colId, index }) {
  const openEdit = useKanban((s) => s.openEdit);
  const openDelete = useKanban((s) => s.openDelete);

  const priority = PRIORITY_MAP[(task.priority || "low").toLowerCase()] ?? PRIORITY_MAP.low;
  const statusLabel = getStatusLabel(task.status);
  const attachments = Array.isArray(task.attachments) ? task.attachments.filter(Boolean) : [];
  const previewAttachments = attachments.slice(0, 2);

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          className={[
            "group relative rounded-xl p-3 sm:p-3.5 bg-white border border-slate-200 dark:bg-[#1e2640] dark:border-slate-700/50",
            "cursor-grab active:cursor-grabbing select-none will-change-transform",
            snapshot.isDragging
              ? "ring-2 ring-indigo-500 z-50 transition-none"
              : "transition-[box-shadow,border-color,background-color,opacity] duration-150",
          ].join(" ")}
        >
          {/* Edit/Delete */}
          <div className="absolute top-2 right-2 flex gap-1 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEdit(task, colId);
              }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500/20 text-indigo-500 hover:bg-indigo-500 hover:text-white dark:text-indigo-300"
            >
              ✎
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openDelete(task, colId);
              }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white dark:text-rose-300"
            >
              ✕
            </button>
          </div>

          {/* Title */}
          <p className="pr-12 text-sm font-semibold leading-snug text-slate-800 dark:text-slate-200 wrap-break-word">
            {task.title}
          </p>

          {/* Description */}
          {task.description && (
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Tags */}
          {Array.isArray(task.tags) && task.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {task.tags.map((t, idx) => {
                const c = getTagColor(t);
                return (
                  <span
                    key={`${t}-${idx}`}
                    className={`max-w-full truncate text-[10px] px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}
                  >
                    {t}
                  </span>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center rounded-full border border-slate-300/80 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-slate-700 dark:border-slate-700/70 dark:bg-slate-800/80 dark:text-slate-300">
                {statusLabel}
              </span>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${priority.classes}`}>
                {priority.label}
              </span>
            </div>
            {attachments.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-300/80 bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:border-slate-700/70 dark:bg-slate-800/70 dark:text-slate-300">
                <span>Attachments</span>
                <span>{attachments.length}</span>
              </span>
            )}
          </div>

          {attachments.length > 0 && (
            <div className="mt-2 rounded-lg border border-slate-200/80 bg-slate-50/70 p-2 dark:border-slate-700/70 dark:bg-slate-900/40">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Files
              </p>
              <div className="grid grid-cols-1 gap-1.5">
              {previewAttachments.map((attachment, idx) => {
                const name = getAttachmentName(attachment);
                const url = getAttachmentUrl(attachment);
                const isImage = isImageAttachment(attachment);
                const ext = getAttachmentExt(attachment);
                if (!url) {
                  return (
                    <div
                      key={`${name}-${idx}`}
                      className="flex items-center gap-2 rounded-md border border-slate-200/80 bg-white/80 px-2 py-1.5 text-[11px] text-slate-600 dark:border-slate-700/70 dark:bg-slate-800/70 dark:text-slate-300"
                    >
                      <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        {ext}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{name}</span>
                    </div>
                  );
                }

                return isImage ? (
                  <a
                    key={`${name}-${idx}`}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="block overflow-hidden rounded-lg border border-slate-300/70 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/70"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={url}
                      alt={name}
                      loading="lazy"
                      className="h-20 w-full object-cover"
                    />
                    <div className="truncate border-t border-slate-200/80 px-2 py-1 text-[11px] text-slate-600 dark:border-slate-700/70 dark:text-slate-300">
                      {name}
                    </div>
                  </a>
                ) : (
                  <a
                    key={`${name}-${idx}`}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-md border border-slate-200/80 bg-white/80 px-2 py-1.5 text-[11px] text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700/70 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-700/70"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                      {ext}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{name}</span>
                  </a>
                );
              })}
              </div>
              {attachments.length > previewAttachments.length && (
                <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                  +{attachments.length - previewAttachments.length} more attachment{attachments.length - previewAttachments.length > 1 ? "s" : ""}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default memo(TaskCard, (prevProps, nextProps) => {
  const prevTask = prevProps.task;
  const nextTask = nextProps.task;

  return (
    prevProps.index === nextProps.index &&
    prevProps.colId === nextProps.colId &&
    prevTask.id === nextTask.id &&
    prevTask.title === nextTask.title &&
    prevTask.description === nextTask.description &&
    prevTask.priority === nextTask.priority &&
    prevTask.status === nextTask.status &&
    prevTask.order === nextTask.order &&
    JSON.stringify(prevTask.tags ?? []) === JSON.stringify(nextTask.tags ?? []) &&
    JSON.stringify(prevTask.attachments ?? []) === JSON.stringify(nextTask.attachments ?? [])
  );
});