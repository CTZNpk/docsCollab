import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000/ws";

const useSocket = () => {
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const sendMessage = (data) => {
    if (socketRef.current) {
      socketRef.current.emit(data);
    }
  };

  return { socket: socketRef.current, sendMessage };
};

export default useSocket;
