# Sistema de Gestión de Tickets — Sistemas Integrados S.A.

Plataforma helpdesk y customer-success para un ecosistema ERP/POS. Centraliza atención de soporte, base de conocimiento, membresías/pagos, capacitaciones y analytics sobre MongoDB.

## Stack

| Capa | Tecnología |
|---|---|
| Backend | Spring Boot 3.x · Java 21 · Spring Security · Spring Data MongoDB · JWT · JavaMailSender |
| Frontend | React 18 · Vite · TailwindCSS · Axios · React Router · Zustand |
| Base de datos | MongoDB (replica set — requerido para transacciones multi-doc) |

## Estructura monorepo

```
management_tickets/
├── backend/        # Spring Boot API REST
├── frontend/       # React SPA
├── docs/           # Requerimientos, HU, esquema colecciones
└── docker-compose.yml  # Mongo replica set local (opcional)
```

## Git Flow

| Rama | Propósito |
|---|---|
| `main` | Producción. Solo recibe merges desde `release/*` o `hotfix/*`. |
| `develop` | Integración. Base de todas las `feature/*`. |
| `feature/<INIC>-fase-<n>-<nombre>` | Trabajo en curso. Prefijo iniciales autor. |
| `release/x.y.z` | Preparación de release. |
| `hotfix/<nombre>` | Fix urgente en producción. |

Prefijos autor:
- **JDAS** — Juan David Acosta Sánchez (auth, usuarios/roles, tickets, base conocimiento)
- A definir — compañero (clientes, membresías/pagos, capacitaciones)

## Fases de desarrollo

| Fase | Owner | Alcance |
|---|---|---|
| 0 | Compartido | Setup monorepo + Git Flow |
| 1 | JDAS | Backend scaffold Spring Boot |
| 2 | JDAS | Auth + JWT + Security |
| 3 | JDAS | Usuarios + Roles |
| 4 | JDAS | Tickets core polimórfico |
| 5 | JDAS | Base de conocimiento |
| 6 | Compartido | Dashboard + Reportes (agregaciones) |
| 7 | JDAS | Frontend scaffold |
| 8 | JDAS | Frontend auth/usuarios/tickets |
| — | Compa | Clientes, Membresías, Pagos, Capacitaciones (back + front) |

## Puesta en marcha

### Pre-requisitos
- Java 21+ (`java -version`)
- Node 20+ (`node -v`)
- Maven 3.9+ (o usar wrapper `./mvnw`)
- MongoDB 6+ configurado como replica set

### Variables de entorno

Crear `backend/.env` basado en `backend/.env.example`:

```
MONGO_URI=mongodb://localhost:27017/management_tickets?replicaSet=rs0
JWT_SECRET=<cadena-aleatoria-64-chars>
JWT_ACCESS_EXPIRATION_MIN=15
JWT_REFRESH_EXPIRATION_DAYS=7
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=<correo>
MAIL_PASSWORD=<app-password>
```

### Levantar backend
```
cd backend
./mvnw spring-boot:run
```

### Levantar frontend
```
cd frontend
npm install
npm run dev
```

## Documentación

- `docs/contexto.md` — Problema y objetivos del proyecto
- `docs/requerimientos.md` — RF + RNF
- `docs/historias-usuario.md` — Historias de usuario por épica
- `docs/colecciones-mongo.md` — Esquemas y validadores MongoDB

## Agregaciones MongoDB utilizadas

El sistema demuestra el uso del Aggregation Framework:

- `$match` — Filtros previos a agregación (filtros por módulo, estado, fecha).
- `$group` — Agrupaciones (tickets por módulo/estado/prioridad).
- `$project` — Reshape de documentos de salida.
- `$sort` — Ordenamiento de resultados.
- `$lookup` — Joins entre colecciones (tickets ↔ clientes ↔ empleados).

## Equipo

Juan David Acosta Sánchez — 0192263
Merly Yineth Tarazona Sepúlveda — 0192251
Mauri Santiago Figueroa Machado — 0192252
Karol Juliana Arévalo Pérez — 0192292
María Angélica Álvarez Navarro — 0192296
