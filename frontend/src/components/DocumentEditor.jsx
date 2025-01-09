
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function DocumentEditor() {
  const [value, setValue] = useState("");

  const handleChange = (content, delta, source, editor) => {
    setValue(content);
  };

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
