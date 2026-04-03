import { useMemo, useState } from "react";
import { SendHorizonal, Users2, MessageSquareQuote } from "lucide-react";

const seedMessages = [
  {
    id: "g-1",
    user: "Aanya",
    text: "Shared the timeline draft in the project thread.",
    time: "9:40 AM",
    isOwn: false,
  },
  {
    id: "g-2",
    user: "You",
    text: "Looks good. I’ll update the Kanban cards next.",
    time: "9:43 AM",
    isOwn: true,
  },
];

export function GroupChatBox({ projectName = "Group Chat" }) {
  const [messages, setMessages] = useState(seedMessages);
  const [draft, setDraft] = useState("");

  const initials = useMemo(() => {
    return projectName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "GC";
  }, [projectName]);

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `g-${Date.now()}`,
        user: "You",
        text: trimmed,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: true,
      },
    ]);
    setDraft("");
  };

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-white/50 bg-white/65 backdrop-blur-xl shadow-[0_16px_48px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-slate-900/45 dark:shadow-[0_18px_56px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between border-b border-slate-200/70 bg-white/45 px-4 py-3 sm:px-5 dark:border-white/10 dark:bg-slate-900/35">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-slate-700 to-slate-500 text-sm font-bold text-white shadow-md shadow-slate-400/30 dark:from-slate-500 dark:to-slate-700 dark:shadow-black/40">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                Group Chat
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
                <Users2 size={10} /> Live
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Project members can discuss updates here
            </p>
          </div>
        </div>

        <div className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:border-slate-700/70 dark:bg-slate-800/80 dark:text-slate-400">
          Team
        </div>
      </div>

      <div className="max-h-[360px] sm:max-h-[420px] lg:max-h-[460px] overflow-y-auto px-3 py-4 sm:px-4 custom-scrollbar bg-white/35 dark:bg-slate-950/10">
        {messages.length === 0 ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300/80 bg-white/65 px-6 text-center dark:border-slate-700/70 dark:bg-slate-900/45">
            <MessageSquareQuote className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              No messages yet
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Be the first to start the conversation.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[78%] rounded-2xl px-3 py-2 shadow-sm ${
                    message.isOwn
                      ? "border border-slate-300/80 bg-slate-700 text-white shadow-md shadow-slate-300/20 dark:border-slate-600/70 dark:bg-slate-700 dark:shadow-black/30"
                      : "border border-slate-200/80 bg-white/85 text-slate-800 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100"
                  }`}
                >
                  {!message.isOwn && (
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                      {message.user}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed wrap-break-word">
                    {message.text}
                  </p>
                  <p className={`mt-1 text-[10px] ${message.isOwn ? "text-slate-200" : "text-slate-400 dark:text-slate-500"}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSend}
        className="border-t border-slate-200/70 bg-white/45 p-3 sm:p-4 dark:border-white/10 dark:bg-slate-900/35"
      >
        <div className="flex items-end gap-2 rounded-2xl border border-slate-200/80 bg-white/85 p-2 shadow-inner dark:border-slate-700/70 dark:bg-slate-900/80">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a group message..."
            rows={1}
            className="max-h-28 min-h-11 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-300/80 bg-slate-700 text-white shadow-md shadow-slate-300/20 transition-all hover:bg-slate-600 dark:border-slate-600/80 dark:bg-slate-700 dark:shadow-black/30 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SendHorizonal size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}