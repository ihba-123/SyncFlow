import { useEffect, useRef } from "react";
import { useKanban } from "../stores/KanbanStore";
import { useActiveProjectStore } from "../stores/ActiveProject";
import useBackendAvailability from "./useBackendAvailability";
import { getAccessToken } from "../utils/authToken";

export const useKanbanSocket = () => {
  const activeProject = useActiveProjectStore((s) => s.activeProject);
  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const intentionalCloseRef = useRef(false);
  const { isAvailable } = useBackendAvailability();
  const project_id = activeProject?.id;
  const token = getAccessToken();

  const MAX_RECONNECTS = 2;

  useEffect(() => {
    if (!project_id || !isAvailable || !token) return;

    let cancelled = false;

    const cleanupSocket = () => {
      intentionalCloseRef.current = true;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      if (socketRef.current) {
        const currentSocket = socketRef.current;
        socketRef.current.onopen = null;
        socketRef.current.onclose = null;
        socketRef.current.onerror = null;
        socketRef.current.onmessage = null;
        if (currentSocket.readyState === WebSocket.OPEN) {
          currentSocket.close();
        } else if (currentSocket.readyState === WebSocket.CONNECTING) {
          currentSocket.onopen = () => currentSocket.close();
        }
        socketRef.current = null;
      }
    };

    const connect = () => {
      if (cancelled) return;

      cleanupSocket();

      const url = new URL(`ws://localhost:8000/ws/kanban/${project_id}/`);
      url.searchParams.set("token", token);
      const socket = new WebSocket(url.toString());
      socketRef.current = socket;
      intentionalCloseRef.current = false;

      socket.onopen = () => {
        reconnectAttemptsRef.current = 0;
      };

      socket.onclose = () => {
        if (cancelled) return;
        if (intentionalCloseRef.current) return;

        const attempt = reconnectAttemptsRef.current + 1;
        reconnectAttemptsRef.current = attempt;

        if (attempt > MAX_RECONNECTS) {
          return;
        }

        const delay = Math.min(3000, 250 * attempt);
        reconnectTimerRef.current = setTimeout(connect, delay);
      };

      socket.onerror = () => {
        if (!intentionalCloseRef.current) {
          socket.close();
        }
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "task_update" && data.task) {
            const store = useKanban.getState();
            if (store.isPendingTask?.(data.task.id)) {
              return;
            }
            store.upsertTaskFromServer(data.task);
          }
        } catch {
          return;
        }
      };
    };

    connect();

    return () => {
      cancelled = true;
      cleanupSocket();
    };
  }, [project_id, isAvailable, token]);
};