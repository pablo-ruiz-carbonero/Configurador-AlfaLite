import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Todas las llamadas a /api y /auth se redirigen al backend
      // Así no hay problemas de CORS en desarrollo
      "/api": "http://localhost:1337",
      "/auth": "http://localhost:1337",
    },
  },
});
