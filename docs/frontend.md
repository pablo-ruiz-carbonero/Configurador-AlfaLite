# Frontend - alfalite-frontend

Single-Page Application (SPA) desarrollada con React 18, Vite y TypeScript. Proporciona interfaz de usuario para autenticación, configuración de pantallas LED y panel administrativo.

## Estructura del Proyecto

```
frontend/alfalite-frontend/
  public/                      Activos estáticos (imágenes, favicon, etc.)
  src/
    assets/                    Recursos de medios (logos, imágenes)
    components/                Componentes reutilizables organizados por funcionalidad
      configurator/            Componentes del configurador de pantallas LED
      dashboard/               Componentes del panel administrativo
    hooks/                     Hooks personalizados para lógica de estado
    pages/                     Páginas principales (Auth, Configurator, Dashboard)
    api/                       Funciones de comunicación con API
    types/                     Definiciones de tipos TypeScript
    utils/                     Funciones auxiliares reutilizables
    App.tsx                    Enrutamiento y configuración de rutas protegidas
    main.tsx                   Punto de entrada de la aplicación
  package.json                 Dependencias del proyecto
  tsconfig.json                Configuración de TypeScript
  vite.config.ts               Configuración de Vite
```

## Configuración del Entorno

El proyecto utiliza variables de entorno con prefijo `VITE_` que Vite expone automáticamente en `import.meta.env`:

- `VITE_API_URL` - URL base de la API (ejemplo: `http://localhost:1337`)

Cree un archivo `.env` en la raíz del proyecto:

```
VITE_API_URL=http://localhost:1337
```

## Scripts Disponibles

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

- `npm run dev` - Inicia servidor de desarrollo en `http://localhost:5173`
- `npm run build` - Compila TypeScript y genera versión de producción en carpeta `dist`
- `npm run lint` - Ejecuta ESLint para verificar código
- `npm run preview` - Previsualiza versión compilada antes de desplegar

## Componentes Principales

### Páginas

**Auth.tsx** - Autenticación

- Proporciona formulario de login y registro
- Envia credenciales al endpoint `/auth/login`
- Almacena JWT en localStorage para sesiones posteriores
- Redirige a dashboard si el usuario ya está autenticado

**ConfiguratorPage.tsx** - Configurador interactivo

- Permite a usuarios adicionar productos LED virtuales
- Controles para dimensiones (alto/ancho en pies o metros)
- Generación de PDF con especificaciones
- Envío de solicitud de cotización por email
- Cálculo automático de estadísticas (resolución, consumo, peso)

**Dashboard.tsx** - Panel administrativo protegido

- Listado de todos los productos con búsqueda
- Crear nuevos productos
- Editar especificaciones existentes
- Eliminar productos
- Cargar imágenes de productos

### Componentes Reutilizables

**configurator/**

- `ProductList.tsx` - Listado de productos disponibles con filtros
- `ProductFilters.tsx` - Controles para filtrar productos por especificaciones
- `DimensionsControls.tsx` - Entrada de dimensiones en diferentes unidades
- `ScreenCanvas.tsx` - Visualización interactiva de pantalla configurada
- `ResultsData.tsx` - Mostrar estadísticas calculadas
- `ModalButtons.tsx` - Botones de acción (Generar PDF, Solicitar cotización)

**dashboard/**

- `ProductCard.tsx` - Tarjeta individual con información de producto
- `ProductFormModal.tsx` - Formulario modal para crear/editar productos
- `ProductDetailModal.tsx` - Vista detallada de especificaciones de producto
- `ConfirmDeleteModal.tsx` - Confirmación de eliminación de producto
- `DashboardNav.tsx` - Navegación del panel administrativo

## Hooks Personalizados

### useProducts

Gestiona estado de productos del configurador (públicos):

```typescript
const {
  products, // Array de productos disponibles
  loading, // Indicador de carga
  error, // Mensaje de error si existe
  refetch, // Función para recargar datos
} = useProducts();
```

### useProductsWithCRUD

Gestiona estado de productos administrativos con operaciones CRUD:

```typescript
const {
  products, // Array de productos
  loading, // Indicador de carga
  selectedProduct, // Producto actualmente seleccionado
  formData, // Datos del formulario
  error, // Mensaje de error
  setSelectedProduct, // Actualizar producto seleccionado
  setFormData, // Actualizar campos del formulario
  refetch, // Recargar desde servidor
  handleCreate, // Crear nuevo producto
  handleUpdate, // Actualizar producto existente
  handleDelete, // Eliminar producto
} = useProductsWithCRUD();
```

## Comunicación con API

Archivo `src/api/apiClient.ts` centraliza todas las llamadas HTTP:

- Gestiona tokens JWT automáticamente en headers
- Maneja redirección en caso de 401 Unauthorized
- Proporciona métodos tipados para cada endpoint

Archivo `src/api/products.ts` define funciones específicas de dominio:

- `getPublicProducts()` - Obtener productos disponibles (público)
- `getProductById(id)` - Obtener detalles de un producto (público)
- `sendQuoteRequest(data)` - Enviar cotización por email
- `generatePdf(data)` - Generar PDF de configuración
- `getDashboardProducts()` - Obtener todos los productos (admin)
- `createProduct(data)` - Crear nuevo producto
- `updateProduct(id, data)` - Actualizar producto existente
- `deleteProduct(id)` - Eliminar producto

## Autenticación y Rutas Protegidas

El componente `PrivateRoute` en `App.tsx`:

- Verifica existencia de JWT en localStorage
- Redirige a página de login si no hay token válido
- Permite acceso a rutas administrativas solo con credenciales válidas
- Valida token al montar componentes protegidos

## Estilos

- Estilos globales en `src/index.css`
- Estilos específicos de página en archivos `.css` correspondientes
- Estilos de componentes usando CSS modules o inline

## Manejo de Imágenes

Las imágenes de productos se almacenan en el backend:

- Ruta de acceso: `{API_URL}/uploads/images/{nombreArchivo}`
- Se cargan dinámicamente en componentes ProductCard
- Soporte para formatos: JPEG, PNG, WebP, AVIF

## Despliegue en Producción

1. Compile la aplicación:

```bash
npm run build
```

2. Sirva la carpeta `dist` con un servidor web estático:

```bash
# Usando Node.js con http-server
npx http-server dist

# O con Python
python -m http.server 3000 --directory dist

# O con nginx/Apache (ver README.md para configuración)
```

3. Configure la variable `VITE_API_URL` apuntando a su API en producción

## Mejoras Futuras

1. Implementar React Query o SWR para caché automático de datos
2. Agregar paginación a listados de productos
3. Implementar búsqueda avanzada con filtros múltiples
4. Agregar validación de formularios más robusta con bibliotecas como React Hook Form
5. Implementar notificaciones globales (toasts) para acciones
6. Agregar pruebas automatizadas con Jest y React Testing Library
7. Implementar gestión de estado con Context API o Redux para aplicaciones más grandes
8. Agregar soporte para múltiples idiomas (i18n)
9. Mejorar accesibilidad (WCAG 2.1) con ARIA labels y navegación por teclado
10. Implementar PWA (Progressive Web App) para funcionalidad offline

## Tecnologías Utilizadas

- **React 18**: Biblioteca UI con hooks y functional components
- **Vite**: Build tool y dev server ultra-rápido
- **TypeScript**: Lenguaje tipado para mayor seguridad
- **axios**: Cliente HTTP para comunicación con backend
- **ESLint**: Validación de código y best practices
- **Tailwind CSS / CSS Modules**: Estilos (según configuración del proyecto)

---
