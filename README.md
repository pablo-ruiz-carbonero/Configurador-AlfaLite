# Configurador Alfalite

Este repositorio contiene una aplicación web para configurar pantallas Alfalite. Está dividida en dos partes:

- **Backend**: API REST construida con NestJS y PostgreSQL.
- **Frontend**: SPA React creada con Vite.

La estructura principal de carpetas es la siguiente:

```
backend/
  alfalite-backend/           ← NestJS API
frontend/
  alfalite-frontend/          ← React/Vite SPA
docs/                         ← documentación detallada adicional
utils/
```

---

## 🚀 Instalación y puesta en marcha (desde cero)

Sigue los pasos en orden para dejar el proyecto funcionando en desarrollo. Los comandos son idénticos en Windows, macOS y Linux, salvo donde se indique.

### 1. Requisitos previos

- Node.js ≥ 18 (se recomienda usar [nvm](https://github.com/nvm-sh/nvm) o sus variantes según el sistema).
- npm o yarn
- Docker y Docker‑Compose (para iniciar la base de datos de desarrollo)
- Git

### 2. Clonar el repositorio

```bash
git clone <url-del-repositorio> configurador-alfalite
cd configurador-alfalite
```

### 3. Variables de entorno

Copia los archivos de ejemplo y ajusta los valores:

```bash
# backend/alfalite-backend/.env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=alfalite_dev
DB_ADMIN_USER=alfalite_admin
DB_ADMIN_PASSWORD=changeme
JWT_SECRET_KEY=unaClaveMuySecreta

# frontend/alfalite-frontend/.env
VITE_API_URL=http://localhost:1337
```

El nombre de base de datos, usuario y contraseña puede modificarse, el script `init-db.sql` crea los roles necesarios.

### 4. Arrancar la base de datos

```bash
cd backend/alfalite-backend
docker-compose up -d
```

Verifica con `docker ps` que el contenedor `alfalite-database-dev` está en ejecución.

### 5. Iniciar el backend

```bash
cd backend/alfalite-backend
npm install   # o yarn
npm run start:dev
```

La API escucha en `http://localhost:1337` y la documentación Swagger está disponible en `http://localhost:1337/docs`.

### 6. Iniciar el frontend

```bash
cd frontend/alfalite-frontend
npm install
npm run dev
```

Abre el navegador en `http://localhost:5173`.

### 7. Construcción de producción

```bash
# backend
dnpm run build

# frontend
npm run build
```

Después puedes desplegar el backend con `node dist/main` y servir los archivos estáticos generados en `frontend/alfalite-frontend/dist`.

---

## 🖥 Instalación paso a paso por sistema operativo

| Componente     | Windows                                                      | macOS                                    | Linux (Ubuntu/Debian)             |
| -------------- | ------------------------------------------------------------ | ---------------------------------------- | --------------------------------- | ----- |
| Node / npm     | [nvm-windows](https://github.com/coreybutler/nvm)            | `brew install nvm` / `nvm install --lts` | `curl -fsSL https://get.nvm.sh    | bash` |
| Docker‑Compose | [Docker Desktop](https://docker.com/products/docker-desktop) | idem                                     | `sudo apt install docker-compose` |
| Editor         | VS Code                                                      | VS Code                                  | VS Code                           |
| Clonar repo    | PowerShell: `git clone ...`                                  | Terminal: `git clone ...`                | Terminal: `git clone ...`         |

> Los comandos de npm/yarn son idénticos en los tres sistemas.

---

## 📄 Documentación específica

- [Frontend](docs/frontend.md)
- [Backend](docs/backend.md)

---

## 🧪 Pruebas

- **Backend**: `npm run test` (unitarias) y `npm run test:e2e` desde `backend/alfalite-backend`.
- **Frontend**: actualmente no hay pruebas, se puede añadir Jest/RTL.

---
