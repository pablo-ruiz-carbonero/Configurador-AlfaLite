# Backend – alfalite-backend

API REST construida con **NestJS (v11)**, **TypeScript** y **TypeORM** sobre PostgreSQL.

## 📁 Estructura relevante

```
backend/alfalite-backend/
  src/
    auth/                   ← módulo de autenticación
      controllers/
      dto/
      entities/
      guards/
      strategies/
    api/                    ← módulo principal de productos
      dto/
      entities/
    app.module.ts
    main.ts
  docker-compose.yml       ← levanta la base de datos y ejecuta init-db.sql
  init-db.sql              ← script de creación de tablas y roles
  package.json
  tsconfig.json
```

## 🔧 Configuración

El proyecto utiliza `@nestjs/config` para cargar variables de entorno desde un `.env`.
Se habilita también una tubería global de validación (`ValidationPipe`) que limpia los campos extra y transforma tipos – esto se configura en `main.ts`.

```ts
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
    synchronize: false, // usamos init-db.sql
  }),
});
```

Las variables de entorno típicas se definen en el `.env` de la raíz del backend.

## 🚀 Autenticación

- Se utiliza Passport con la estrategia `passport-jwt`.
- El servicio `AuthService` maneja registro y login; genera tokens JWT firmados con `JWT_SECRET_KEY`.
- El guard `JwtAuthGuard` protege las rutas del módulo `api`.

## 📦 Endpoints principales

| Método | Ruta                | Descripción                | Acceso        |
| ------ | ------------------- | -------------------------- | ------------- |
| POST   | `/auth/login`       | Login, devuelve JWT        | Público       |
| POST   | `/auth/register`    | Crear nuevo usuario        | Público       |
| GET    | `/api/products`     | Listar todos los productos | Requerido JWT |
| POST   | `/api/products`     | Crear producto             | Requerido JWT |
| PATCH  | `/api/products/:id` | Actualizar producto        | Requerido JWT |
| DELETE | `/api/products/:id` | Eliminar producto          | Requerido JWT |

Swagger se habilita en `/docs` y permite probar los endpoints. Los parámetros de ruta `:id` usan `ParseIntPipe` para convertir y validar automáticamente el número.

## 🧾 Entidades y DTOs

- `User` (auth/entities/user.entity.ts)
- `Product` (api/entities/product.entity.ts)

Los DTOs (`CreateApiDto`, `UpdateApiDto`, `LoginDto`) incluyen validadores con `class-validator` y enriquecidos con `@ApiProperty` para Swagger.

## 📦 Ejecutar en desarrollo

```bash
cd backend/alfalite-backend
npm install
npm run start:dev
```

La aplicación arranca en el puerto `1337` por defecto. Swagger y la API son accesibles en ese puerto.

## 🧪 Pruebas

- Unitarias: `npm run test`.
- E2E: `npm run test:e2e` (usa SuperTest y arranca el servidor junto con una DB en memoria).

## 🛠 Mejoras sugeridas

- Añadir logging con `Logger` de Nest y/o `winston`.
- Implementar un filtro global de excepciones para formatear errores JSON.
- Manejar subidas de archivos (ya se sirve `uploads` pero falta el endpoint).
- Añadir paginación y búsqueda en el listado de productos.

---

Este documento puede complementarse con la guía de despliegue y la instalación ya incluidas en el README general.
