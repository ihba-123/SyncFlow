const PulseLine = ({ className = "" }) => (
  <div
    className={`h-3 rounded-full bg-slate-300/70 dark:bg-slate-700/80 ${className}`}
  />
);

const PulseCard = ({ className = "", children }) => (
  <div
    className={`animate-pulse rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.5)] backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/55 ${className}`}
  >
    {children}
  </div>
);

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <PulseCard key={`metric-${index}`} className="space-y-4 rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <PulseLine className="h-3.5 w-28" />
              <div className="h-9 w-9 rounded-xl bg-slate-200/80 dark:bg-slate-800/90" />
            </div>
            <PulseLine className="h-8 w-24" />
            <PulseLine className="w-4/5" />
          </PulseCard>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <PulseCard className="h-[420px]">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-2">
              <PulseLine className="h-4 w-40" />
              <PulseLine className="w-56" />
            </div>
            <PulseLine className="h-8 w-20 rounded-2xl" />
          </div>
          <div className="flex h-80 items-end gap-3 rounded-2xl bg-slate-100/70 p-4 dark:bg-slate-900/60">
            {[58, 35, 73, 44, 66, 52, 80].map((height, index) => (
              <div
                key={`bar-${index}`}
                style={{ height: `${height}%` }}
                className="w-full rounded-t-xl bg-slate-300/70 dark:bg-slate-700/70"
              />
            ))}
          </div>
        </PulseCard>

        <PulseCard className="h-[420px]">
          <div className="mb-6 space-y-2">
            <PulseLine className="h-4 w-44" />
            <PulseLine className="w-48" />
          </div>
          <div className="relative flex h-80 items-center justify-center rounded-2xl bg-slate-100/70 dark:bg-slate-900/60">
            <div className="h-44 w-44 rounded-full border-14 border-slate-300/80 dark:border-slate-700/80" />
            <div className="absolute h-20 w-20 rounded-full bg-slate-100/90 dark:bg-slate-900/90" />
          </div>
        </PulseCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <PulseCard className="h-[360px]">
          <div className="mb-5 space-y-2">
            <PulseLine className="h-4 w-40" />
            <PulseLine className="w-52" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`row-${index}`}
                className="flex items-center justify-between rounded-2xl bg-slate-100/70 px-4 py-3 dark:bg-slate-900/60"
              >
                <PulseLine className="w-1/2" />
                <PulseLine className="w-16" />
              </div>
            ))}
          </div>
        </PulseCard>

        <PulseCard className="h-[360px]">
          <div className="mb-5 space-y-2">
            <PulseLine className="h-4 w-44" />
            <PulseLine className="w-40" />
          </div>
          <div className="flex h-[250px] items-end gap-2 rounded-2xl bg-slate-100/70 p-4 dark:bg-slate-900/60">
            {[20, 34, 31, 52, 40, 61, 57, 68, 62, 74, 66, 79].map(
              (height, index) => (
                <div
                  key={`trend-${index}`}
                  style={{ height: `${height}%` }}
                  className="w-full rounded-lg bg-slate-300/75 dark:bg-slate-700/80"
                />
              )
            )}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <PulseLine className="h-2.5" />
            <PulseLine className="h-2.5" />
            <PulseLine className="h-2.5" />
          </div>
        </PulseCard>
      </section>
    </div>
  );
};