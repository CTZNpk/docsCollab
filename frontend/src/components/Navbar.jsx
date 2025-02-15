import { useState } from "react";
import { Search, Menu, X, Plus, BookOpen } from "lucide-react";
import useDocs from "../hooks/useDocs";
import SearchResults from "./SearchResults";

export default function Navbar({ toggleDrawer }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const { createDoc, getDocs, getDocFromId } = useDocs();

  const onAddDoc = () => {
    const docTitle = window.prompt("Enter Title Of Document:");
    createDoc(docTitle);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    const allDocs = await getDocs();
    const filtered = allDocs.filter((doc) =>
      doc.Title.toLowerCase().includes(query.toLowerCase()),
    );
    setSearchResults(filtered);
    setShowResults(true);
  };

  const handleDocumentClick = (docId) => {
    getDocFromId(docId);
    setShowResults(false);
    setSearchQuery("");
  };

  return (
    <nav className="fixed w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDrawer}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors duration-200"
            >
              <Menu className="text-white w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <BookOpen className="text-white w-7 h-7" />
              <a
                href="#"
                className="text-white text-xl font-bold tracking-tight"
              >
                Docs Collab
              </a>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center">
              <div className="relative">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-64 px-4 py-2 rounded-lg bg-blue-800/50 text-white placeholder-blue-300 
                      border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                      transition-all duration-200"
                  />
                  <Search className="absolute right-3 text-blue-300 w-5 h-5" />
                </div>
                {showResults && (
                  <div className="absolute w-full mt-2">
                    <SearchResults currentDocId={1} />
                  </div>
                )}
              </div>
            </div>

            <button
              className="md:hidden p-2 hover:bg-blue-700 rounded-lg transition-colors duration-200"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="text-white w-6 h-6" />
              ) : (
                <Search className="text-white w-6 h-6" />
              )}
            </button>

            <button
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 
                text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg
                transform hover:-translate-y-0.5"
              onClick={onAddDoc}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">New Doc</span>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isOpen && (
          <div className="md:hidden p-4 border-t border-blue-700">
            <div className="relative">
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-blue-800/50 text-white 
                  placeholder-blue-300 border border-blue-700 focus:outline-none 
                  focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-2.5 text-blue-300 w-5 h-5" />
            </div>
            {showResults && (
              <div className="mt-2">
                <SearchResults currentDocId={1} />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
