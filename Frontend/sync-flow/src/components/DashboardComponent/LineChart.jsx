import React from 'react'

export const LineChart = ({
  series = [],
  title = "Days",
  xLabel = "Days",
  yLabel = "Tasks",
  emptyLabel = "No trend data available yet.",
}) => {
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
