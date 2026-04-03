import { useEffect, useRef } from "react";
import { useKanban } from "../stores/KanbanStore";
import { useActiveProjectStore } from "../stores/ActiveProject";

export const useKanbanSocket = () => {
  const activeProject = useActiveProjectStore((s) => s.activeProject);
  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const intentionalCloseRef = useRef(false);
  const project_id = activeProject?.id;

  useEffect(() => {
    if (!project_id) return;

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

      const socket = new WebSocket(`ws://localhost:8000/ws/kanban/${project_id}/`);
      socketRef.current = socket;
      intentionalCloseRef.current = false;

      socket.onopen = () => {
        reconnectAttemptsRef.current = 0;
        console.log("Kanban socket connected", project_id);
      };

      socket.onclose = () => {
        if (cancelled) return;
        const attempt = reconnectAttemptsRef.current + 1;
        reconnectAttemptsRef.current = attempt;
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
        } catch (error) {
          console.error("Failed to parse kanban socket message", error);
        }
      };
    };

    connect();

    return () => {
      cancelled = true;
      cleanupSocket();
    };
  }, [project_id]);
};