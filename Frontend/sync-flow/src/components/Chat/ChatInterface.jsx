import { memo } from "react";
import { Paperclip, SendHorizonal } from "lucide-react";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

const isImageUrl = (value = "") => /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(value);

const ChatMessageList = memo(function ChatMessageList({
  messages = [],
  currentUserId,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <style>{`@keyframes messageIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-4 sm:px-4">
        <div className="space-y-3">
          {messages.map((message) => {
            const isSender = String(message.sender_id) === String(currentUserId);
            const attachmentUrl = message.attachment || message.file_url || null;
            const imageUrl = message.image || message.image_url || null;
            const avatarUrl = message.avatar || message.user_avatar || null;
            const senderName = message.sender_name || message.name || "User";

            return (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${isSender ? "justify-end" : "justify-start"}`}
                style={{ animation: "messageIn 180ms ease-out both" }}
              >
                {!isSender && (
                  <div className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-xs font-semibold text-slate-700 ring-1 ring-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={senderName} className="h-full w-full object-cover" />
                    ) : (
                      <span>{getInitials(senderName)}</span>
                    )}
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-3 py-2 sm:max-w-[70%] ${
                    isSender
                      ? "bg-blue-600 text-white dark:bg-blue-500"
                      : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                  }`}
                >
                  {message.text ? (
                    <p className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">
                      {message.text}
                    </p>
                  ) : null}

                  {imageUrl ? (
                    <div className="mt-2 overflow-hidden rounded-xl">
                      <img
                        src={imageUrl}
                        alt="Attachment"
                        className="max-h-56 w-full object-cover"
                      />
                    </div>
                  ) : null}

                  {attachmentUrl && !imageUrl ? (
                    <a
                      href={attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`mt-2 inline-flex max-w-full items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                        isSender
                          ? "bg-white/10 text-white"
                          : "bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      }`}
                    >
                      <Paperclip size={14} />
                      <span className="truncate">Attachment</span>
                    </a>
                  ) : null}

                  <p className={`mt-1 text-[10px] ${isSender ? "text-blue-100" : "text-slate-500 dark:text-slate-400"}`}>
                    {message.timestamp}
                  </p>
                </div>

                {isSender && (
                  <div className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-xs font-semibold text-white ring-1 ring-slate-100 dark:bg-blue-500 dark:ring-slate-700">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={senderName} className="h-full w-full object-cover" />
                    ) : (
                      <span>{getInitials(senderName)}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
        <div className="sticky bottom-0">
          <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900">
            <textarea
              rows={1}
              placeholder="Write a message..."
              className="min-h-11 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <button
              type="button"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SendHorizonal size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChatMessageList;
