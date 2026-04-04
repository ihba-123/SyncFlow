import { memo, useState } from "react";
import { FileText, CheckCheck } from "lucide-react";
import { toAbsoluteAssetUrl, getInitials, getFileNameFromUrl } from "../../utils/chat-utils";

export const AvatarCircle = memo(({ src, name, sizeClass = "h-8 w-8", fallbackClass = "bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300", imgClass = "" }) => {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = src ? toAbsoluteAssetUrl(src) : "";
  const showImage = Boolean(resolvedSrc) && !hasError;

  if (showImage) {
    return <img src={resolvedSrc} alt={name} className={`${sizeClass} rounded-full object-cover ${imgClass}`.trim()} onError={() => setHasError(true)} />;
  }
  return <div className={`flex ${sizeClass} items-center justify-center rounded-full text-[10px] font-bold ${fallbackClass}`.trim()}>{getInitials(name)}</div>;
});

export const ChatMessageRow = memo(({ message, currentUserAvatar, currentUserDisplayName, onOpenAsset, showAvatar, showUsername }) => {
  const handleOpenAsset = (url, kind) => {
    if (!url || typeof onOpenAsset !== "function") return;
    onOpenAsset(url, kind);
  };

  return (
    <div className={`group flex items-end gap-2 w-full ${message.isOwn ? "flex-row-reverse justify-end" : "flex-row justify-start"}`} style={{ animation: "chatMessageIn 180ms ease-out both" }}>
      <div className="shrink-0">
        {showAvatar ? (
          <AvatarCircle src={message.isOwn ? currentUserAvatar : message.avatar} name={message.isOwn ? currentUserDisplayName : message.user} sizeClass="h-8 w-8" fallbackClass={message.isOwn ? "bg-sky-600 text-white" : "bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300"} />
        ) : <div className="h-8 w-8" />}
      </div>
      <div className={`flex max-w-[70%] sm:max-w-[65%] flex-col gap-1 ${message.isOwn ? "items-end" : "items-start"}`}>
        {showUsername && <p className={`px-1 text-[10px] font-semibold tracking-wide text-slate-400/90 ${message.isOwn ? "text-right" : "text-left"}`}>{message.user}</p>}
        <div className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${message.isOwn ? "rounded-br-md bg-linear-to-br from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-400/25" : "rounded-bl-md border border-slate-700/70 bg-slate-800/95 text-slate-100 shadow-sm"}`}>
          {message.text && <p>{message.text}</p>}
          {message.image && (
            <button type="button" onClick={() => handleOpenAsset(message.image, "image")} className="mt-2 rounded-lg overflow-hidden max-w-xs hover:opacity-80 transition">
              <img src={toAbsoluteAssetUrl(message.image)} alt="Msg" className="max-h-48 w-auto" />
            </button>
          )}
          {message.attachment && !message.image && (
            <button type="button" onClick={() => handleOpenAsset(message.attachment, getFileNameFromUrl(message.attachment))} className={`flex items-center gap-2 rounded-lg p-2 text-xs transition ${message.isOwn ? "bg-sky-900/30 text-sky-100" : "bg-slate-700/70 text-slate-100"}`}>
              <FileText size={14} /><span className="truncate">{getFileNameFromUrl(message.attachment)}</span>
            </button>
          )}
        </div>
        <div className={`mt-1 flex items-center gap-1.5 ${message.isOwn ? "justify-end" : "justify-start"}`}>
          <span className={`text-[9px] ${message.isOwn ? "text-white/65" : "text-slate-400/80"}`}>{message.time}</span>
          {message.isOwn && <span className="text-sky-100/90"><CheckCheck size={10} className={message.seen ? "" : "opacity-50"} /></span>}
        </div>
      </div>
    </div>
  );
});