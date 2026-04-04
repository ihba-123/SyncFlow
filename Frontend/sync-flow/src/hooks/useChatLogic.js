import { useState, useEffect, useRef } from "react";
import { buildChatSocketUrl, createGroupChatRoom, getMessageList, getProjectChatRoom } from "../api/chat_api";
import { normalizeMessage, mergeMessages, parseNextPage } from "../utils/chat-utils";

export const useChatLogic = (projectId, projectName, members, currentUser, memberIndex) => {
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState("");
  
  const socketRef = useRef(null);
  const roomIdRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const intentionalCloseRef = useRef(false);

  const upsertMessage = (rawMessage, overrides = {}) => {
    const normalized = normalizeMessage(rawMessage, currentUser, memberIndex);
    setMessages((prev) => mergeMessages(prev, [{ ...normalized, ...overrides }]));
  };

  const loadMessagesPage = async (targetRoomId, pageToLoad, options = {}) => {
    if (!targetRoomId || !pageToLoad) return;
    try {
      const response = await getMessageList(targetRoomId, pageToLoad);
      const batch = (response?.results || []).map((m) => normalizeMessage(m, currentUser, memberIndex)).reverse();
      if (roomIdRef.current !== targetRoomId) return;
      setMessages((prev) => options.prepend ? mergeMessages(batch, prev) : mergeMessages(prev, batch));
      setNextPage(parseNextPage(response?.next));
    } catch (err) { setError("Failed to load messages"); }
  };

  useEffect(() => {
    let cancelled = false;
    const setupChat = async () => {
      if (!projectId) { setIsLoading(false); return; }
      try {
        const roomFromProject = await getProjectChatRoom(projectId);
        let resId = typeof roomFromProject === "object" ? roomFromProject?.id || roomFromProject?.room_id : roomFromProject;
        if (!resId) {
          const participantIds = members.map((m) => m?.id).filter((id) => id && Number(id) !== Number(currentUser?.id));
          const createRes = await createGroupChatRoom({ participantIds, name: projectName });
          resId = createRes?.room_id;
        }
        if (cancelled) return;
        roomIdRef.current = resId;
        setRoomId(resId);
        setMessages([]);
        await loadMessagesPage(resId, 1);
      } catch (err) { if (!cancelled) setError("Unable to load chat."); }
      finally { if (!cancelled) setIsLoading(false); }
    };
    setupChat();
    return () => { cancelled = true; };
  }, [projectId, projectName, currentUser?.id]);

  useEffect(() => {
    if (!roomId) return;
    intentionalCloseRef.current = false;
    const connect = () => {
      const socket = new WebSocket(buildChatSocketUrl(roomId));
      socketRef.current = socket;
      socket.onopen = () => setError("");
      socket.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload?.type === "chat_message" || (payload?.id && payload?.content)) {
            upsertMessage(payload.message || payload);
          }
          if (payload?.type === "read_receipt" && payload?.message_id) {
            setMessages((prev) => prev.map((m) => String(m.id) === String(payload.message_id) ? { ...m, seen: true } : m));
          }
        } catch {
          setError("Received invalid chat payload.");
        }
      };
      socket.onerror = () => setError("Connection issue. Reconnecting...");
      socket.onclose = () => { if (!intentionalCloseRef.current) reconnectTimerRef.current = setTimeout(connect, 2000); };
    };
    connect();
    return () => { intentionalCloseRef.current = true; clearTimeout(reconnectTimerRef.current); socketRef.current?.close(); };
  }, [roomId, currentUser?.id]);

  return { messages, setMessages, roomId, nextPage, isLoading, isLoadingHistory, setIsLoadingHistory, error, setError, socketRef, loadMessagesPage, upsertMessage };
};