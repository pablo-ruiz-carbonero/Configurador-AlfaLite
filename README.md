# Configurador Alfalite

Este repositorio contiene una aplicación web para configurar pantallas LED Alfalite. La solución está dividida en dos componentes principales:

- **Backend**: API REST construida con NestJS y PostgreSQL
- **Frontend**: Single Page Application desarrollada con React y Vite

## Estructura del Proyecto

```
backend/
  alfalite-backend/           Servidor API NestJS
frontend/
  alfalite-frontend/          Aplicación React/Vite
docs/                         Documentación técnica
utils/                        Utilidades compartidas
```

---

## Instalación y Puesta en Marcha (Desde Cero)

Siga los pasos en orden para configurar el proyecto en su entorno de desarrollo. Los comandos funcionan de forma idéntica en Windows, macOS y Linux, excepto donde se indique explícitamente.

### 1. Requisitos Previos

- Node.js versión 18 o superior (recomendado usar [nvm](https://github.com/nvm-sh/nvm) para gestionar versiones)
- npm o yarn como gestor de paquetes
- Docker y Docker Compose para la infraestructura de base de datos
- Git para control de versiones

### 2. Clonar el Repositorio

```bash
git clone <url-del-repositorio> configurador-alfalite
cd configurador-alfalite
```

### 3. Configurar Variables de Entorno

Asigne las variables de entorno requeridas para ambos componentes:

**Backend** - Crear archivo `backend/alfalite-backend/.env`:

```bash
# Configuración de base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=alfalite_db
DB_ADMIN_USER=alfalite_admin
DB_ADMIN_PASSWORD=password123

# Configuración de aplicación
PORT=1337
ENVIRONMENT=development
JWT_SECRET_KEY=tu_clave_secreta_jwt

# Configuración de email
EMAIL_HOST=localhost
EMAIL_PORT=1025
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=noreply@alfalite.com
QUOTE_RECIPIENT=ventas@alfalite.com
```

**Frontend** - Crear archivo `frontend/alfalite-frontend/.env`:

```bash
VITE_API_URL=http://localhost:1337
```

Nota: Los valores de base de datos pueden ajustarse según sus preferencias. El script `init-db.sql` creará los roles y tablas necesarios automáticamente.

### 4. Inicializar la Infraestructura de Base de Datos

Ejecute Docker Compose para levantar la base de datos PostgreSQL y el servidor de email (Mailhog) para desarrollo:

```bash
cd backend/alfalite-backend
docker-compose up -d
```

Verifique el estado de los contenedores:

```bash
docker ps
```

Debe ver dos contenedores en ejecución: `alfalite-database-dev` (PostgreSQL) y `alfalite-mailhog` (servidor de emails).

### 5. Instalar Dependencias del Backend

```bash
cd backend/alfalite-backend
npm install
```

### 6. Iniciar el Servidor Backend

```bash
cd backend/alfalite-backend
npm run start:dev
```

El servidor API estará disponible en `http://localhost:1337`. La documentación interactiva de Swagger se encuentra en `http://localhost:1337/docs`.

### 7. Instalar Dependencias del Frontend

En una nueva terminal:

```bash
cd frontend/alfalite-frontend
npm install
```

### 8. Iniciar el Servidor Frontend

```bash
cd frontend/alfalite-frontend
npm run dev
```

Abra su navegador en `http://localhost:5173` para acceder a la aplicación.

### 9. Verificar la Instalación

1. Frontend disponible en `http://localhost:5173`
2. Backend disponible en `http://localhost:1337`
3. Documentación Swagger en `http://localhost:1337/docs`
4. Interfaz de emails (Mailhog) disponible en `http://localhost:8025`

---

## Guía de Despliegue en Producción

### Construcción de Artifacts

Compile ambos componentes para producción:

```bash
# Compilar backend
cd backend/alfalite-backend
npm run build

# Compilar frontend
cd frontend/alfalite-frontend
npm run build
```

Esto generará:

- Backend: directorio `dist/` con el código compilado
- Frontend: directorio `dist/` con archivos optimizados para servir

### Despliegue del Backend

1. **Transferir artifacts**: Copie el directorio `dist` del backend al servidor de producción.

2. **Instalar dependencias necesarias**:

   ```bash
   npm install --production
   ```

3. **Configurar variables de entorno para producción**:

   ```bash
   # Actualizar .env con valores de producción
   DB_HOST=<host-base-datos-produccion>
   DB_PORT=5432
   DB_NAME=alfalite
   DB_ADMIN_USER=<usuario-prod>
   DB_ADMIN_PASSWORD=<contraseña-segura>
   JWT_SECRET_KEY=<clave-jwt-muy-segura>
   EMAIL_HOST=<servidor-smtp>
   EMAIL_PORT=587
   EMAIL_USER=<usuario-smtp>
   EMAIL_PASS=<contraseña-smtp>
   PORT=1337
   ENVIRONMENT=production
   ```

4. **Iniciar el servidor**: Utilice un gestor de procesos como PM2 o systemd:
   ```bash
   node dist/main
   ```

### Despliegue del Frontend

1. **Transferir artifacts estáticos**: Copie el contenido de `frontend/alfalite-frontend/dist` a su servidor web.

2. **Servir con nginx**:

   ```nginx
   server {
       listen 80;
       server_name example.com;

       location / {
           root /var/www/alfalite;
           try_files $uri $uri/ /index.html;
       }

       location /api/ {
           proxy_pass http://localhost:1337;
       }
   }
   ```

3. **Servir con Apache**:
   Habilite el módulo `mod_rewrite` y configure una `.htaccess`:
   ```apache
   <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteBase /
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
   </IfModule>
   ```

### Variables de Entorno para Producción

**Backend** - Recomendaciones de seguridad:

- Utilice secretos gestionados (AWS Secrets Manager, Azure Key Vault, etc.)
- Implemente HTTPS en la comunicación API
- Configure CORS apropiadamente para su dominio
- Use contraseñas fuertes para la base de datos
- Asigne una clave JWT única y segura

**Frontend** - Actualice la variable de URL de API:

```bash
VITE_API_URL=https://api.example.com
```

### Consideraciones de Seguridad

1. Implemente certificados SSL/TLS en ambos servidores
2. Configure firewall para restringir acceso SSH
3. Habilite auditoría y logging en la base de datos
4. Implemente rate limiting en la API
5. Actualice regularmente todas las dependencias
6. Configure copias de seguridad automáticas de la base de datos
7. Implemente monitoreo y alertas para el sistema en producción

---

## Instalación por Sistema Operativo

| Componente  | Windows                                                      | macOS                                                        | Linux (Ubuntu/Debian)                       |
| ----------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------- |
| Node / npm  | [nvm-windows](https://github.com/coreybutler/nvm)            | `brew install nvm` & `nvm install --lts`                     | `curl -fsSL https://get.nvm.sh \| bash`     |
| Docker      | [Docker Desktop](https://docker.com/products/docker-desktop) | [Docker Desktop](https://docker.com/products/docker-desktop) | `sudo apt install docker.io docker-compose` |
| Editor      | Visual Studio Code                                           | Visual Studio Code                                           | Visual Studio Code                          |
| Clonar repo | PowerShell: `git clone ...`                                  | Terminal: `git clone ...`                                    | Terminal: `git clone ...`                   |

Nota: Los comandos npm y yarn son idénticos en los tres sistemas operativos.

---

## Documentación Técnica

- [Documentación del Frontend](docs/frontend.md)
- [Documentación del Backend](docs/backend.md)

---

## Pruebas Automatizadas

**Backend**: Ejecute las pruebas desde el directorio `backend/alfalite-backend`:

```bash
# Pruebas unitarias
npm run test

# Pruebas end-to-end
npm run test:e2e
```

**Frontend**: Las pruebas aún no están implementadas. Se puede agregar Jest y React Testing Library en futuras versiones.

---

## Soporte y Contribuciones

Para reportar problemas o sugerencias, por favor contacte al equipo de desarrollo.

---
