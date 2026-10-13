# REST API: Perfiles de Jugadores y Rosters

API REST construida con Node.js, Express, Sequelize y MySQL.

## Requisitos
- Node.js 20 o superior recomendado
- MySQL 8
- Postman o Thunder Client (opcional)

## Instalación en Windows (PowerShell)

1. Extrae la carpeta del proyecto.
2. Abre una terminal dentro de `esports-api`.
3. Instala dependencias:

   ```powershell
   npm install
   ```

4. Crea la base de datos en MySQL:

   ```sql
   CREATE DATABASE esports_api CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

5. Copia `.env.example` como `.env` y actualiza `DB_USER`, `DB_PASSWORD` y `ADMIN_TOKEN`.

   En PowerShell:

   ```powershell
   Copy-Item .env.example .env
   notepad .env
   ```

6. Inicia la API:

   ```powershell
   npm run migrate
   npm run dev
   ```

   o `npm start`.

Las tablas se crean mediante migraciones versionadas. Ejecuta `npm run migrate` antes de iniciar la API.

## URLs
- API: `http://localhost:3000/api/v1`
- OpenAPI/Swagger UI: `http://localhost:3000/api-docs`
- Salud: `http://localhost:3000/api/v1/health`

## Autorización
Los GET son públicos. POST, PUT y DELETE requieren un token de administrador en la cabecera:

```http
Authorization: Bearer cambia_esta_clave_por_una_segura
Content-Type: application/json
```

Usa el valor real de `ADMIN_TOKEN` de tu `.env`. Esta implementación usa un token fijo para que la práctica sea demostrable; no es un sistema de usuarios/contraseñas ni sustituye JWT en producción.

## Ejemplos de prueba

### Crear jugador (201)
`POST http://localhost:3000/api/v1/jugadores`

Headers:
```http
Authorization: Bearer TU_ADMIN_TOKEN
Content-Type: application/json
```

Body (raw JSON):
```json
{
  "nickname": "Faker",
  "nombre_real": "Lee Sang-hyeok",
  "pais": "Corea del Sur",
  "rol": "Mid",
  "estado": "activo"
}
```

### Listar y filtrar
`GET http://localhost:3000/api/v1/jugadores?rol=Mid&estado=activo&search=Fak`

### Crear roster
`POST http://localhost:3000/api/v1/rosters`

```json
{
  "nombre": "TL Principal",
  "juego": "League of Legends",
  "tipo": "Principal",
  "temporada": "2026"
}
```

### Asignar jugador al roster
`POST http://localhost:3000/api/v1/rosters/1/jugadores`

```json
{
  "id_jugador": 1,
  "rol_en_roster": "Titular"
}
```

### Ver roster y sus integrantes
`GET http://localhost:3000/api/v1/rosters/1`

## Endpoints

### Jugadores
- `GET /api/v1/jugadores`
- `GET /api/v1/jugadores/:id`
- `POST /api/v1/jugadores`
- `PUT /api/v1/jugadores/:id`
- `DELETE /api/v1/jugadores/:id`

Filtros: `rol`, `estado`, `search`.

### Rosters
- `GET /api/v1/rosters`
- `GET /api/v1/rosters/:id`
- `POST /api/v1/rosters`
- `PUT /api/v1/rosters/:id`
- `DELETE /api/v1/rosters/:id`

Filtros: `tipo`, `temporada`.

### Asignaciones
- `GET /api/v1/rosters/:id/jugadores`
- `POST /api/v1/rosters/:id/jugadores`
- `PUT /api/v1/rosters/:id/jugadores/:id_jugador`
- `DELETE /api/v1/rosters/:id/jugadores/:id_jugador`

### Auxiliares
- `GET /api/v1/roles`
- `GET /api/v1/estados`
- `GET /api/v1/tipos-roster`
- `GET /api/v1/health`

## Reglas de negocio implementadas
- Nickname único.
- Máximo cinco titulares por roster.
- No se permiten dos titulares con el mismo rol de jugador en un roster.
- Un jugador puede pertenecer a varios rosters, pero no repetirse dentro del mismo roster.
- Eliminar un roster no elimina a los jugadores.
- Las escrituras requieren token de administrador.

## Git
```powershell
git init
git add .
git commit -m "Implementa API de jugadores y rosters"
```


## Estructura del proyecto
```text
src/
├── config/          # Conexión a MySQL
├── controllers/     # Entrada HTTP, validaciones de request y respuestas
├── middleware/     # Autorización, validación de IDs y errores globales
├── migrations/      # Cambios versionados del esquema MySQL
├── models/          # Modelos Sequelize y asociaciones
├── routes/          # Definición de endpoints REST
├── services/        # Lógica de acceso a datos y reglas de negocio
├── utils/           # Utilidades de validación y errores
└── app.js           # Configuración e inicio de Express
tests/api.http       # Pruebas manuales para REST Client en VS Code
openapi.yaml         # Documentación OpenAPI
```

## Migraciones
Después de configurar `.env`, ejecuta:
```powershell
npm run migrate
```
Para revertir la última migración:
```powershell
npm run migrate:undo
```
No se usa `sequelize.sync()` al iniciar la API. Si ya habías creado las tablas con la versión anterior, primero respalda los datos y revisa la base de datos antes de ejecutar las migraciones iniciales; no ejecutes migraciones iniciales sobre tablas existentes sin planificar la transición.

## Pruebas REST Client
Instala la extensión **REST Client** de VS Code y abre `tests/api.http`. Ajusta `@token`, `@jugadorId` y `@rosterId` a los valores de tu entorno. Pulsa **Send Request** sobre cada bloque. El archivo incluye pruebas de endpoints, IDs inválidos, nickname duplicado y recursos inexistentes.
