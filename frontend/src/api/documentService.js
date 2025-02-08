import apiClient from "./apiClient";

export const createDocument = async (title) => {
  const response = await apiClient.post(
    "/create-doc",
    {
      title: title,
    },
    {
      protected: true,
    },
  );
  return response;
};

export const getMyDocuments = async () => {
  const response = await apiClient.get("/get-my-docs", { protected: true });
  return response.data;
};

export const getDocumentFromId = async (documentId) => {

  const response = await apiClient.post("/get-doc", { document_id: documentId, }, { protected: true, });
  return response.data;
}
