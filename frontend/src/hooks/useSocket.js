import { useEffect, useRef } from "react";
import documentStore from "../store/documentStore";

const SOCKET_URL = "ws://localhost:8000/ws";

const useSocket = ({ documentId, userId }) => {
  const wsRef = useRef(null);
  const { version, content, setContent } = documentStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const url = `${SOCKET_URL}?document_id=${documentId}&user_token=${token}`;

    if (documentId != null) {
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log("WebSocket connection established");
      };

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

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket connection closed");
      };
    }
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [documentId, userId]);

  const sendMessage = (data) => {
    console.log(data);
    if (wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          content: data,
          position: 0,
          operation_type: "INSERT",
          vector_clock: 1,
        }),
      );
    }
  };

  return { sendMessage };
};

export default useSocket;
