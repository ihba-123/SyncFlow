import { ShieldCheck } from "lucide-react";
import { buildConicGradient } from "../../utils/dashboardUtils";

export function MetricCard({ icon: Icon, label, value, detail, accent = "#1392ec" }) {
  return (
    <div className="group relative overflow-hidden rounded-sm border border-white/60 bg-white/85 p-5 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
      <div className="absolute inset-0 pointer-events-none bg-linear-to-br from-white/70 via-transparent to-transparent dark:from-white/5" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {value}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {detail}
          </p>
        </div>
        <div
          className="rounded-2xl border border-white/70 p-3 shadow-sm dark:border-white/10"
          style={{
            background: `linear-gradient(135deg, ${accent}1f, ${accent}0d)`,
          }}
        >
          <Icon className="h-6 w-6" style={{ color: accent }} />
        </div>
      </div>
    </div>
  );
}

export function ChartPanel({ title, subtitle, children, icon: Icon }) {
  return (
    <section className="overflow-hidden rounded-sm border border-white/70 bg-white/85 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 px-5 py-4 dark:border-white/10 sm:px-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400">
            <Icon className="h-4 w-4" />
            <span>{title}</span>
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

export function DonutChart({ items, total, centerLabel, centerValue }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[220px_1fr] lg:items-center">
      <div className="flex items-center justify-center">
        <div
          className="relative h-[220px] w-[220px] rounded-full p-3"
          style={{ background: buildConicGradient(items) }}
        >
          <div className="absolute inset-10 flex flex-col items-center justify-center rounded-full bg-white text-center shadow-inner shadow-slate-900/10 dark:bg-slate-950 dark:shadow-black/40">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
              {centerLabel}
            </span>
            <span className="mt-2 text-4xl font-black text-slate-900 dark:text-white">
              {centerValue}
            </span>
            <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {total} tasks total
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item) => {
            const percent = total ? Math.round((item.value / total) * 100) : 0;
            return (
              <div key={item.key} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {item.label}
                  </span>
                  <span className="font-bold text-slate-500 dark:text-slate-400">
                    {item.value} ({percent}%)
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(percent, 2)}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            No data yet. Create tasks to populate this graph.
          </div>
        )}
      </div>
    </div>
  );
}


export function BarChart({ items, total, emptyLabel }) {
  return (
    <div className="space-y-4">
      {items.length > 0 ? (
        items.map((item) => {
          const percent = total ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={item.key} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {item.label}
                </span>
                <span className="font-bold text-slate-500 dark:text-slate-400">
                  {item.value}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.max(percent, 2)}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          {emptyLabel}
        </div>
      )}
    </div>
  );
}

export function LineChart({
  series = [],
  title = "Days",
  xLabel = "Days",
  yLabel = "Tasks",
  emptyLabel = "No trend data available yet.",
}) {
  const activeSeries = Array.isArray(series) ? series.filter((item) => item?.points?.length > 0) : [];
  const primarySeries = activeSeries[0];
  const points = primarySeries?.points || [];
  const pointCount = points.length;
  const values = points.map((point) => Number(point.value) || 0);
  const maxValue = Math.max(5, ...values);
  const minValue = Math.min(0, ...values);
  const chartWidth = 640;
  const chartHeight = 420;
  const left = 120;
  const right = 50;
  const top = 30;
  const bottom = 90;
  const innerWidth = chartWidth - left - right;
  const innerHeight = chartHeight - top - bottom;

  const hasData = pointCount > 0;

  const xForIndex = (index) =>
    pointCount > 1 ? left + (innerWidth * index) / (pointCount - 1) : left + innerWidth / 2;

  const yForValue = (value) => {
    const numericValue = Number(value) || 0;
    const normalized = (numericValue - minValue) / (maxValue - minValue || 1);
    return top + innerHeight - normalized * innerHeight;
  };

  const yTicks = [minValue, Math.round((maxValue - minValue) * 0.25 + minValue), Math.round((maxValue - minValue) * 0.5 + minValue), Math.round((maxValue - minValue) * 0.75 + minValue), maxValue].filter((value, index, array) => array.indexOf(value) === index);

  return (
    <div className="space-y-4">
      {hasData ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-950/50">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            <span>{title}</span>
            {primarySeries && (
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 dark:bg-white/5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: primarySeries.color }} />
                {primarySeries.label}
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="min-w-[640px] w-full h-[420px]">
              <defs>
                <marker id="axis-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                </marker>
              </defs>

              <line x1={left} y1={top} x2={left} y2={chartHeight - bottom + 8} stroke="currentColor" strokeWidth="3" markerEnd="url(#axis-arrow)" className="text-slate-900 dark:text-white" />
              <line x1={left} y1={chartHeight - bottom} x2={chartWidth - right + 8} y2={chartHeight - bottom} stroke="currentColor" strokeWidth="3" markerEnd="url(#axis-arrow)" className="text-slate-900 dark:text-white" />

              {yTicks.map((tick) => {
                const y = yForValue(tick);
                return (
                  <g key={tick}>
                    <line x1={left - 10} x2={chartWidth - right} y1={y} y2={y} stroke="currentColor" strokeOpacity="0.08" strokeWidth="1.5" />
                    <line x1={left - 8} x2={left + 8} y1={y} y2={y} stroke="currentColor" strokeWidth="2.5" className="text-slate-900 dark:text-white" />
                    <text x={left - 24} y={y + 5} textAnchor="end" className="fill-[#4b3629] text-[22px] font-bold dark:fill-slate-200">
                      {tick}
                    </text>
                  </g>
                );
              })}

              {points.length > 1 && (
                <polyline
                  points={points.map((point, index) => `${xForIndex(index)},${yForValue(point.value)}`).join(" ")}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {points.map((point, index) => {
                const x = xForIndex(index);
                const y = yForValue(point.value);
                const labelX = x;
                return (
                  <g key={point.date || point.label || index}>
                    <line x1={x} x2={x} y1={chartHeight - bottom} y2={chartHeight - bottom + 12} stroke="currentColor" strokeWidth="2.5" className="text-slate-900 dark:text-white" />
                    <text x={labelX} y={chartHeight - bottom + 40} textAnchor="middle" className="fill-[#4b3629] text-[20px] font-bold dark:fill-slate-200">
                      {point.label}
                    </text>
                    <circle cx={x} cy={y} r="8" fill="#3b82f6" />
                  </g>
                );
              })}

              <text x={chartWidth / 2} y={chartHeight - 18} textAnchor="middle" className="fill-[#111111] text-[26px] font-bold dark:fill-white">
                {xLabel}
              </text>

              <g transform={`translate(${28}, ${chartHeight / 2}) rotate(-90)`}>
                <text textAnchor="middle" className="fill-[#111111] text-[26px] font-bold dark:fill-white">
                  {yLabel}
                </text>
              </g>
            </svg>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          {emptyLabel}
        </div>
      )}
    </div>
  );
}

export function TeamLoadCard({ items, isSolo }) {
  if (isSolo) {
    return (
      <div className="space-y-4 rounded-sm border border-dashed border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          Solo project focus
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          This workspace is owned by one person, so the dashboard emphasizes
          progress, urgency, and delivery cadence instead of team balance.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-sm bg-white px-4 py-3 shadow-sm dark:bg-slate-950">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              Momentum
            </p>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              Live
            </p>
          </div>
          <div className="rounded-sm bg-white px-4 py-3 shadow-sm dark:bg-slate-950">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              Cadence
            </p>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              Focused
            </p>
          </div>
          <div className="rounded-sm bg-white px-4 py-3 shadow-sm dark:bg-slate-950">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              Owner
            </p>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              1
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.length > 0 ? (
        items.map((item, index) => {
          const color =
            index % 3 === 0
              ? "#38bdf8"
              : index % 3 === 1
                ? "#8b5cf6"
                : "#10b981";
          return (
            <div
              key={item.key}
              className="space-y-2 rounded-sm border border-slate-200/80 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-slate-900/50"
            >
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-semibold text-slate-700 dark:text-slate-200">
                  {item.label}
                </span>
                <span className="font-bold text-slate-500 dark:text-slate-400">
                  {item.value} tasks
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(item.value * 12, 10)}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          No assigned work yet.
        </div>
      )}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-32 rounded-3xl bg-white/70 dark:bg-white/5 animate-pulse" />
        <div className="h-32 rounded-3xl bg-white/70 dark:bg-white/5 animate-pulse" />
        <div className="h-32 rounded-3xl bg-white/70 dark:bg-white/5 animate-pulse" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-[420px] rounded-[28px] bg-white/70 dark:bg-white/5 animate-pulse" />
        <div className="h-[420px] rounded-[28px] bg-white/70 dark:bg-white/5 animate-pulse" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-[360px] rounded-[28px] bg-white/70 dark:bg-white/5 animate-pulse" />
        <div className="h-[360px] rounded-[28px] bg-white/70 dark:bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}
