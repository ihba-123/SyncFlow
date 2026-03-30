import { useEffect, useRef } from "react";

const useProjectSocket = (projectId, onMessage) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Guard: Don't attempt connection if ID is missing or invalid
    if (!projectId || projectId === "undefined") return;

    const url = `ws://localhost:8000/ws/projects/${projectId}/`;
    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log(` Connected to project ${projectId}`);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessage) onMessage(data);
      } catch (err) {
        console.error(" WS Parsing Error:", err);
      }
    };

    ws.onclose = (e) => {
      console.log(` Disconnected from project ${projectId}`, e.reason);
    };

    ws.onerror = (error) => {
      console.error(` WebSocket error for project ${projectId}:`, error);

    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [projectId]);
};

export default useProjectSocket;