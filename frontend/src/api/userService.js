import apiClient from "./apiClient";

export const searchUserFromBackend = async (searchWord) => {
  const response = await apiClient.post(
    "/search-user",
    { user_name: searchWord },
    { protected: true },
  );
  return response.data;
};
