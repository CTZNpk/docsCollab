import { create } from "zustand";

const documentStore = create((set) => ({
  documentId: null,
  content: "content",
  title: "My Document",
  version: 0,
  number_of_collaborators: 0,

  setDocument: (document) =>
    set({
      content: document.content,
      title: document.title,
      version: document.versions,
      documentId: document.document_id,
      number_of_collaborators: document.number_of_collaborators,
    }),

  setContent: (newContent) => set({ content: newContent }),

  incrementVersion: () => set((state) => ({ version: state.version + 1 })),
}));

export default documentStore;
