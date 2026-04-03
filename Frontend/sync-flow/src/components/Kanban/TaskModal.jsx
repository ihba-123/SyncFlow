import { useState, useEffect, useRef, useCallback } from "react";
import { useKanban } from "../../stores/KanbanStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { khanbanService, attachmentService } from "../../api/khanban_api";
import AttachmentUploader from "./AttachmentUploader";
import { useActiveProjectStore } from "../../stores/ActiveProject";

const PRIORITY_OPTIONS = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const EMPTY_FORM = {
  title: "",
  description: "",
  colId: "", // Stores backend status slug (todo, in_progress, review, done)
  priority: "medium",
  tags: [],
  assignees: [],
  attachments: [],
};

const normalizeStatus = (status) => (status === "inprogress" ? "in_progress" : status);

export default function TaskModal() {
  const activeProject = useActiveProjectStore((s) => s.activeProject);
  const project_id = activeProject?.id;
  const { modal, cols, closeModal, setCols, upsertTaskFromServer } = useKanban();

  const isCreate = modal?.mode === "create";
  const isEdit = modal?.mode === "edit";
  const isDelete = modal?.mode === "delete";
  const task = modal?.task;

  const [form, setForm] = useState(EMPTY_FORM);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmitLockedRef = useRef(false);
  const titleRef = useRef(null);
  const queryClient = useQueryClient();

  // ── Initialize form ────────────────────────────────────
  useEffect(() => {
    if (!modal) return;

    if (isCreate) {
      setForm({ ...EMPTY_FORM, colId: modal.colId });
    } else if (isEdit && task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        colId: task.status || modal.colId,
        priority: task.priority || "medium",
        tags: Array.isArray(task.tags) ? task.tags : (task.tags?.split(",") || []),
        assignees: task.assigned_to ? [task.assigned_to] : [],
        attachments: [...(task.attachments || [])],
      });
    }

    const t = setTimeout(() => titleRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [modal, isCreate, isEdit, task]);

  const setField = useCallback(
    (key, val) =>
      setForm((f) => ({
        ...f,
        [key]: typeof val === "function" ? val(f[key]) : val,
      })),
    []
  );

  // ── Helper: Upload logic ───────────────────────────────
  const handleUploads = async (taskId) => {
    const newFiles = form.attachments.filter((att) => att.file);
    if (newFiles.length === 0) return [];

    const uploaded = await Promise.all(
      newFiles.map((att) => attachmentService(taskId, project_id, att.file))
    );

    return uploaded.filter(Boolean);
  };

  const buildOptimisticAttachments = () => {
    return (form.attachments || []).map((att) => {
      if (!att?.file) return att;

      const fileType = att.file.name?.includes(".")
        ? att.file.name.split(".").pop().toLowerCase()
        : "file";

      return {
        ...att,
        name: att.file.name,
        file_name: att.file.name,
        file_type: fileType,
        url: URL.createObjectURL(att.file),
        is_uploading: true,
      };
    });
  };

  // ── Mutations ──────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (data) => khanbanService.createTask(project_id, data),
    onSuccess: async (newTask) => {
      const optimisticTask = {
        ...newTask,
        attachments: buildOptimisticAttachments(),
      };

      // Show task immediately (including pending attachment previews).
      upsertTaskFromServer(optimisticTask);
      queryClient.setQueryData(["tasks", project_id], (oldTasks = []) => {
        const exists = oldTasks.some((t) => t.id === optimisticTask.id);
        if (exists) {
          return oldTasks.map((t) => (t.id === optimisticTask.id ? optimisticTask : t));
        }
        return [...oldTasks, optimisticTask];
      });

      closeModal();

      // Upload in background, then refresh canonical server payload.
      await handleUploads(newTask.id);
      queryClient.invalidateQueries({ queryKey: ["tasks", project_id] });
    },
    onError: (err) => console.error("Create Error:", err.response?.data)
  });

  const updateMutation = useMutation({
    mutationFn: ({ taskId, data }) => khanbanService.updateTask(project_id, taskId, data),
    onSuccess: async (updatedTask) => {
      upsertTaskFromServer(updatedTask);
      await handleUploads(updatedTask.id);
      queryClient.invalidateQueries({ queryKey: ["tasks", project_id] });
      closeModal();
    },
    onError: (err) => console.error("Update Error:", err.response?.data)
  });

  const deleteMutation = useMutation({
    mutationFn: (taskId) => khanbanService.deleteTask(project_id, taskId),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries(["tasks", project_id]);

      const previousTasks = queryClient.getQueryData(["tasks", project_id]);
      const previousCols = useKanban.getState().cols;

      queryClient.setQueryData(["tasks", project_id], (oldTasks = []) =>
        oldTasks.filter((task) => task.id !== taskId)
      );

      useKanban.setState((state) => ({
        cols: state.cols.map((column) => ({
          ...column,
          tasks: column.tasks.filter((task) => task.id !== taskId),
        })),
      }));

      return { previousTasks, previousCols };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", project_id]);
      closeModal();
    },
    onError: (_err, _taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", project_id], context.previousTasks);
      }
      if (context?.previousCols) {
        setCols(context.previousCols);
      }
    },
  });

  // ── Submit handler ──────────────────────────────────────
  const handleSubmit = async () => {
    if (isSubmitLockedRef.current) return;

    if (!form.title.trim()) {
      titleRef.current?.focus();
      return;
    }

    isSubmitLockedRef.current = true;
    setIsSubmitting(true);

    // MAP FIELDS TO SERIALIZER EXPECTATIONS
    const cleanData = {
      title: form.title.trim(),
      description: form.description,
      status: normalizeStatus(form.colId),
      priority: form.priority,
      // If your model tags are a string, join them. If they are a relation, map IDs.
      tags: form.tags.join(","), 
      assigned_to: form.assignees[0] || null,
    };

    try {
      if (isCreate) {
        await createMutation.mutateAsync(cleanData);
      } else if (isEdit && task?.id) {
        await updateMutation.mutateAsync({ taskId: task.id, data: cleanData });
      }
    } finally {
      isSubmitLockedRef.current = false;
      setIsSubmitting(false);
    }
  };

  if (!modal) return null;

  // ── UI (Simplified for brevity, keep your styling) ──────
  return (
    <Backdrop onClose={closeModal}>
      <ModalBox maxW={isDelete ? "max-w-sm" : "max-w-md"}>
        <ModalHeader title={isDelete ? "Delete Task" : (isCreate ? "New Task" : "Edit Task")} onClose={closeModal} />
        
        {!isDelete ? (
          <div className="px-5 py-4 space-y-4 overflow-y-auto max-h-[65vh]">
            <Field label="Title">
              <input ref={titleRef} value={form.title} onChange={e => setField("title", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Description">
              <textarea value={form.description} onChange={e => setField("description", e.target.value)} rows={3} className={`${inputCls} resize-none`} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Column">
                <select
    value={form.colId}
    onChange={(e) => setField("colId", e.target.value)}
    className={inputCls}
  >
    {cols.map((c) => (
      <option key={c.id} value={c.id}>
        {c.title}
      </option>
    ))}
  </select>
              </Field>
              <Field label="Priority">
                <select value={form.priority} onChange={e => setField("priority", e.target.value)} className={inputCls}>
                  {PRIORITY_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Attachments">
              <AttachmentUploader attachments={form.attachments} onChange={atts => setField("attachments", atts)} />
            </Field>
          </div>
        ) : (
          <div className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
            Confirm deletion of "{task?.title}"?
          </div>
        )}

        <ModalFooter>
          <GhostButton onClick={closeModal}>Cancel</GhostButton>
          <button
            onClick={isDelete ? () => deleteMutation.mutate(task.id) : handleSubmit}
            disabled={
              isSubmitting ||
              createMutation.isPending ||
              updateMutation.isPending ||
              deleteMutation.isPending
            }
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${isDelete ? 'bg-rose-500' : 'bg-indigo-600'}`}
          >
            {isDelete
              ? (deleteMutation.isPending ? "Deleting..." : "Delete")
              : (isSubmitting || createMutation.isPending || updateMutation.isPending)
                ? (isCreate ? "Creating..." : "Saving...")
                : (isCreate ? "Create Task" : "Save Changes")}
          </button>
        </ModalFooter>
      </ModalBox>
    </Backdrop>
  );
}

// ... (Keep your shared UI components Backdrop, ModalBox, etc. at the bottom)

// ─── Shared UI Components ───────────────────────────────
function Backdrop({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {children}
    </div>
  );
}
function ModalBox({ children, maxW = "max-w-md" }) {
  return (
    <div className={`w-full ${maxW} bg-white border border-slate-200 dark:bg-[#131929] dark:border-slate-700/60 rounded-2xl flex flex-col`}>
      {children}
    </div>
  );
}
function ModalHeader({ title, onClose }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700/50">
      <span className="font-semibold text-slate-900 dark:text-slate-100">{title}</span>
      <button
        onClick={onClose}
        className="w-7 h-7 bg-slate-100 text-slate-600 border border-slate-300 rounded-lg hover:bg-rose-500 hover:text-white hover:border-rose-500 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
      >
        ✕
      </button>
    </div>
  );
}
function ModalFooter({ children }) {
  return (
    <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-200 dark:border-slate-700/50">
      {children}
    </div>
  );
}
function GhostButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
    >
      {children}
    </button>
  );
}
function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">{label}</label>
      {children}
    </div>
  );
}
const inputCls =
  "w-full bg-white border border-slate-300 rounded-lg text-slate-900 text-sm px-3 py-2.5 outline-none focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200";