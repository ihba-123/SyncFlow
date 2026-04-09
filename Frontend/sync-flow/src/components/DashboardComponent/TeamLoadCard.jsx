import { ShieldCheck } from 'lucide-react';
import React from 'react'

export const TeamLoadCard = ({ items, isSolo }) => {
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
