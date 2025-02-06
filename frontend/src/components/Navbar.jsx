import { useState } from "react";
import { Search, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-900 p-5 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <a href="#" className="text-white text-xl font-bold">
          Docs Collab
        </a>

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
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
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
