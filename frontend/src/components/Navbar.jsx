import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import useDocs from "../hooks/useDocs";

export default function Navbar({ toggleDrawer }) {
  const [isOpen, setIsOpen] = useState(false);
  const { createDoc } = useDocs();

  const onAddDoc = () => {
    const docTitle = window.prompt("Enter Title Of Document:");
    createDoc(docTitle);
  };

  return (
    <nav className="w-full bg-blue-900 p-5 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-3xl font-bold">
          <button onClick={toggleDrawer} className="mr-4 text-white p-5">
            ☰
          </button>
          <a href="#">Docs Collab</a>
        </div>
        <div className="flex gap-4">
          <div className="hidden md:flex items-center bg-white rounded-lg p-2">
            <Search className="text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="ml-2 outline-none bg-transparent"
            />
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Search size={28} />}
          </button>

          <button
            className="p-4 bg-blue-800 text-white rounded-full 
            text-xl hover:bg-blue-600"
            onClick={onAddDoc}
          >
            + Add Doc
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-blue-900 p-4 mt-2">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 rounded-lg bg-white text-black outline-none"
          />
        </div>
      )}
    </nav>
  );
}
