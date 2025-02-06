import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (config.protected) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      delete config.protected;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
export default apiClient;
