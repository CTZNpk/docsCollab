import React, { useEffect, useState } from "react";
import useDocs from "../hooks/useDocs";

export default function Drawer({ isOpen }) {
  const { getDocs } = useDocs();

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

  return (
    <div
      className={`fixed left-0 h-full w-[300px] bg-blue-100 shadow-xl 
        transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
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
            return <DrawerComp title={item.Title} key={item.ID} />;
          })}
      </div>
    </div>
  );
}

function DrawerComp({ title }) {
  return <div className="border-b-2 border-blue-900 p-5 "> {title}</div>;
}
