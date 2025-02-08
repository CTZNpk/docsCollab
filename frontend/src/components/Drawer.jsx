import React, { useEffect, useState } from "react";
import useDocs from "../hooks/useDocs";

export default function Drawer({ isOpen }) {
  const { getDocs, getDocFromId } = useDocs();

  const [myDocs, setMyDocs] = useState([]);

  useEffect(() => {
    async function fetchDocs() {
      const docs = await getDocs();
      setMyDocs(docs);
    }
    fetchDocs();

    return () => {
      console.log("Cleanup function running...");
    };
  }, []);

  const handleClick = (docId) => {
    getDocFromId(docId);
  }

  return (
    <div
      className={`fixed left-0 h-full w-[20vw] bg-blue-100 shadow-xl 
        transform transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      <div
        className="font-bold bg-blue-800 text-white p-10 text-center
        text-3xl"
      >
        My Documents
      </div>
      <div className="p-5 text-2xl">
        {myDocs &&
          myDocs.map((item) => {
            console.log(item);
            return <DrawerComp title={item.Title} key={item.ID} id={item.ID} handleClick={handleClick} />;
          })}
      </div>
    </div>
  );
}

function DrawerComp({ title, id, handleClick }) {
  return <div className="border-b-2 border-blue-900 p-5 "
    onClick={() => handleClick(id)}> {title}</div>;
}
