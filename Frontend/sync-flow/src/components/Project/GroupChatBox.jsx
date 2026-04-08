import { useMemo, useRef, useEffect, useState } from "react";
import { Users2, Paperclip, SendHorizontal, ChevronDown, MessageCircle } from "lucide-react";
import { useAuthStore } from "../../stores/AuthStore";
import { sendAttachmentOrMessage } from "../../api/chat_api";
import { buildMemberIndex, resolveSender, getUserAvatar, getUserDisplayName, toAbsoluteAssetUrl, isImageFile } from "../../utils/chat-utils";
import { ChatMessageRow } from "../Chat/ChatComponents";
import { useChatLogic } from "../../hooks/useChatLogic";

export function GroupChatBox({ projectName = "Group Chat", projectId, members = [] }) {
  const currentUser = useAuthStore((state) => state.user);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const [draft, setDraft] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [showScrollToLatest, setShowScrollToLatest] = useState(false);
  const shouldStickToBottomRef = useRef(true);
  const historyLoadInFlightRef = useRef(false);

  const memberIndex = useMemo(() => buildMemberIndex(members, currentUser), [members, currentUser]);
  const currentUserProfile = useMemo(() => resolveSender(currentUser, memberIndex) || currentUser, [currentUser, memberIndex]);
  const { messages, roomId, nextPage, isLoading, isLoadingHistory, setIsLoadingHistory, error, setError, socketRef, loadMessagesPage, upsertMessage } 
    = useChatLogic(projectId, projectName, members, currentUser, memberIndex);

  const loadOlderMessages = async () => {
    if (!scrollRef.current || !roomId || !nextPage || historyLoadInFlightRef.current || isLoadingHistory) {
      return;
    }

    historyLoadInFlightRef.current = true;
    setIsLoadingHistory(true);

    const previousScrollHeight = scrollRef.current.scrollHeight;
    const previousScrollTop = scrollRef.current.scrollTop;

    try {
      await loadMessagesPage(roomId, nextPage, { prepend: true });

      // Keep the viewport anchored after prepending older history.
      requestAnimationFrame(() => {
        if (!scrollRef.current) return;
        const newScrollHeight = scrollRef.current.scrollHeight;
        scrollRef.current.scrollTop = previousScrollTop + (newScrollHeight - previousScrollHeight);
      });
    } finally {
      historyLoadInFlightRef.current = false;
      setIsLoadingHistory(false);
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    shouldStickToBottomRef.current = distanceFromBottom <= 48;
    setShowScrollToLatest(distanceFromBottom > 240);

    if (scrollTop <= 40) {
      void loadOlderMessages();
    }
  };

  const handleWheel = (event) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const hasScrollableContent = container.scrollHeight > container.clientHeight;
    if (!hasScrollableContent) return;

    // Keep wheel scrolling inside the chat box, even in nested scroll layouts.
    event.preventDefault();
    event.stopPropagation();
    container.scrollTop += event.deltaY;
  };

  const scrollToLatest = () => {
    if (!scrollRef.current) return;
    shouldStickToBottomRef.current = true;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
    setShowScrollToLatest(false);
  };

  useEffect(() => {
    if (scrollRef.current && shouldStickToBottomRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleOpenAsset = (assetUrl) => {
    if (!assetUrl) return;
    const absoluteUrl = toAbsoluteAssetUrl(assetUrl);
    window.open(absoluteUrl, "_blank", "noopener,noreferrer");
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!draft.trim() && !attachedFile) || !roomId || isSending) return;
    setIsSending(true);
    const content = draft.trim();
    try {
      const response = await sendAttachmentOrMessage({
        roomId,
        content,
        attachment: isImageFile(attachedFile) ? null : attachedFile,
        images: isImageFile(attachedFile) ? attachedFile : null,
      });
      if (response) upsertMessage(response);
      setDraft("");
      setAttachedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) { setError("Failed to send message."); }
    finally { setIsSending(false); }
  };

  const canSend = Boolean(draft.trim() || attachedFile) && Boolean(roomId) && !isSending;

  return (
    <div className="flex h-[640px] min-h-0 w-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-b from-white via-slate-50 to-sky-50 shadow-2xl dark:border-white/10 dark:from-[#0f172a] dark:via-[#0b1730] dark:to-[#071226]">
      <style>{`@keyframes chatMessageIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      
      {/* Header & Members list logic stays same, just using the new components */}
      <div className="shrink-0 flex items-center gap-3 border-b border-slate-200 bg-white/85 px-4 py-3.5 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/55">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 font-bold text-white">{projectName[0]}</div>
        <div className="flex-1"><h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{projectName}</h3></div>
        <Users2 size={16} className="text-slate-500 dark:text-slate-300" />
      </div>

      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onWheel={handleWheel}
          className="min-h-0 h-full touch-pan-y overflow-x-hidden overflow-y-scroll overscroll-contain bg-white/40 px-3 py-4 space-y-3 custom-scrollbar dark:bg-slate-950/35"
        >
          {isLoadingHistory && (
            <div className="pb-2 text-center text-xs text-slate-500 dark:text-slate-300/80">Loading older messages...</div>
          )}
          {!isLoading && messages.length === 0 ? (
            <div className="flex h-full min-h-[220px] items-center justify-center">
              <div className="rounded-2xl border border-slate-200 bg-white/90 px-6 py-5 text-center shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300">
                  <MessageCircle size={18} />
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Start chatting</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-300/80">No messages yet in this group.</p>
              </div>
            </div>
          ) : (
            messages.map((m, idx) => (
              <ChatMessageRow 
                key={m.id} 
                message={m} 
                currentUserAvatar={getUserAvatar(currentUserProfile)} 
                currentUserDisplayName={getUserDisplayName(currentUserProfile)} 
                onOpenAsset={handleOpenAsset}
                showAvatar={true} 
                showUsername={idx === 0 || messages[idx-1].senderId !== m.senderId} 
              />
            ))
          )}
        </div>

        {showScrollToLatest && (
          <button
            type="button"
            onClick={scrollToLatest}
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-slate-300/70 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-lg backdrop-blur transition hover:bg-slate-100 dark:border-white/20 dark:bg-slate-900/85 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Latest
            <ChevronDown size={14} />
          </button>
        )}
      </div>

      <form onSubmit={handleSend} className="border-t border-slate-200 bg-white/85 p-3.5 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/75">
        {attachedFile && (
          <div className="mb-2 rounded-lg border border-slate-300 bg-slate-100/90 px-3 py-1.5 text-xs text-slate-700 dark:border-white/15 dark:bg-slate-800/70 dark:text-slate-200">
            Attached: {attachedFile.name}
          </div>
        )}
        <div className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white/95 p-2 dark:border-white/15 dark:bg-slate-800/90">
          <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setAttachedFile(e.target.files?.[0] || null)} />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-500 dark:text-slate-300"><Paperclip size={18} /></button>
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-400" placeholder="Type a message..." rows={1} />
          <button type="submit" disabled={!canSend} className="p-2 bg-sky-500 rounded-xl text-white disabled:cursor-not-allowed disabled:opacity-50"><SendHorizontal size={18} /></button>
        </div>
      </form>
    </div>
  );
}