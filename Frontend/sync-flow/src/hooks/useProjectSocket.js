import { useEffect, useRef } from "react";
import useBackendAvailability from "./useBackendAvailability";
import { getAccessToken } from "../utils/authToken";

const useProjectSocket = (projectId, onMessage) => {
  const socketRef = useRef(null);
  const intentionalCloseRef = useRef(false);
  const onMessageRef = useRef(onMessage);
  const { isAvailable } = useBackendAvailability();
  const token = getAccessToken();

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    // Guard: Don't attempt connection if ID or auth token is missing.
    if (!projectId || projectId === "undefined" || !isAvailable || !token) return;

    const url = new URL(`ws://localhost:8000/ws/projects/${projectId}/`);
    url.searchParams.set("token", token);
    const ws = new WebSocket(url.toString());
    socketRef.current = ws;
    intentionalCloseRef.current = false;

    ws.onopen = () => {};

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessageRef.current) onMessageRef.current(data);
      } catch {
        return;
      }
    };

    ws.onclose = () => {};

    ws.onerror = () => {
      if (!intentionalCloseRef.current) {
        ws.close();
      }

    };

    return () => {
      if (socketRef.current) {
        const currentSocket = socketRef.current;
        intentionalCloseRef.current = true;
        socketRef.current.onopen = null;
        socketRef.current.onclose = null;
        socketRef.current.onerror = null;
        socketRef.current.onmessage = null;
        if (currentSocket.readyState === WebSocket.OPEN) {
          currentSocket.close();
        } else if (currentSocket.readyState === WebSocket.CONNECTING) {
          currentSocket.onopen = () => currentSocket.close();
        }
      }
    };
  }, [projectId, isAvailable, token]);
};

export default useProjectSocket;