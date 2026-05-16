import React from 'react'

export const BarChart = ({
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
  
  // Set max value and min value with some padding for the top
  let maxValue = Math.max(5, ...values);
  const minValue = 0; // Bar charts usually start at 0

  const chartWidth = 640;
  const chartHeight = 420;
  const left = 70;
  const right = 30;
  const top = 30;
  const bottom = 50;
  const innerWidth = chartWidth - left - right;
  const innerHeight = chartHeight - top - bottom;

  const hasData = pointCount > 0;

  // Calculate bar width dynamically with a max width constraint
  const barPadding = 12;
  const maxBarWidth = 40;
  const calculatedBarWidth = pointCount > 0 ? Math.min(maxBarWidth, (innerWidth / pointCount) - barPadding) : maxBarWidth;

  const xForIndex = (index) => {
    // Distribute bars evenly across the inner width
    const step = innerWidth / (pointCount || 1);
    // Center point for each step
    return left + (step * index) + (step / 2);
  };

  const yForValue = (value) => {
    const numericValue = Number(value) || 0;
    const normalized = (numericValue - minValue) / (maxValue - minValue || 1);
    return top + innerHeight - (normalized * innerHeight);
  };

  const yTicks = [
    minValue,
    Math.round((maxValue - minValue) * 0.25 + minValue),
    Math.round((maxValue - minValue) * 0.5 + minValue),
    Math.round((maxValue - minValue) * 0.75 + minValue),
    maxValue
  ].filter((value, index, array) => array.indexOf(value) === index);

  return (
    <div className="space-y-4">
      {hasData ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-950/50">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            <span>{title}</span>
            {primarySeries && (
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 dark:bg-white/5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: primarySeries.color || '#3b82f6' }} />
                {primarySeries.label}
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="min-w-full h-auto max-h-[300px] w-full">
              {/* Grid Lines */}
              {yTicks.map((tick) => {
                const y = yForValue(tick);
                return (
                  <g key={tick}>
                    <line x1={left} x2={chartWidth - right} y1={y} y2={y} stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" className="text-slate-500 dark:text-slate-400" />
                    <text x={left - 10} y={y + 4} textAnchor="end" className="fill-slate-500 text-[11px] dark:fill-slate-400">
                      {tick}
                    </text>
                  </g>
                );
              })}

              {/* X Axis Line */}
              <line x1={left} y1={chartHeight - bottom} x2={chartWidth - right} y2={chartHeight - bottom} stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-700" />

              {/* Bars */}
              {points.map((point, index) => {
                const centerX = xForIndex(index);
                const y = yForValue(point.value);
                const height = (chartHeight - bottom) - y;
                const x = centerX - (calculatedBarWidth / 2);
                
                return (
                  <g key={point.date || point.label || index}>
                    {/* Bar */}
                    <rect 
                      x={x} 
                      y={y} 
                      width={calculatedBarWidth} 
                      height={Math.max(0, height)} 
                      fill={primarySeries.color || "#3b82f6"} 
                      rx="4" 
                      ry="4"
                      className="transition-all duration-300 hover:opacity-80"
                    />
                    
                    {/* Value Label on top of bar (optional, removing for cleaner look but kept if needed) */}
                    {/* <text x={centerX} y={y - 6} textAnchor="middle" className="fill-slate-600 text-[10px] font-medium dark:fill-slate-300">
                      {point.value > 0 ? point.value : ''}
                    </text> */}
                    
                    {/* X Axis Label */}
                    <text x={centerX} y={chartHeight - bottom + 20} textAnchor="middle" className="fill-slate-500 text-[11px] dark:fill-slate-400">
                      {point.label}
                    </text>
                  </g>
                );
              })}

              {/* Axis Titles */}
              <text x={chartWidth / 2} y={chartHeight - 10} textAnchor="middle" className="fill-slate-600 text-[12px] font-semibold dark:fill-slate-300">
                {xLabel}
              </text>

              <g transform={`translate(${15}, ${chartHeight / 2}) rotate(-90)`}>
                <text textAnchor="middle" className="fill-slate-600 text-[12px] font-semibold dark:fill-slate-300">
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
