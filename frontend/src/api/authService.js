import apiClient from "./apiClient";

export const logIn = async (credentials) => {
  const response = await apiClient.post("/login", credentials);
  return response.data;
};

export const signUp = async (credentials) => {
  const response = await apiClient.post("/signup", credentials);
  return response.data;
};

export const getUserFromToken = async (token) => {
  const response = await apiClient.get("/get-user", { protected: true });
  return response.data;
};
