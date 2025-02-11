import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import documentStore from "../store/documentStore";

function DocumentEditor() {
  const [value, setValue] = useState("");
  // const { socket, sendMessage } = useSocket();
  const {
    // documentId,
    content,
    title,
    setContent,
    version,
    number_of_collaborators,
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
    <div className="p-12 h-screen w-screen flex flex-col pt-[102px]">
      <div className="flex justify-between">
        <h1 className="text-center text-6xl p-4 font-bold">{title}</h1>
        <div className="flex flex-col">
          <h1 className="text-center text-6xl font-bold">
            Document Version:{version}
          </h1>
          <p className="text-2xl">
            Number of collaborators: {number_of_collaborators}
          </p>
          <p className="text-2xl">Current Viewers: </p>
        </div>
      </div>
      <ReactQuill
        value={value}
        onChange={handleChange}
        theme="snow"
        className="flex-1 mt-5"
      />
    </div>
  );
}

export default DocumentEditor;
