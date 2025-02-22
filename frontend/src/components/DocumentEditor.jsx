import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import documentStore from "../store/documentStore";
import { Users, Eye, History } from "lucide-react";
import useSocket from "../hooks/useSocket";
import userStore from "../store/userStore";

function DocumentEditor() {
  const [value, setValue] = useState("");
  const quillRef = useRef(null);
  const {
    content,
    title,
    setContent,
    version,
    number_of_collaborators,
    documentId,
  } = documentStore();
  const { user } = userStore();
  const { sendMessage } = useSocket({
    documentId: documentId,
    userId: user,
    setValue: setValue,
    editorRef: quillRef.current,
  });

  useEffect(() => {
    if (content && !value) {
      setValue(content);
    }
  }, [content]);

  const handleChange = (content, delta, source, editor) => {
    if (source !== "user") return;
    setValue(content);
    setContent(content);
    sendMessage(delta.ops);
  };

  const modules = {
    toolbar: false,
    clipboard: {
      matchVisual: false,
    },
  };

  return (
    <div className="pt-[72px] min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-[1400px] mx-auto p-6">
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 break-words">
                {title}
              </h1>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <History className="text-blue-600 w-5 h-5" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Version</p>
                  <p className="text-lg font-bold text-blue-800">{version}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                <Users className="text-green-600 w-5 h-5" />
                <div>
                  <p className="text-sm text-green-600 font-medium">
                    Collaborators
                  </p>
                  <p className="text-lg font-bold text-green-800">
                    {number_of_collaborators}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg">
                <Eye className="text-purple-600 w-5 h-5" />
                <div>
                  <p className="text-sm text-purple-600 font-medium">Viewing</p>
                  <p className="text-lg font-bold text-purple-800">1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
          <ReactQuill
            ref={quillRef}
            value={value}
            onChange={handleChange}
            theme="snow"
            modules={modules}
            className="min-h-[60vh] bg-white rounded-lg"
            preserveWhitespace={true}
          />
        </div>
      </div>
    </div>
  );
}

export default DocumentEditor;
