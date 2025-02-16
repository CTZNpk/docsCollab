import {
  createDocument,
  getDocumentFromId,
  getMyCollaborations,
  getMyDocuments,
} from "../api/documentService";
import documentStore from "../store/documentStore";

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

  const getDocCollabs = async () => {
    try {
      const data = await getMyCollaborations();
      if (data == null) {
        return [];
      }
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
      const document = await getDocumentFromId(docId);
      console.log("GETTTING THE DOCCCCCCCCC");
      console.log(document);
      const setDocument = documentStore.getState().setDocument;
      setDocument(document);
    } catch (e) {
      console.log(e);
    }
  };

  return { getDocs, createDoc, getDocFromId, getDocCollabs };
};

export default useDocs;
