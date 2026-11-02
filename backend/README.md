# tickets-api (Backend)

Spring Boot 3.3 · Java 21 · Spring Data MongoDB · Spring Security · JWT

## Estructura paquetes

```
co.edu.ufpso.sistemasintegrados.tickets
├── TicketsApiApplication        # bootstrap
├── config                        # AppProperties, Mongo, Web/CORS, Security
├── common                        # PageResponse, utilidades compartidas
├── exception                     # ApiException, GlobalExceptionHandler
├── security                      # (Fase 2) JWT filter, UserDetails
├── domain                        # (Fase 2+) Entidades Mongo (@Document)
├── dto                           # (Fase 2+) Request/Response records
├── repository                    # (Fase 2+) MongoRepository
├── service                       # (Fase 2+) Lógica de negocio
└── controller                    # (Fase 2+) REST controllers
```

## Run

Requisitos: Java 21, Maven, MongoDB replica set en `localhost:27017`.

```bash
cp .env.example .env     # editar valores
./mvnw spring-boot:run
```

Variables de entorno críticas: ver `.env.example`.

## Endpoints base

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/ping` | Health check simple |
| GET | `/actuator/health` | Actuator health |
| GET | `/swagger` | Swagger UI |

## Tests

```bash
./mvnw test
```

Usa `flapdoodle` embedded Mongo (perfil `test`).
