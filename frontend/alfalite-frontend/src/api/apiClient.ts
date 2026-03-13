import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:1337"; // URL base de la API, configurable vía .env

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

// Interceptores para manejar tokens y errores globales
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("alfalite_token");
  if (!token) {
    return Promise.reject({ message: "No autorizado" });
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data, // devuelve solo el payload
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("alfalite_token");
      window.location.href = "/admin"; // redirige a login si no autorizado
    }
    return Promise.reject(error.response?.data || error.message || "API Error");
  },
);

export default apiClient;
