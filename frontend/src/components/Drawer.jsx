import React, { useEffect, useState } from "react";
import useDocs from "../hooks/useDocs";
import { FolderOpen, Users, ChevronRight } from "lucide-react";

export default function Drawer({ isOpen, setIsOpen }) {
  const { getDocs, getDocFromId, getDocCollabs } = useDocs();
  const [myDocs, setMyDocs] = useState([]);
  const [myCollaborationDocs, setMyCollaborationDocs] = useState([]);

  useEffect(() => {
    async function fetchDocs() {
      const docs = await getDocs();
      if (docs != myDocs) setMyDocs(docs);
    }
    async function fetchCollaborations() {
      const docs = await getDocCollabs();
      console.log("THIS SHOULD BE EMPTY HAHAH");
      console.log(docs);
      if (docs != myCollaborationDocs) setMyCollaborationDocs(docs);
    }
    fetchDocs();
    fetchCollaborations();
  }, [myDocs, myCollaborationDocs]);

  const handleClick = (docId) => {
    getDocFromId(docId);
    setIsOpen(false);
  };

  return (
    <div
      className={`fixed left-0 h-full lg:w-[30vw] md:w-[50vw] w-full bg-gradient-to-b from-blue-50 to-white shadow-xl 
        transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } top-[40px] overflow-y-auto`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <h1 className="text-2xl font-bold text-center">Document Library</h1>
          <p className="text-blue-100 text-center text-sm mt-1">
            All your documents in one place
          </p>
        </div>

        {/* My Documents Section */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FolderOpen className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-blue-900">
              My Documents
            </h2>
          </div>
          <div className="space-y-2">
            {myDocs?.map((item) => (
              <DrawerComp
                title={item.Title}
                key={item.ID}
                id={item.ID}
                handleClick={handleClick}
              />
            ))}
          </div>
        </div>

        {/* Collaborations Section */}
        {myCollaborationDocs.length > 0 && (
          <div className="p-6 bg-blue-50">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-blue-600" size={20} />
              <h2 className="text-lg font-semibold text-blue-900">
                Shared With Me
              </h2>
            </div>
            <div className="space-y-2">
              {myCollaborationDocs.map((item) => (
                <DrawerComp
                  title={item.Title}
                  key={item.ID}
                  id={item.ID}
                  handleClick={handleClick}
                  isShared
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DrawerComp({ title, id, handleClick, isShared }) {
  return (
    <div
      onClick={() => handleClick(id)}
      className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer
        ${
          isShared ? "bg-white hover:bg-blue-100" : "bg-white hover:bg-blue-100"
        }
        transition-all duration-200 shadow-sm hover:shadow-md`}
    >
      <span className="text-gray-700 group-hover:text-blue-800 font-medium">
        {title}
      </span>
      <ChevronRight
        className="text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all"
        size={16}
      />
    </div>
  );
}
