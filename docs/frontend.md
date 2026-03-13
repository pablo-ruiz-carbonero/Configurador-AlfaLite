# Frontend – alfalite-frontend

El frontend es una single-page application desarrollada con React y Vite. Permite a los usuarios iniciar sesión, ver y gestionar productos en un panel de control.

## 📁 Estructura relevante

```
frontend/alfalite-frontend/
  public/                      ← activos estáticos (imágenes, favicon, etc.)
  src/
    assets/                    ← recursos (logos, imágenes, etc.)
    components/                ← componentes reutilizables
    pages/                     ← páginas principales (Auth, Dashboard)
    App.tsx                    ← configuración de rutas y PrivateRoute
    main.tsx                   ← punto de entrada
  package.json
  tsconfig.json
  vite.config.ts
```

## ⚙ Variables de entorno

- `VITE_API_URL` – URL base de la API (por ejemplo `http://localhost:1337`).
  Vite sólo lee variables con prefijo `VITE_`.

Crea un fichero `.env` en la raíz del proyecto con dicha variable.

## 📦 Scripts disponibles

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

- `npm run dev` – servidor de desarrollo en `localhost:5173`.
- `npm run build` – genera el paquete de producción en `dist`.
- `npm run lint` – ejecuta ESLint con reglas de TypeScript y React.

## 📝 Componentes clave

- **Auth.tsx** – formulario de login/registro. Envía credenciales al endpoint `/auth/login` y guarda el JWT en `localStorage`.
- **Dashboard.tsx** – pantalla principal; lista productos, permite crear, editar, borrar y buscar. La URL de la API se lee de `import.meta.env.VITE_API_URL`.
- **PrivateRoute** (en `App.tsx`) – comprueba la existencia del token JWT y redirige al login en caso contrario.

## 🛠 Mejoras aplicadas y sugeridas

- Corregido el typo `constrat` a `contrast` en el tipo `Product` para concordar con el backend.
- Añadidos comentarios y validaciones básicas de formulario con mensajes.
- Se creó `src/services/apiClient.ts` que centraliza todas las llamadas `fetch` y maneja tokens/errores.
- Se introdujo el hook `useProducts` (`src/hooks/useProducts.ts`) para separar la lógica de peticiones y estado de los componentes.
  - ahora internamente utiliza un hook genérico `useApi` (`src/hooks/useApi.ts`) que abstrae la carga inicial,
    el estado `loading`/`error` y la recarga (`refetch`). Esto evita duplicar código cuando se añadan
    otros endpoints y resuelve el bug del «bucle infinito» de carga porque la petición se dispara
    **una sola vez** al montar el hook.
- El cliente HTTP (`apiClient`) está tipado para devolver directamente `T` en vez de
  `AxiosResponse<T>`, por lo que no es necesario acceder a `.data` en cada llamada.
- Todos los `fetch` comprueban `response.ok` y redirigen en caso de 401.

### Ideas de ampliación

- Usar `React Query` o `axios` para manejar solicitudes y caché.
- Extraer lógica de datos a hooks (`useProducts`, `useAuth`).
- Añadir pruebas con Jest y React Testing Library.
- Implementar manejo de errores global y notificaciones.

---

**Estilos**

Los estilos globales están en `src/index.css`; cada página tiene su propio archivo `.css`.

**Assets**

Las imágenes subidas al backend se exponen vía `uploads/` y se cargan utilizando la ruta completa (`${API_URL}/uploads/...`).
