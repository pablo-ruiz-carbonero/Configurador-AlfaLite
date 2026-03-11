// filepath: frontend/alfalite-frontend/src/services/apiClient.ts

/**
 * Cliente HTTP basado en Axios para consumir la API.
 *
 * - Lee la URL base de VITE_API_URL
 * - Inserta automáticamente el token guardado en localStorage
 * - Detecta 401 y fuerza logout
 * - Devuelve directamente res.data
 */

import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * Inserta automáticamente el token
 */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("alfalite_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Response interceptor
 * Maneja errores globales
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("alfalite_token");
      window.location.href = "/";
    }

    return Promise.reject(error.response?.data || error.message || "API Error");
  },
);

export default apiClient;
