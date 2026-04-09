import { ShieldCheck } from "lucide-react";
import { buildConicGradient } from "../../utils/dashboardUtils";
import { LineChart } from "../../components/DashboardComponent/LineChart";

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

// Line chart component
<LineChart/>




