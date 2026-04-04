import { useMemo, useRef, useEffect, useState } from "react";
import { Users2, Paperclip, SendHorizontal } from "lucide-react";
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
  const shouldStickToBottomRef = useRef(true);

  const memberIndex = useMemo(() => buildMemberIndex(members, currentUser), [members, currentUser]);
  const currentUserProfile = useMemo(() => resolveSender(currentUser, memberIndex) || currentUser, [currentUser, memberIndex]);
  const { messages, roomId, nextPage, isLoading, isLoadingHistory, setIsLoadingHistory, error, setError, socketRef, loadMessagesPage, upsertMessage } 
    = useChatLogic(projectId, projectName, members, currentUser, memberIndex);

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
    <div className="flex h-[640px] w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-[#0f172a] via-[#0b1730] to-[#071226] shadow-2xl">
      <style>{`@keyframes chatMessageIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      
      {/* Header & Members list logic stays same, just using the new components */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-slate-900/55 px-4 py-3.5 backdrop-blur-md shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 font-bold text-white">{projectName[0]}</div>
        <div className="flex-1"><h3 className="text-sm font-bold text-slate-100">{projectName}</h3></div>
        <Users2 size={16} className="text-slate-300" />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-slate-950/35 px-3 py-4 space-y-3 custom-scrollbar">
        {messages.map((m, idx) => (
          <ChatMessageRow 
            key={m.id} 
            message={m} 
            currentUserAvatar={getUserAvatar(currentUserProfile)} 
            currentUserDisplayName={getUserDisplayName(currentUserProfile)} 
            onOpenAsset={handleOpenAsset}
            showAvatar={true} 
            showUsername={idx === 0 || messages[idx-1].senderId !== m.senderId} 
          />
        ))}
      </div>

      <form onSubmit={handleSend} className="border-t border-white/10 bg-slate-900/75 p-3.5 backdrop-blur-md">
        {attachedFile && (
          <div className="mb-2 rounded-lg border border-white/15 bg-slate-800/70 px-3 py-1.5 text-xs text-slate-200">
            Attached: {attachedFile.name}
          </div>
        )}
        <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-slate-800/90 p-2">
          <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setAttachedFile(e.target.files?.[0] || null)} />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-300"><Paperclip size={18} /></button>
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} className="flex-1 bg-transparent text-sm text-slate-100 outline-none" placeholder="Type a message..." rows={1} />
          <button type="submit" disabled={!canSend} className="p-2 bg-sky-500 rounded-xl text-white disabled:cursor-not-allowed disabled:opacity-50"><SendHorizontal size={18} /></button>
        </div>
      </form>
    </div>
  );
}