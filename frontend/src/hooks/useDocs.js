import { createDocument, getMyDocuments } from "../api/documentService";

const useDocs = () => {
  const getDocs = async () => {
    try {
      const data = await getMyDocuments();
      console.log(data);
    } catch (e) {
      console.log(e);
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

  return { getDocs, createDoc };
};

export default useDocs;
