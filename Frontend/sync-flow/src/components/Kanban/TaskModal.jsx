import { useState, useEffect, useRef, useCallback } from "react";
import { useKanban, AVATARS, getTagColor } from "../../stores/KanbanContext";
import AttachmentUploader from "./AttachmentUploader";

// ─── Constants ─────────────────────────────────────────────────────────────────
const PRIORITY_OPTIONS = [
  { value: "high",  label: "High",   classes: "bg-rose-500/20 text-rose-300 border-rose-500/30"    },
  { value: "med",   label: "Medium", classes: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  { value: "low",   label: "Low",    classes: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
];

const EMPTY_FORM = {
  title:       "",
  desc:        "",
  colId:       "",
  priority:    "med",
  tags:        [],
  assignees:   [],
  attachments: [],
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function TaskModal() {
  const modal      = useKanban((s) => s.modal);
  const cols       = useKanban((s) => s.cols);
  const closeModal = useKanban((s) => s.closeModal);
  const saveTask   = useKanban((s) => s.saveTask);
  const deleteTask = useKanban((s) => s.deleteTask);

  const isCreate = modal?.mode === "create";
  const isEdit   = modal?.mode === "edit";
  const isDelete = modal?.mode === "delete";
  const task     = modal?.task;

  const [form, setForm]         = useState(EMPTY_FORM);
  const [tagInput, setTagInput] = useState("");
  const titleRef                = useRef(null);

  /*
    FIX: dep array includes modal?.mode and modal?.task?.id (primitives),
    not the entire `modal` object. This prevents stale-closure bugs where the
    effect re-runs on unrelated modal state changes.
  */
  useEffect(() => {
    if (!modal) return;

    if (isCreate) {
      setForm({ ...EMPTY_FORM, colId: modal.colId });
    } else if (isEdit && task) {
      setForm({
        title:       task.title,
        desc:        task.desc ?? "",
        colId:       modal.colId,
        priority:    task.priority,
        tags:        [...task.tags],
        assignees:   [...task.assignees],
        attachments: [...task.attachments],
      });
    }

    setTagInput("");
    // Small delay so the modal animation completes before stealing focus
    const t = setTimeout(() => titleRef.current?.focus(), 100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal?.mode, modal?.task?.id, modal?.colId]);

  // Keyboard: Escape closes
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeModal(); };
    if (modal) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal, closeModal]);

  const setField = useCallback((key, val) => setForm((f) => ({ ...f, [key]: val })), []);

  const addTag = useCallback(() => {
    const v = tagInput.trim().toLowerCase();
    if (!v) return;
    setForm((f) => ({ ...f, tags: f.tags.includes(v) ? f.tags : [...f.tags, v] }));
    setTagInput("");
  }, [tagInput]);

  const removeTag = useCallback(
    (t) => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) })),
    []
  );

  const toggleAssignee = useCallback((i) => {
    setForm((f) => ({
      ...f,
      assignees: f.assignees.includes(i)
        ? f.assignees.filter((x) => x !== i)
        : [...f.assignees, i],
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!form.title.trim()) {
      titleRef.current?.focus();
      return;
    }
    if (isCreate) saveTask(form, "create", null);
    else          saveTask(form, "edit",   task.id);
  }, [form, isCreate, saveTask, task?.id]);

  if (!modal) return null;

  // ── Delete confirmation ────────────────────────────────────────────────────
  if (isDelete) {
    return (
      <Backdrop onClose={closeModal}>
        <ModalBox maxW="max-w-sm">
          <ModalHeader title="Delete task" onClose={closeModal} />
          <p className="px-5 py-4 text-sm text-slate-400 leading-relaxed">
            Are you sure you want to delete{" "}
            <strong className="text-slate-200 font-medium">"{task?.title}"</strong>?{" "}
            This action cannot be undone.
          </p>
          <ModalFooter>
            <GhostButton onClick={closeModal}>Cancel</GhostButton>
            <button
              type="button"
              onClick={() => deleteTask(task.id, modal.colId)}
              className="px-4 py-2 rounded-lg text-sm font-medium
                bg-rose-500 hover:bg-rose-600 text-white transition-colors"
            >
              Delete task
            </button>
          </ModalFooter>
        </ModalBox>
      </Backdrop>
    );
  }

  // ── Create / Edit form ─────────────────────────────────────────────────────
  return (
    <Backdrop onClose={closeModal}>
      <ModalBox maxW="max-w-md">
        <ModalHeader title={isCreate ? "New task" : "Edit task"} onClose={closeModal} />

        <div className="px-5 py-4 space-y-4 overflow-y-auto max-h-[65vh]
          scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">

          {/* Title */}
          <Field label="Title">
            <input
              ref={titleRef}
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Task title…"
              className={inputCls}
              autoComplete="off"
            />
          </Field>

          {/* Description */}
          <Field label="Description">
            <textarea
              value={form.desc}
              onChange={(e) => setField("desc", e.target.value)}
              placeholder="Add a description…"
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </Field>

          {/* Column + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Column">
              <select
                value={form.colId}
                onChange={(e) => setField("colId", e.target.value)}
                className={inputCls}
              >
                {cols.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </Field>
            <Field label="Priority">
              <select
                value={form.priority}
                onChange={(e) => setField("priority", e.target.value)}
                className={inputCls}
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Tags */}
          <Field label="Tags">
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="Type a tag…"
                className={`${inputCls} flex-1`}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-slate-700 hover:bg-indigo-600
                  border border-slate-600 hover:border-indigo-600
                  text-slate-300 hover:text-white rounded-lg text-sm transition-colors"
              >
                Add
              </button>
            </div>

            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tags.map((t) => {
                  const c = getTagColor(t);
                  return (
                    <span key={t} className={`inline-flex items-center gap-1 text-xs px-2.5 py-1
                      rounded-full border font-mono ${c.bg} ${c.text} ${c.border}`}>
                      {t}
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        aria-label={`Remove tag ${t}`}
                        className="opacity-60 hover:opacity-100 ml-0.5 focus:outline-none"
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </Field>

          {/* Assignees */}
          <Field label="Assignees">
            <div className="flex flex-wrap gap-2">
              {AVATARS.map((av, i) => {
                const active = form.assignees.includes(i);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleAssignee(i)}
                    aria-pressed={active}
                    className={[
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs",
                      "transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/40",
                      active
                        ? "border-indigo-500 bg-indigo-500/15 text-slate-200"
                        : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500",
                    ].join(" ")}
                  >
                    <span
                      className={`w-5 h-5 rounded-full ${av.color} flex items-center
                        justify-center text-white font-bold flex-shrink-0`}
                      style={{ fontSize: 9 }}
                      aria-hidden="true"
                    >
                      {av.initials}
                    </span>
                    {av.initials}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Attachments */}
          <Field label="Attachments">
            <AttachmentUploader
              attachments={form.attachments}
              onChange={(atts) => setField("attachments", atts)}
            />
          </Field>
        </div>

        <ModalFooter>
          <GhostButton onClick={closeModal}>Cancel</GhostButton>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg text-sm font-medium
              bg-indigo-600 hover:bg-indigo-500 text-white
              transition-all hover:-translate-y-px active:scale-95 duration-100
              focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            {isCreate ? "Create task" : "Save changes"}
          </button>
        </ModalFooter>
      </ModalBox>
    </Backdrop>
  );
}

// ─── Shared sub-components ─────────────────────────────────────────────────────

function Backdrop({ children, onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4
        bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {children}
    </div>
  );
}

function ModalBox({ children, maxW = "max-w-md" }) {
  return (
    <div className={`w-full ${maxW} bg-[#131929] border border-slate-700/60
      rounded-2xl shadow-2xl animate-slideUp flex flex-col`}>
      {children}
    </div>
  );
}

function ModalHeader({ title, onClose }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
      <span className="font-semibold text-slate-100">{title}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close modal"
        className="w-7 h-7 flex items-center justify-center rounded-lg
          bg-slate-800 text-slate-400
          hover:bg-rose-500 hover:text-white
          transition-all text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
      >
        ✕
      </button>
    </div>
  );
}

function ModalFooter({ children }) {
  return (
    <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-700/50">
      {children}
    </div>
  );
}

function GhostButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 rounded-lg text-sm font-medium
        bg-slate-800 border border-slate-700
        text-slate-400 hover:text-slate-200 hover:bg-slate-700
        transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500/40"
    >
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider select-none">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-slate-800 border border-slate-700 rounded-lg " +
  "text-slate-200 text-sm px-3 py-2.5 " +
  "placeholder:text-slate-600 outline-none " +
  "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 " +
  "transition-colors";
