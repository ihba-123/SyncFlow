import { create } from "zustand";
import { khanbanService } from "../api/khanban_api";

const normalizeTaskForStore = (task) => ({
  ...task,
  attachments: Array.isArray(task?.attachments)
    ? task.attachments
    : Array.isArray(task?.files)
      ? task.files
      : [],
});

export const useKanban = create((set, get) => ({
  // ── COLUMNS STATE ──
  // Each column has an id, title, and tasks array
  cols: [
    { id: "todo", title: "To Do", tasks: [] },
    { id: "in_progress", title: "In Progress", tasks: [] },
    { id: "review", title: "Review", tasks: [] },
    { id: "done", title: "Done", tasks: [] },
  ],

  // ── MODAL STATE ──
  // modal: null -> no modal, otherwise contains { mode, colId, task? }
  modal: null,

  // ── DRAG-AND-DROP STATE ──
  draggingTaskId: null, // id of the task currently being dragged
  hoverColId: null,     // id of the column currently hovered
  hoverIndex: null,     // index of the position hovered in that column
  pendingTaskIds: new Set(),

  // ── MODAL ACTIONS ──
  openCreate: (colId) => set({ modal: { mode: "create", colId } }), // Open create task modal
  openEdit: (task, colId) => set({ modal: { mode: "edit", colId, task } }), // Open edit task modal
  openDelete: (task, colId) => set({ modal: { mode: "delete", colId, task } }), // Open delete modal
  closeModal: () => set({ modal: null }), // Close any modal

  // ── DRAG ACTIONS ──
  startDragging: (taskId) => set({ draggingTaskId: taskId }), // Begin dragging a task
  setHover: (colId, index) => set({ hoverColId: colId, hoverIndex: index }), // Track hover position
  clearHover: () => set({ hoverColId: null, hoverIndex: null }), // Clear hover state
  endDragging: () => set({ draggingTaskId: null, hoverColId: null, hoverIndex: null }), // Stop dragging
  markPendingTask: (taskId) => set((state) => {
    const nextPendingTaskIds = new Set(state.pendingTaskIds);
    nextPendingTaskIds.add(String(taskId));
    return { pendingTaskIds: nextPendingTaskIds };
  }),
  clearPendingTask: (taskId) => set((state) => {
    const nextPendingTaskIds = new Set(state.pendingTaskIds);
    nextPendingTaskIds.delete(String(taskId));
    return { pendingTaskIds: nextPendingTaskIds };
  }),
  isPendingTask: (taskId) => get().pendingTaskIds.has(String(taskId)),

  // ── COLUMN UPDATES ──
  setCols: (newCols) => set({ cols: newCols }), // Directly replace all columns (useful for reordering)

  // Upsert a server task into the correct column without remounting the board.
  upsertTaskFromServer: (updatedTask) => {
    set((state) => {
      const normalizedTask = normalizeTaskForStore(updatedTask);
      const nextCols = state.cols.map((c) => ({
        ...c,
        tasks: c.tasks.filter((t) => t.id !== normalizedTask.id),
      }));

      // Delete payloads only carry id + deleted flag; removing from all columns is enough.
      if (normalizedTask.deleted === true) {
        return { cols: nextCols };
      }

      if (!normalizedTask.status) {
        return { cols: nextCols };
      }

      const targetCol = nextCols.find((c) => c.id === normalizedTask.status);
      if (!targetCol) return { cols: nextCols };

      targetCol.tasks = [...targetCol.tasks, normalizedTask].sort((a, b) =>
        (a.order || "").localeCompare(b.order || "")
      );

      return { cols: nextCols };
    });
  },

  // ── SAVE TASK (CREATE / EDIT) ──
  saveTask: async (project_id, taskData, mode, taskId = null) => {
    try {
      if (mode === "create") {
        // Call API to create new task
        const newTask = await khanbanService.createTask(project_id, taskData);

        // Add new task to correct column
        set((state) => ({
          cols: state.cols.map((c) =>
            c.id === newTask.status
              ? { ...c, tasks: [...c.tasks, newTask].sort((a, b) => (a.order || "").localeCompare(b.order || "")) }
              : c
          ),
        }));
      } else if (mode === "edit") {
        // Call API to update existing task
        const updatedTask = await khanbanService.updateTask(project_id, taskId, taskData);

        // Replace task in its column
        set((state) => ({
          cols: state.cols.map((c) => ({
            ...c,
            tasks: c.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)).sort((a, b) => (a.order || "").localeCompare(b.order || "")),
          })),
        }));
      }
      get().closeModal(); // Close modal after success
    } catch (err) {
      console.error("Error saving task:", err);
    }
  },

  // ── DELETE TASK ──
  deleteTask: async (project_id, taskId, colId) => {
    try {
      await khanbanService.deleteTask(project_id, taskId);

      // Remove task from whichever column still contains it.
      set((state) => ({
        cols: state.cols.map((c) => ({
          ...c,
          tasks: c.tasks.filter((t) => t.id !== taskId),
        })),
      }));
      get().closeModal(); // Close modal after deletion
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  },

  // ── BUILD COLUMNS FROM RAW TASKS ──
  // Converts flat task list from backend into columns with sorted order
  buildColsFromTasks: (tasks) => {
    const colsMap = { todo: [], in_progress: [], review: [], done: [] };

    tasks.forEach((task) => {
      const normalizedTask = normalizeTaskForStore(task);
      const normalizedStatus = normalizedTask.status === "inprogress" ? "in_progress" : normalizedTask.status;
      if (colsMap[normalizedStatus]) colsMap[normalizedStatus].push(normalizedTask);
    });

    // Return array of columns sorted by task order (fractional ordering)
    return Object.keys(colsMap).map((key) => ({
      id: key,
      title: key === "in_progress" ? "In Progress" : key.charAt(0).toUpperCase() + key.slice(1),
      tasks: colsMap[key].sort((a, b) => (a.order || "").localeCompare(b.order || "")),
    }));
  },

  // ── REORDER TASKS OPTIMISTICALLY ──
  // Pure local update used by DnD for immediate, flicker-free movement.
  reorderTask: (taskId, fromColId, toColId, toIndex) => {
    const state = get();
    const fromCol = state.cols.find((c) => c.id === fromColId);
    const toCol = state.cols.find((c) => c.id === toColId);
    if (!fromCol || !toCol) return false;

    const normalizedTaskId = String(taskId);
    const fromIndex = fromCol.tasks.findIndex((t) => String(t.id) === normalizedTaskId);
    if (fromIndex < 0) return false;

    const task = fromCol.tasks[fromIndex];
    const movedTask = { ...task, status: toColId };

    const newFromTasks = [...fromCol.tasks];
    newFromTasks.splice(fromIndex, 1);

    const baseToTasks = fromColId === toColId ? newFromTasks : [...toCol.tasks];
    const boundedIndex = Math.max(0, Math.min(toIndex, baseToTasks.length));
    const newToTasks = [...baseToTasks];
    newToTasks.splice(boundedIndex, 0, movedTask);

    set((s) => ({
      cols: s.cols.map((c) => {
        if (c.id === fromColId && fromColId === toColId) {
          return { ...c, tasks: newToTasks };
        }
        if (c.id === fromColId) return { ...c, tasks: newFromTasks };
        if (c.id === toColId) return { ...c, tasks: newToTasks };
        return c;
      }),
    }));

    return true;
  },
  
}));

