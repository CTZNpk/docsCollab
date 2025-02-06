import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useSocket from "../hooks/useSocket";

function DocumentEditor() {
  const [value, setValue] = useState("");
  const { socket, sendMessage } = useSocket();

  const handleChange = (content, delta, source, editor) => {
    sendMessage(content);
    setValue(content);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("message", (data) => {
      console.log(data);
    });
    return () => {
      socket.off("message");
    };
  }, [socket]);

  return (
    <div className="p-12 h-screen w-screen flex flex-col ">
      <h1 className="text-center text-xl p-4 ">Document </h1>
      <ReactQuill
        value={value}
        onChange={handleChange}
        theme="snow"
        className="flex-1"
      />
    </div>
  );
}

export default DocumentEditor;
