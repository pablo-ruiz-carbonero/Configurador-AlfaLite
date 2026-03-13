import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:1337";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

// Inserta el token JWT en cada petición si existe
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("alfalite_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // IMPORTANTE: no rechazar aquí si no hay token.
  // Si falta el token el backend responderá 401 y el interceptor
  // de respuesta lo manejará limpiamente.
  return config;
});

// Maneja errores globales: 401 → logout y redirige al login
apiClient.interceptors.response.use(
  (response) => response.data, // desenvuelve el payload directamente
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("alfalite_token");
      window.location.href = "/admin";
    }
    return Promise.reject(error.response?.data || error.message || "API Error");
  },
);

export default apiClient;
