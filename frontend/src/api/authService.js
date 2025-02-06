import apiClient from "./apiClient";

export const logIn = async (credentials) => {
  const response = await apiClient.post("/login", credentials);
  return response;
};

export const signUp = async (credentials) => {
  const response = await apiClient.post("/signup", credentials);
  return response;
};
