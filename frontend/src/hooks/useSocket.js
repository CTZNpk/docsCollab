import { useEffect, useRef, useCallback } from "react";
import documentStore from "../store/documentStore";
import userStore from "../store/userStore";

const SOCKET_URL = "ws://localhost:8000/ws";

const useSocket = ({ documentId, setValue, editorRef }) => {
  const wsRef = useRef(null);
  const pendingOperations = useRef([]);
  const { version, content, setContent, incrementVersion } = documentStore();
  const { user } = userStore();

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
          console.log("Received operation:", data);

          if (data.user_id != user.user_id) {
            setValue(data.content);
            incrementVersion();
            const quill = editorRef.getEditor();
            const cursorPosition = quill.getSelection()?.index || 0;

            setValue(data.content);

            setTimeout(() => {
              quill.setSelection(cursorPosition);
            }, 0);
          }
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
  }, [documentId]);

  const sendMessage = useCallback(
    (changeDelta) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        console.log(changeDelta);
        let position = 0;
        if (changeDelta[0].retain) {
          position = changeDelta[0].retain;
        }

        let operationType = "";
        let operationContent = "";
        if (position == 0) {
          if (changeDelta[0].insert) {
            operationType = "INSERT";
            operationContent = changeDelta[0].insert;{}
          } else {
            operationType = "DELETE";
            operationContent = content[3];
          }
        } else {
          if (changeDelta[1].insert) {
            operationType = "INSERT";
            operationContent = changeDelta[1].insert;
          } else {
            operationType = "DELETE";
            operationContent = content[0 + changeDelta[1].retain];
          }
        }

        const userId = user.user_id;

        const operation = {
          content: operationContent,
          position: position,
          operation_type: operationType,
          vector_clock: version,
          user_id: userId,
        };

        incrementVersion();

        pendingOperations.current.push(operation);

        wsRef.current.send(JSON.stringify(operation));
        console.log("Sent operation:", operation);
      }
    },
    [version],
  );

  return { sendMessage };
};

export default useSocket;
