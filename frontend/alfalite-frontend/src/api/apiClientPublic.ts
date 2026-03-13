import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:1337";

const apiClientPublic = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor para devolver solo payload
apiClientPublic.interceptors.response.use(
  (response) => response.data,
  (error) =>
    Promise.reject(error.response?.data || error.message || "API Error"),
);

export default apiClientPublic;
