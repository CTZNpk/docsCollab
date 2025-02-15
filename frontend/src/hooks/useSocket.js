import { useEffect, useRef } from "react";
import documentStore from "../store/documentStore";

const SOCKET_URL = "ws://localhost:8000/ws";

const useSocket = ({ documentId, userId }) => {
  const wsRef = useRef(null);
  const { version, content, setContent } = documentStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Construct URL with query parameters
    const url = `${SOCKET_URL}?document_id=${documentId}&user_token=${token}`;

    wsRef.current = new WebSocket(url);

    // Event: Connection Opened
    wsRef.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    // Event: Message Received
    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Current content:", content);
        console.log("Received data:", data);
        // If needed, update state with setContent(data.someField)
      } catch (error) {
        console.error("Error parsing message data:", error);
      }
    };

    // Event: Error
    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Event: Connection Closed
    wsRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Cleanup function to close WebSocket on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [documentId, userId]);

  const sendMessage = (data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  };

  return { sendMessage };
};

export default useSocket;
