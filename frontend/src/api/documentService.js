import apiClient from "./apiClient";

export const createDocument = async (title) => {
  const response = await apiClient.post("/create-doc", title);
  return response;
};
