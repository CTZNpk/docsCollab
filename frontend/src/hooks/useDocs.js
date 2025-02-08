import { createDocument, getDocumentFromId, getMyDocuments } from "../api/documentService";

const useDocs = () => {
  const getDocs = async () => {
    try {
      const data = await getMyDocuments();
      return data;
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  const createDoc = async (docTitle) => {
    try {
      const data = await createDocument(docTitle);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  const getDocFromId = async (docId) => {
    try {
      const data = await getDocumentFromId(docId);
      console.log(data)
      return data
    } catch (e) {
      console.log(e);
    }

  }

  return { getDocs, createDoc, getDocFromId };
};

export default useDocs;
