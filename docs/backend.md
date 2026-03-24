# Backend - alfalite-backend

API REST desarrollada con NestJS (versión 11), TypeScript y TypeORM sobre PostgreSQL.

## Estructura del Proyecto

```
backend/alfalite-backend/
  src/
    auth/                   Módulo de autenticación y JWT
      controllers/          Controladores de autenticación
      dto/                  Data Transfer Objects
      entities/             Definición de entidad Usuario
      guards/               Guardias JWT
      strategies/           Estrategias Passport
    api/                    Módulo principal de manejo de productos
      Configurator/         Submódulo para configuración de pantallas LED
      Dashboard/            Submódulo para gestión de productos
      dto/                  Data Transfer Objects
      entities/             Definición de entidad Producto
    app.module.ts           Módulo raíz
    main.ts                 Punto de entrada de la aplicación
  docker-compose.yml        Configuración para PostgreSQL y Mailhog
  init-db.sql               Script de inicialización de base de datos
  package.json              Dependencias del proyecto
  tsconfig.json             Configuración de TypeScript
```

## Configuración del Entorno

El proyecto utiliza el módulo `@nestjs/config` para cargar las variables de entorno desde un archivo `.env`. Un `ValidationPipe` global se configura en `main.ts` para limpiar campos innecesarios y validar tipos automáticamente.

Ejemplo de configuración de conexión a base de datos:

```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: "postgres",
    host: config.get<string>("DB_HOST"),
    port: +config.get<number>("DB_PORT"),
    username: config.get<string>("DB_ADMIN_USER"),
    password: config.get<string>("DB_ADMIN_PASSWORD"),
    database: config.get<string>("DB_NAME"),
    autoLoadEntities: true,
    synchronize: false,
  }),
});
```

Las variables de entorno obligatorias se definen en el archivo `.env` en la raíz del directorio backend.

## Sistema de Autenticación

El sistema implementa:

- Estrategia JWT con Passport para autenticación sin sesión
- El servicio `AuthService` maneja registro de nuevos usuarios y validación de credenciales
- Tokens JWT firmados con la clave `JWT_SECRET_KEY` configurada en variables de entorno
- El guard `JwtAuthGuard` protege las rutas del módulo API requiriendo un token válido
- Las contraseñas se hashean con bcrypt para almacenamiento seguro

## Endpoints Principales

### Autenticación (Acceso Público)

| Método | Ruta             | Descripción                     |
| ------ | ---------------- | ------------------------------- |
| POST   | `/auth/login`    | Iniciar sesión con credenciales |
| POST   | `/auth/register` | Registrar nuevo usuario         |

### Configurador de Pantallas LED (Acceso Público)

| Método | Ruta                             | Descripción                              |
| ------ | -------------------------------- | ---------------------------------------- |
| GET    | `/api/configurator/products`     | Obtener lista de productos disponibles   |
| GET    | `/api/configurator/products/:id` | Obtener detalles técnicos de un producto |
| POST   | `/api/configurator/quote`        | Enviar solicitud de cotización           |
| POST   | `/api/configurator/pdf`          | Generar PDF de configuración             |

### Dashboard de Administración (Requiere JWT)

| Método | Ruta                          | Descripción                                |
| ------ | ----------------------------- | ------------------------------------------ |
| GET    | `/api/dashboard/products`     | Obtener lista de todos los productos       |
| GET    | `/api/dashboard/products/:id` | Obtener detalles de un producto específico |
| POST   | `/api/dashboard/products`     | Crear nuevo producto                       |
| PATCH  | `/api/dashboard/products/:id` | Actualizar información de producto         |
| DELETE | `/api/dashboard/products/:id` | Eliminar producto                          |

La documentación interactiva de Swagger está disponible en `/docs`. Los parámetros de ruta `:id` se validan automáticamente con `ParseIntPipe`.

## Entidades y Data Transfer Objects

### Entidades

**User** (auth/entities/user.entity.ts):

- `id`: Identificador único del usuario
- `username`: Nombre de usuario único
- `password_hash`: Contraseña hasheada con bcrypt

**Product** (api/entities/product.entity.ts):

- Contiene especificaciones técnicas de pantallas LED
- Incluye dimensiones, resolución, consumo energético
- Almacena opciones de personalización disponibles

### Data Transfer Objects (DTOs)

Los DTOs validan datos de entrada utilizando decoradores de `class-validator`:

- `CreateQuoteDto`: Valida información de cliente y configuración para cotizaciones
- `CreatePdfDto`: Valida parámetros para generación de PDFs
- `CreateApiDto`: Valida campos requeridos al crear nuevos productos
- `UpdateApiDto`: Valida campos opcionales al actualizar productos
- `LoginDto`: Valida credenciales de acceso

Todos incluyen decoradores `@ApiProperty` para documentación automática en Swagger.

## Servicios Principales

### AuthService

Gestiona toda la lógica de autenticación:

- `register(username, password)`: Crear nueva cuenta con contraseña hasheada
- `login(username, password)`: Validar credenciales y generar JWT
- `validateUser(username, password)`: Verificar usuario contra contraseña

### ApiService (Configurador)

Maneja operaciones públicas del configurador:

- `findAll()`: Obtener lista completa de productos LED disponibles
- `findOne(id)`: Recuperar especificaciones técnicas detalladas de un producto
- `createQuote(dto)`: Procesar solicitud de cotización y enviar email formateado
- `createPdf(dto)`: Generar PDF con especificaciones usando Puppeteer

Métodos auxiliares:

- `calculateStats(dto)`: Convertir dimensiones a unidades seleccionadas, calcular resolución y consumo
- `generateEmailContent(data)`: Formatear datos de cotización para email
- `generatePdfHtml(data)`: Crear template HTML con CSS para PDF

### ApiService (Dashboard)

Implementa operaciones administrativas protegidas:

- CRUD completo de productos con validación de JWT
- Gestión de imágenes y especificaciones técnicas

## Tecnologías Utilizadas

- **NestJS 11.0.1**: Framework para aplicaciones servidoras escalables con TypeScript
- **TypeORM**: ORM para mapeo objeto-relacional con PostgreSQL
- **Passport**: Middleware de autenticación modular
- **bcrypt**: Hashing de contraseñas con salt automático
- **nodemailer**: Envío de correos electrónicos vía SMTP
- **Puppeteer**: Generación de PDFs desde templates HTML
- **PostgreSQL**: Base de datos relacional
- **Swagger**: Documentación automática e interactiva de API
- **class-validator**: Validación declarativa de clase

## Inicio Rápido en Desarrollo

1. Instale las dependencias:

```bash
cd backend/alfalite-backend
npm install
```

2. Configure las variables de entorno en un archivo `.env` en la raíz del backend

3. Inicie el servidor en modo desarrollo:

```bash
npm run start:dev
```

La aplicación está disponible en `http://localhost:1337` e incluye:

- API REST en `/`
- Documentación Swagger en `/docs`

## Despliegue en Producción

1. Compile el proyecto TypeScript:

```bash
npm run build
```

2. Instale solo las dependencias de producción:

```bash
npm ci --only=production
```

3. Inicie el servidor compilado:

```bash
node dist/main
```

Para mantener el servidor activo, use PM2:

```bash
pm2 start dist/main --name "alfalite-api"
pm2 save
pm2 startup
```

O configure un servicio systemd para automatizar reinicio tras reboot.

## Pruebas

Ejecute las pruebas automatizadas:

```bash
# Pruebas unitarias simples
npm run test

# Pruebas en modo observación (re-run al modificar archivos)
npm run test:watch

# Pruebas con reporte de cobertura
npm run test:cov

# Pruebas end-to-end
npm run test:e2e
```

Las pruebas e2e usan SuperTest para realizar peticiones HTTP reales contra la aplicación.

## Variables de Entorno Requeridas

```
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_ADMIN_USER=admin
DB_ADMIN_PASSWORD=securepassword
DB_NAME=alfalite_db

# Autenticación JWT
JWT_SECRET_KEY=your_secret_key_min_32_chars

# Email (cotizaciones)
EMAIL_HOST=localhost
EMAIL_PORT=1025
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=noreply@alfalite.com

# Puertos de servidor
PORT=1337
```

## Mejoras Futuras

1. Implementar logging centralizado con Winston para monitoreo en producción
2. Agregar filtro global de excepciones para estandarizar respuestas de error
3. Implementar soporte para subida de imágenes de productos con validación
4. Añadir paginación y búsqueda avanzada en listados de productos
5. Implementar caché distribuido con Redis para optimizar consultas frecuentes
6. Agregar rate limiting por IP para proteger endpoints públicos
7. Implementar auditoría de cambios en base de datos con triggering
8. Agregar validación de dominios de email en las solicitudes de cotización

---
