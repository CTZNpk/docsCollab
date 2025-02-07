import apiClient from "./apiClient";

export const logIn = async (credentials) => {
  const response = await apiClient.post("/login", credentials);
  return response.data;
};

export const signUp = async (credentials) => {
  const response = await apiClient.post("/signup", credentials);
  return response.data;
};
