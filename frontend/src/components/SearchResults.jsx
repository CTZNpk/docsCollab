import { useState } from "react";
import { Search, UserPlus } from "lucide-react";

export default function SearchResults({ currentDocId }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  //TODO
  const searchUsers = async (query) => {
    try {
      const response = await fetch(`/api/users/search?q=${query}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  };

  //TODO
  const addCollaborator = async (userId) => {
    try {
      const response = await fetch(
        `/api/documents/${currentDocId}/collaborators`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        },
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding collaborator:", error);
      throw error;
    }
  };

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

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowConfirmDialog(true);
    setShowResults(false);
  };

  const handleConfirmAdd = async () => {
    try {
      await addCollaborator(selectedUser.id);
      // Show success message or update UI
      setShowConfirmDialog(false);
      setSearchQuery("");
      setSelectedUser(null);
    } catch (error) {
      // Handle error
      console.error("Error adding collaborator:", error);
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
                key={user.id}
                className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg cursor-pointer"
                onClick={() => handleUserSelect(user)}
              >
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
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
