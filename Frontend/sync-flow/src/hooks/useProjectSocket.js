import { useEffect, useRef } from "react";

const useProjectSocket = (projectId, onMessage) => {
  const socketRef = useRef(null);
  const intentionalCloseRef = useRef(false);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    // Guard: Don't attempt connection if ID is missing or invalid
    if (!projectId || projectId === "undefined") return;

    const url = `ws://localhost:8000/ws/projects/${projectId}/`;
    const ws = new WebSocket(url);
    socketRef.current = ws;
    intentionalCloseRef.current = false;

    ws.onopen = () => {
      console.log(` Connected to project ${projectId}`);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessageRef.current) onMessageRef.current(data);
      } catch (err) {
        console.error(" WS Parsing Error:", err);
      }
    };

    ws.onclose = (e) => {
      console.log(` Disconnected from project ${projectId}`, e.reason);
    };

    ws.onerror = (error) => {
      if (!intentionalCloseRef.current) {
        console.error(` WebSocket error for project ${projectId}:`, error);
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
  }, [projectId]);
};

export default useProjectSocket;