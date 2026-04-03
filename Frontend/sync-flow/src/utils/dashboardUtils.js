export const STATUS_ORDER = ["todo", "in_progress", "inreview", "done"];
export const STATUS_LABELS = {
  todo: "To Do",
  in_progress: "In Progress",
  inprogress: "In Progress",
  inreview: "Review",
  done: "Done",
};

export const STATUS_COLORS = {
  todo: "#60a5fa",
  in_progress: "#f59e0b",
  inprogress: "#f59e0b",
  inreview: "#a855f7",
  done: "#10b981",
};

export const PRIORITY_ORDER = ["low", "medium", "high"];
export const PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const PRIORITY_COLORS = {
  low: "#38bdf8",
  medium: "#f59e0b",
  high: "#fb7185",
};

export const toNumber = (value) => Number(value) || 0;

const normalizeKey = (value) => {
  if (value === null || value === undefined) return "";
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
};

const getLabel = (key, fallback = "Unknown") =>
  STATUS_LABELS[key] || PRIORITY_LABELS[key] || fallback;

export const buildSeries = (items = [], order = [], colors = {}, labels = {}) => {
  const map = new Map();

  items.forEach((item) => {
    const rawKey = normalizeKey(
      item?.status ?? item?.priority ?? item?.name ?? item?.label,
    );
    const key = rawKey === "inprogress" ? "in_progress" : rawKey;
    const value = toNumber(item?.count ?? item?.task_count ?? item?.value ?? 0);

    if (!key) return;

    map.set(key, {
      key,
      value,
      label: labels[key] || getLabel(key, item?.label || item?.name || key),
      color: colors[key] || "#94a3b8",
    });
  });

  return order
    .map(
      (key) =>
        map.get(key) || {
          key,
          value: 0,
          label: labels[key] || getLabel(key, key),
          color: colors[key] || "#94a3b8",
        },
    )
    .filter(
      (item) =>
        item.value > 0 || items.length === 0 || order.includes(item.key),
    );
};

export const buildWorkloadSeries = (items = []) => {
  return items
    .map((item) => {
      const name =
        item?.assigned_to__email ||
        item?.assigned_to__name ||
        item?.assigned_to_name ||
        item?.name ||
        item?.label;
      const key = item?.assigned_to__id ?? name ?? "unassigned";
      const label = name || "Unassigned";

      return {
        key,
        label,
        value: toNumber(item?.task_count ?? item?.count ?? 0),
      };
    })
    .filter((item) => item.value > 0);
};

export const sumValues = (items = []) =>
  items.reduce((total, item) => total + toNumber(item?.value), 0);

export const buildConicGradient = (
  items = [],
  fallback = "rgba(148, 163, 184, 0.35)",
) => {
  const total = sumValues(items);
  if (!total) return `conic-gradient(${fallback} 0 100%)`;

  let start = 0;
  const segments = items.map((item) => {
    const share = (toNumber(item.value) / total) * 100;
    const end = start + share;
    const segment = `${item.color || fallback} ${start}% ${end}%`;
    start = end;
    return segment;
  });

  return `conic-gradient(${segments.join(", ")})`;
};

export const getDisplayName = (user) => {
  if (!user) return "there";
  return user.name || user.full_name || user.username || user.email || "there";
};
