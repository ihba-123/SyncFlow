import { memo, useState } from "react";
import { FileText, CheckCheck } from "lucide-react";
import { toAbsoluteAssetUrl, getInitials, getFileNameFromUrl } from "../../utils/chat-utils";

export const AvatarCircle = memo(({ src, name, sizeClass = "h-8 w-8", fallbackClass = "bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300", imgClass = "" }) => {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = src ? toAbsoluteAssetUrl(src) : "";
  const showImage = Boolean(resolvedSrc) && !hasError;

  if (showImage) {
    return <img src={resolvedSrc} alt={name} className={`${sizeClass} rounded-full object-cover ring-2 ring-slate-300/70 dark:ring-white/20 ${imgClass}`.trim()} onError={() => setHasError(true)} />;
  }
  return <div className={`flex ${sizeClass} items-center justify-center rounded-full text-[10px] font-bold ${fallbackClass}`.trim()}>{getInitials(name)}</div>;
});

export const ChatMessageRow = memo(({ message, currentUserAvatar, currentUserDisplayName, onOpenAsset, showAvatar, showUsername }) => {
  const handleOpenAsset = (url, kind) => {
    if (!url || typeof onOpenAsset !== "function") return;
    onOpenAsset(url, kind);
  };

  return (
    <div className={`group flex w-full items-end gap-2 ${message.isOwn ? "flex-row-reverse justify-end" : "flex-row justify-start"}`} style={{ animation: "chatMessageIn 180ms ease-out both" }}>
      <div className="shrink-0">
        {showAvatar ? (
          <AvatarCircle src={message.isOwn ? currentUserAvatar : message.avatar} name={message.isOwn ? currentUserDisplayName : message.user} sizeClass="h-8 w-8" fallbackClass={message.isOwn ? "bg-sky-600 text-white" : "bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300"} />
        ) : <div className="h-8 w-8" />}
      </div>
      <div className={`flex max-w-[74%] sm:max-w-[68%] flex-col gap-1 ${message.isOwn ? "items-end" : "items-start"}`}>
        {showUsername && <p className={`px-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500/90 dark:text-slate-400/90 ${message.isOwn ? "text-right" : "text-left"}`}>{message.user}</p>}
        <div className={`max-w-full rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-lg backdrop-blur-sm ${message.isOwn ? "rounded-br-md border border-cyan-200/60 bg-linear-to-br from-sky-500 via-cyan-500 to-teal-500 text-white shadow-cyan-500/20 dark:border-sky-300/30 dark:from-sky-500 dark:via-cyan-500 dark:to-teal-500" : "rounded-bl-md border border-slate-200/80 bg-white/90 text-slate-800 shadow-slate-300/40 dark:border-white/10 dark:bg-slate-800/85 dark:text-slate-100 dark:shadow-black/20"}`}>
          {message.text && <p className="max-w-full whitespace-pre-wrap wrap-anywhere">{message.text}</p>}
          {message.image && (
            <button type="button" onClick={() => handleOpenAsset(message.image, "image")} className="mt-2 max-w-xs overflow-hidden rounded-xl border border-slate-300/70 transition hover:opacity-85 dark:border-white/20">
              <img src={toAbsoluteAssetUrl(message.image)} alt="Msg" className="max-h-52 w-auto" />
            </button>
          )}
          {message.attachment && !message.image && (
            <button type="button" onClick={() => handleOpenAsset(message.attachment, getFileNameFromUrl(message.attachment))} className={`mt-1 flex items-center gap-2 rounded-xl border p-2 text-xs transition ${message.isOwn ? "border-cyan-200/70 bg-white/20 text-white dark:border-sky-200/30 dark:bg-sky-900/30 dark:text-sky-100" : "border-slate-300/70 bg-slate-100/80 text-slate-700 dark:border-white/10 dark:bg-slate-700/70 dark:text-slate-100"}`}>
              <FileText size={14} /><span className="truncate">{getFileNameFromUrl(message.attachment)}</span>
            </button>
          )}
        </div>
        <div className={`mt-1 flex items-center gap-1.5 ${message.isOwn ? "justify-end" : "justify-start"}`}>
          <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${message.isOwn ? "bg-cyan-100/70 text-cyan-700 dark:bg-sky-900/45 dark:text-sky-100/90" : "bg-slate-200/80 text-slate-600 dark:bg-slate-700/70 dark:text-slate-300"}`}>{message.time}</span>
          {message.isOwn && <span className="text-cyan-700 dark:text-sky-100/90"><CheckCheck size={10} className={message.seen ? "" : "opacity-50"} /></span>}
        </div>
      </div>
    </div>
  );
});