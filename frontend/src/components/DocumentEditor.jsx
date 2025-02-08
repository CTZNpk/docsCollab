import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useSocket from "../hooks/useSocket";
import documentStore from "../store/documentStore";

function DocumentEditor() {
  const [value, setValue] = useState("");
  // const { socket, sendMessage } = useSocket();
  const {
    // documentId,
    content,
    title,
    setContent,
    // version,
    // number_of_collaborators
  } = documentStore();

  useEffect(() => {
    setValue(content);
  }, [content]);

  const handleChange = (content, delta, source, editor) => {
    setContent(content);
    setValue(content);
  };



  // useEffect(() => {
  //   if (!socket) return;
  //
  //   socket.on("message", (data) => {
  //     console.log(data);
  //   });
  //   return () => {
  //     socket.off("message");
  //   };
  // }, [socket]);

  return (
    <div className="p-12 h-screen w-screen flex flex-col ">
      <h1 className="text-center text-6xl p-4 font-bold">{title}</h1>
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
