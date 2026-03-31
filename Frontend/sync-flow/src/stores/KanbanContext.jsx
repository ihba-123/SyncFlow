import { create } from "zustand";

// ─── Tag Colors ────────────────────────────────────────────────────────────────
export const TAG_COLORS = [
  { bg: "bg-indigo-500/20",  text: "text-indigo-300",  border: "border-indigo-500/30"  },
  { bg: "bg-amber-500/20",   text: "text-amber-300",   border: "border-amber-500/30"   },
  { bg: "bg-violet-500/20",  text: "text-violet-300",  border: "border-violet-500/30"  },
  { bg: "bg-emerald-500/20", text: "text-emerald-300", border: "border-emerald-500/30" },
  { bg: "bg-rose-500/20",    text: "text-rose-300",    border: "border-rose-500/30"    },
  { bg: "bg-sky-500/20",     text: "text-sky-300",     border: "border-sky-500/30"     },
  { bg: "bg-orange-500/20",  text: "text-orange-300",  border: "border-orange-500/30"  },
];

export const getTagColor = (tag) => {
  let h = 0;
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) % TAG_COLORS.length;
  return TAG_COLORS[h];
};

// ─── Avatars ───────────────────────────────────────────────────────────────────
export const AVATARS = [
  { initials: "AJ", color: "bg-indigo-500" },
  { initials: "SK", color: "bg-violet-500" },
  { initials: "TR", color: "bg-emerald-500" },
  { initials: "ML", color: "bg-amber-500" },
];

// ─── Initial Data ──────────────────────────────────────────────────────────────
const INITIAL_COLS = [
  {
    id: "todo",
    title: "To Do",
    accent: "bg-indigo-500",
    accentText: "text-indigo-400",
    tasks: [
      { id: "t1", title: "Design system setup", desc: "Set up Figma tokens and component library", tags: ["design", "ui"], priority: "high", assignees: [0, 1], attachments: [{ name: "figma-tokens.pdf" }] },
      { id: "t2", title: "API schema review", desc: "Review and finalize REST endpoint contracts", tags: ["backend"], priority: "med", assignees: [2], attachments: [] },
      { id: "t3", title: "Write onboarding copy", desc: "Draft user-facing onboarding flow text", tags: ["content"], priority: "low", assignees: [3], attachments: [] },
    ],
  },
  {
    id: "inprog",
    title: "In Progress",
    accent: "bg-amber-500",
    accentText: "text-amber-400",
    tasks: [
      { id: "t4", title: "Auth flow implementation", desc: "OAuth2 login with Google and GitHub", tags: ["auth", "backend"], priority: "high", assignees: [0, 2], attachments: [{ name: "auth-spec.pdf" }, { name: "flow.png" }] },
      { id: "t5", title: "Dashboard redesign", desc: "Responsive dashboard with new layout system", tags: ["ui", "frontend"], priority: "high", assignees: [1], attachments: [{ name: "mockup-v2.png" }] },
    ],
  },
  {
    id: "review",
    title: "Review",
    accent: "bg-violet-500",
    accentText: "text-violet-400",
    tasks: [
      { id: "t6", title: "Performance audit", desc: "Lighthouse audit + bundle size analysis", tags: ["perf"], priority: "med", assignees: [2, 3], attachments: [{ name: "audit-report.pdf" }] },
      { id: "t7", title: "Accessibility pass", desc: "WCAG 2.1 AA compliance check", tags: ["a11y"], priority: "med", assignees: [1], attachments: [] },
    ],
  },
  {
    id: "done",
    title: "Completed",
    accent: "bg-emerald-500",
    accentText: "text-emerald-400",
    tasks: [
      { id: "t8", title: "CI/CD pipeline", desc: "GitHub Actions workflow for staging + prod", tags: ["devops"], priority: "low", assignees: [0], attachments: [] },
      { id: "t9", title: "Database migrations", desc: "Schema v2 migrations with rollback scripts", tags: ["backend", "db"], priority: "high", assignees: [2], attachments: [{ name: "migrations.sql" }] },
      { id: "t10", title: "Logo design", desc: "Final logo files in SVG and PNG formats", tags: ["design"], priority: "low", assignees: [3], attachments: [{ name: "logo-pack.zip" }] },
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
const uid = () => "t" + Date.now() + Math.random().toString(36).slice(2, 6);

// Deep-clone cols array (tasks are plain objects, no nested refs needed)
const cloneCols = (cols) => cols.map((c) => ({ ...c, tasks: [...c.tasks] }));

// ─── Derived selectors (use these in components for perf) ─────────────────────
export const selectAllTasks      = (s) => s.cols.flatMap((c) => c.tasks);
export const selectCompletedCount = (s) => s.cols.find((c) => c.id === "done")?.tasks.length ?? 0;
export const selectProgressPct   = (s) => {
  const total = s.cols.flatMap((c) => c.tasks).length;
  const done  = s.cols.find((c) => c.id === "done")?.tasks.length ?? 0;
  return total ? Math.round((done / total) * 100) : 0;
};

// ─── Store ─────────────────────────────────────────────────────────────────────
export const useKanban = create((set) => ({
  cols:     INITIAL_COLS,
  modal:    null, // { mode: 'create'|'edit'|'delete', colId, task? }
  darkMode: true,

  // ── Dark mode ──
  setDarkMode: (val) => set({ darkMode: val }),

  // ── Modals ──
  openCreate: (colId) =>
    set({ modal: { mode: "create", colId } }),

  openEdit: (task, colId) =>
    set({
      modal: {
        mode: "edit",
        colId,
        task: {
          ...task,
          tags:        [...task.tags],
          assignees:   [...task.assignees],
          attachments: [...task.attachments],
        },
      },
    }),

  openDelete: (task, colId) =>
    set({ modal: { mode: "delete", colId, task } }),

  closeModal: () => set({ modal: null }),

  // ── CRUD ──
  saveTask: (data, mode, taskId) =>
    set((state) => {
      const next = cloneCols(state.cols);

      if (mode === "create") {
        const col = next.find((c) => c.id === data.colId);
        if (col) col.tasks.push({ id: uid(), ...data });
      } else {
        // Remove from whichever column currently holds it
        const fromCol = next.find((c) => c.tasks.some((t) => t.id === taskId));
        if (fromCol) fromCol.tasks = fromCol.tasks.filter((t) => t.id !== taskId);
        // Insert into target column
        const toCol = next.find((c) => c.id === data.colId);
        if (toCol) toCol.tasks.push({ id: taskId, ...data });
      }

      return { cols: next, modal: null };
    }),

  deleteTask: (taskId, colId) =>
    set((state) => ({
      cols: state.cols.map((c) =>
        c.id === colId
          ? { ...c, tasks: c.tasks.filter((t) => t.id !== taskId) }
          : c
      ),
      modal: null,
    })),

  // FIX: now respects toIndex for same-column reorder AND cross-column moves
  moveTask: (taskId, fromColId, toColId, toIndex) =>
    set((state) => {
      const next     = cloneCols(state.cols);
      const fromCol  = next.find((c) => c.id === fromColId);
      const toCol    = next.find((c) => c.id === toColId);
      if (!fromCol || !toCol) return state;

      const fromIdx = fromCol.tasks.findIndex((t) => t.id === taskId);
      if (fromIdx === -1) return state;

      // Remove from source
      const [task] = fromCol.tasks.splice(fromIdx, 1);

      // Insert at destination index (clamp to valid range)
      const clampedIndex = Math.min(toIndex ?? toCol.tasks.length, toCol.tasks.length);
      toCol.tasks.splice(clampedIndex, 0, task);

      return { cols: next };
    }),
}));