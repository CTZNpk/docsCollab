import { useState } from "react";
import { Search, Menu, X, Plus, BookOpen } from "lucide-react";
import useDocs from "../hooks/useDocs";
import SearchResults from "./SearchResults";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import userStore from "../store/userStore";

export default function Navbar({ toggleDrawer }) {
  const [isOpen, setIsOpen] = useState(false);
  const { createDoc } = useDocs();
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const { user } = userStore();

  const onAddDoc = () => {
    const docTitle = window.prompt("Enter Title Of Document:");
    createDoc(docTitle);
  };

  const navigateToAuth = () => {
    navigate("/auth");
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
            {user && (

              <>
              <div className="hidden md:flex items-center">
                <SearchResults />
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
</>
            )}

            <button
              className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-500 
                text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg
                transform hover:-translate-y-0.5"
              onClick={user ? handleLogout : navigateToAuth}
            >
              <span className="font-medium">
                {user ? "Log Out" : "Sign In"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isOpen && (
          <div className="md:hidden p-4 border-t border-blue-700">
            <SearchResults />
          </div>
        )}
      </div>
    </nav>
  );
}
