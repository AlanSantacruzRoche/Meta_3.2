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
   npm run dev
   ```

   o `npm start`.

Al arrancar, Sequelize crea las tablas si no existen. Para un proyecto de producción, reemplaza `sequelize.sync()` por migraciones versionadas.

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
