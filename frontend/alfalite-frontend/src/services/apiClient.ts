// filepath: frontend/alfalite-frontend/src/services/apiClient.ts
/**
 * Cliente HTTP ligero para consumir la API de backend.
 *
 * - Lee la URL base de la variable de entorno VITE_API_URL (o usa un valor
 *   por defecto).
 * - Inserta automáticamente el token guardado en localStorage.
 * - Reconoce respuestas 401 y fuerza el logout redirigiendo al login.
 * - Devuelve JSON parseado o lanza un error con texto de respuesta.
 */

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337";

interface ApiOptions extends RequestInit {
  token?: string | null;
}

export async function apiFetch<T = any>(
  path: string,
  { token = localStorage.getItem("alfalite_token"), ...init }: ApiOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401) {
      // token inválido/expirado: obligar logout
      localStorage.removeItem("alfalite_token");
      window.location.href = "/";
    }
    const errText = await res.text();
    throw new Error(errText || res.statusText);
  }

  const text = await res.text();
  try {
    return text ? JSON.parse(text) : ({} as T);
  } catch {
    return text as unknown as T;
  }
}
