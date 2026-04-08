import { Check, CheckCheck } from 'lucide-react';

export function MessageBubble({
  text,
  timestamp,
  isOutgoing,
  showTail = false,
  isRead = false,
}) {
  return (
    <div className={`mb-2 flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex max-w-[80%] sm:max-w-[70%] md:max-w-[65%] lg:max-w-[50%] items-end gap-1 ${
          isOutgoing ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <div
          className={`max-w-full rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-lg backdrop-blur-sm ${
            isOutgoing
              ? 'rounded-br-md border border-cyan-200/60 bg-linear-to-br from-sky-500 via-cyan-500 to-teal-500 text-white dark:border-emerald-300/30 dark:from-[#047857] dark:via-[#0f766e] dark:to-[#0e7490] dark:text-[#f0fdf4]'
              : 'rounded-bl-md border border-slate-200/80 bg-white/90 text-slate-800 dark:border-white/10 dark:bg-[#1e293bcc] dark:text-[#e2e8f0]'
          }`}
        >
          <p className="max-w-full whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm">{text}</p>
          <div className="mt-2 flex items-center justify-end gap-1.5">
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${isOutgoing ? 'bg-white/25 text-white dark:bg-black/20 dark:text-emerald-100/90' : 'bg-slate-200/80 text-slate-600 dark:bg-slate-700/70 dark:text-slate-300'}`}>
              {timestamp}
            </span>
            {isOutgoing && (
              <>
                {isRead ? (
                  <CheckCheck size={14} className="text-cyan-100 dark:text-[#bbf7d0]" />
                ) : (
                  <Check size={14} className="text-cyan-100/90 dark:text-[#a7f3d0]" />
                )}
              </>
            )}
          </div>
        </div>
        {showTail && (
          <div
            className={`h-2 w-2 ${isOutgoing ? 'bg-cyan-500 dark:bg-[#0f766e]' : 'bg-white dark:bg-[#1e293b]'}`}
            style={{
              clipPath: isOutgoing
                ? 'polygon(0 0, 100% 100%, 100% 0)'
                : 'polygon(0 100%, 100% 0, 0 0)',
            }}
          />
        )}
      </div>
    </div>
  );
}