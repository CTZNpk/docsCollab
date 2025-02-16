import { addDocumentCollaborator } from "../api/documentService";
import { searchUserFromBackend } from "../api/userService";
import documentStore from "../store/documentStore";

const useSearch = () => {
  const searchUsers = async (query) => {
    try {
      const data = await searchUserFromBackend(query);
      if (data == null) return [];
      return data;
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  };

  const addCollaborator = async (documentId, userId) => {
    try {
      const data = await addDocumentCollaborator(documentId, userId);
      return data;
    } catch (error) {
      console.error("Error adding collaborator:", error);
      throw error;
    }
  };

  return { searchUsers, addCollaborator };
};

export default useSearch;
