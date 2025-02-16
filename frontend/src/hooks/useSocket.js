import { useEffect, useRef, useCallback } from "react";
import documentStore from "../store/documentStore";
import userStore from "../store/userStore";

const SOCKET_URL = "ws://localhost:8000/ws";

const useSocket = ({ documentId, userId }) => {
  const wsRef = useRef(null);
  const pendingOperations = useRef([]);
  const { version, content, setContent, incrementVersion } = documentStore();
  const { user } = userStore();

  const transformOperation = useCallback((operation, remoteOp) => {
    let newPosition = operation.position;

    if (remoteOp.position <= operation.position) {
      if (remoteOp.operation_type === "INSERT") {
        newPosition += remoteOp.content.length;
      } else if (remoteOp.operation_type === "DELETE") {
        newPosition -= 1;
      }
    }

    return {
      ...operation,
      position: newPosition,
    };
  }, []);

  const handleRemoteOperation = useCallback(
    (message) => {
      console.log(message);
      if (message.user_id != userId) {
        pendingOperations.current = pendingOperations.current.map((op) => {
          if (op.vector_clock > message.vector_clock) {
            return transformOperation(op, message);
          }
          return op;
        });

        incrementVersion();

        switch (message.operation_type) {
          case "INSERT":
            setContent(
              `<p>${
                content.slice(0, message.position) +
                message.content +
                content.slice(message.position)
              }
              </p>`,
            );
            break;
          case "DELETE":
            setContent(
              `<p>${
                content.slice(0, message.position) +
                content.slice(message.position + 1)
              }
              </p>`,
            );
            break;
          case "UPDATE":
            break;
        }
      }
    },
    [content, setContent, transformOperation],
  );

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
          console.log(event);
          const data = JSON.parse(event.data);
          console.log("Received operation:", data);
          handleRemoteOperation(data);
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
            operationContent = changeDelta[0].insert;
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
