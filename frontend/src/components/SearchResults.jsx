import { useState } from "react";
import { Search, UserPlus } from "lucide-react";
import useSearch from "../hooks/useSearch";
import documentStore from "../store/documentStore";

export default function SearchResults() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const { searchUsers, addCollaborator } = useSearch();
  const documentId = documentStore((state) => state.documentId);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const results = await searchUsers(query);
    setSearchResults(results);
    setShowResults(true);
  };

  const handleUserSelect = async (user) => {
    const confirmed = window.confirm("Are you sure you want to add this user?");

    if (confirmed) {
      await addCollaborator(documentId, user.ID);
      setShowResults(false);
      setSearchQuery("");
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center bg-white rounded-lg p-2 shadow-sm border">
        <Search className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search users to collaborate..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowResults(true)}
          className="ml-2 outline-none bg-transparent w-64"
        />
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            {searchResults.map((user) => (
              <div
                key={user.ID}
                className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg cursor-pointer"
                onClick={() => handleUserSelect(user)}
              >
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {user.Username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{user.Username}</div>
                  <div className="text-sm text-gray-500">{user.Email}</div>
                </div>
                <UserPlus className="ml-auto text-blue-500" size={20} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
