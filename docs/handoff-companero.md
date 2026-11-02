# Handoff — Módulos pendientes del compañero

> **ACTUALIZACIÓN 2026-11-02:** JDAS absorbió todo el scope del compañero.
> Épicas 3 (Clientes), 4 (Empleados), 5 (Membresías), 6 (Pagos) y 7
> (Capacitaciones + Asistencias) están cerradas back + front. Este documento
> queda como referencia histórica de patrones y convenciones.
>
> JDAS = Juan David Acosta Sánchez. Branch de arranque: **`develop`**.

---

## 1. División del trabajo

Al 2026-11-02 todo lo listado está entregado por JDAS. Mapa fases → épicas:

| Épica | Fase back | Fase front | HU |
|---|---|---|---|
| 1 Auth | 2 | 7–8 | HU1–HU6 |
| 2 Usuarios + Roles | 3 | 8, 14 | HU7–HU13 |
| 3 Clientes | 16 | 18 | HU14–HU17 |
| 4 Empleados | 17 | 19 | — (schema derivado) |
| 5 Membresías | 20 | 21 | HU18–HU21 |
| 6 Pagos (transacción multi-doc) | 22 | 23 | HU22–HU25 |
| 7 Capacitaciones + Asistencias | 24 | 25 | HU40–HU44 |
| 8 Tickets core | 4 | 8, 13 | HU26–HU37 |
| 9 Base conocimiento | 5 | 8 | HU38–HU41 |
| 10 Reportes/Dashboard | 6 | 8 | HU45–HU47 |

HU completa en `docs/historias-usuario.md`. Esquema Mongo oficial en
`docs/colecciones-mongo.md` (nota: colecciones `membresias`, `pagos`,
`capacitaciones`, `asistencias` existen en código pero el schema formal con
validador `$jsonSchema` aún no está documentado — pendiente de redactar).

---

## 2. Lo que ya está hecho y sirve de plantilla

Todo mergeado a `develop`. Para cada entidad nueva, copiar el patrón de un módulo ya existente:

| Necesitás hacer | Copiar patrón de |
|---|---|
| CRUD simple (Cliente, Empleado, Capacitación) | `usuarios` o `base_conocimiento` |
| Entidad con FK ObjectId | `Ticket.java` (ver `@Field(targetType = OBJECT_ID)`) |
| Transacción multi-documento (Pagos HU25) | `TicketCounterService.java` + `MongoTransactionManager` ya configurado |
| Agregaciones Mongo | `DashboardService.java` + `ReporteService.java` |
| Página list con filtros | `frontend/src/pages/usuarios/UsuariosListPage.jsx` |
| Página con detalle + edición | `frontend/src/pages/tickets/TicketDetailPage.jsx` |

---

## 3. Convenciones backend (OBLIGATORIAS)

Para que el merge no explote:

### 3.1 Estructura de paquetes
```
backend/src/main/java/co/edu/ufpso/sistemasintegrados/tickets/
  domain/           → @Document, entidades Mongo
  domain/enums/     → enums de estados, categorías
  repository/       → interfaces MongoRepository
  dto/<modulo>/     → Create / Update / Response DTOs (records)
  service/          → lógica de negocio
  controller/       → @RestController + @RequestMapping("/api/v1/<modulo>")
```

### 3.2 Reglas no negociables
- **FK a otra colección:** siempre `String campoId` + `@Field(targetType = FieldType.OBJECT_ID)`. Mongo rechaza string.
- **Fechas:** `Instant` (no `LocalDateTime`).
- **Autorización:** `@PreAuthorize("@perms.has('<modulo>.<accion>')")`. Permisos nuevos: agregarlos al rol correspondiente en `DataSeeder.java`.
- **Validación entrada:** `@Valid` + anotaciones Jakarta (`@NotBlank`, `@Email`, `@Pattern`).
- **No autogenerar índices:** `application.yml` tiene `auto-index-creation: false`. Si tu colección no existe aún, agregarla a `IndexInitializer.java`.
- **DTOs:** Java records (`public record ClienteResponse(...)`).

### 3.3 Permisos a agregar (ejemplo)
En `DataSeeder.createRolesIniciales()` añadir al rol ADMIN:
```
"clientes.listar", "clientes.ver", "clientes.crear", "clientes.editar", "clientes.eliminar",
"empleados.listar", "empleados.ver", "empleados.crear", "empleados.editar", "empleados.eliminar",
"membresias.listar", "membresias.ver", "membresias.crear", "membresias.editar",
"pagos.listar", "pagos.ver", "pagos.registrar",
"capacitaciones.listar", "capacitaciones.ver", "capacitaciones.crear", "capacitaciones.editar"
```

Rol CLIENTE recibe solo lectura de lo suyo (ejemplo: `capacitaciones.listar`, `pagos.ver`).

### 3.4 Transacción multi-documento (HU25 Pagos)

Patrón ya probado en `TicketCounterService.incrementarContador`:

```java
@Transactional   // usa MongoTransactionManager ya registrado
public PagoResponse registrarPago(RegistrarPagoRequest req) {
    Pago pago = pagoRepository.save(new Pago(...));
    membresiaRepository.save(membresia.marcarPagada(pago.getId()));
    return PagoMapper.toResponse(pago);
}
```

Mongo Atlas replica set ya habilitado. No tocar config.

---

## 4. Convenciones frontend (OBLIGATORIAS)

### 4.1 Estructura
```
frontend/src/
  services/<modulo>.js      → wrapper axios
  pages/<modulo>/<Pagina>.jsx
  router/index.jsx          → agregar rutas acá
```

Agregar entrada al **sidebar** en `components/Sidebar.jsx` dentro de la sección correspondiente.

### 4.2 Estilo visual (NO negociable)

El sistema usa tema **zinc dark enterprise sobrio** (matching la landing). Para que no se vea pegado, copiar literalmente las clases de `UsuariosListPage.jsx`:

- Header: `text-[28px] font-semibold leading-tight tracking-tight text-zinc-50` + `border-b border-zinc-900 pb-6`
- Tabla: hairline `border border-zinc-900 bg-zinc-950`, headers `text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500`
- Badges: paleta estado con `/10` bg + `/20` border (ej. `bg-emerald-500/10 text-emerald-300 border border-emerald-500/20`)
- Códigos / IDs: `font-mono text-[11.5px]`
- Botones primarios: clase `btn-primary` (ya definida en `index.css`)
- Nada de slate, nada de colores suaves claros. **Prohibido** poner gradientes decorativos o kickers tipo "01 — DOMINIO".

### 4.3 Permisos en UI
```jsx
import { useAuthStore } from '../../stores/useAuthStore';
const hasPermission = useAuthStore((s) => s.hasPermission);

{hasPermission('clientes.crear') && <button>...</button>}
```

### 4.4 Axios
Usar `api` desde `lib/api.js`. Ya trae interceptor de refresh JWT, no reinventar.

---

## 5. Git Flow

### 5.1 Branch prefix propio
JDAS usó `feature/JDAS-fase-N-...`. Vos usá **tus iniciales** (ej. `feature/XXX-clientes-crud-backend`).

### 5.2 Flujo por feature
```bash
git checkout develop
git pull
git checkout -b feature/XXX-clientes-crud-backend
# ... codear ...
git add <archivos específicos>
git commit -m "feat(clientes): CRUD backend con NIT único"
git checkout develop
git merge --no-ff feature/XXX-clientes-crud-backend -m "Merge feature/XXX-clientes-crud-backend into develop"
```

**Nunca** mergear directo a `main`. Solo release branches van a main (lo coordinamos juntos).

### 5.3 Commits
Formato Conventional Commits. Scope entre paréntesis. Mensaje imperativo corto.
```
feat(clientes): CRUD con validación NIT único
feat(empleados): asignación a usuario existente
feat(pagos): registrar pago con transacción multi-doc (HU25)
fix(membresias): fecha vencimiento calcular desde fechaInicio
```

### 5.4 Antes de mergear
- `cd backend && mvn -q -DskipTests clean compile` → BUILD SUCCESS
- `cd frontend && npm run build` → sin errores
- Pull último `develop` y resolver conflictos ANTES del merge

---

## 6. Setup local

### 6.1 Prerequisitos ya instalados en PC JDAS
- Java 21
- Maven 3.9.9 (en `C:\Users\USUARIO\maven\`, agregado al PATH)
- Node 20
- MongoDB Atlas cluster "Parcial-I" (SRV connection)

### 6.2 En tu máquina
1. Clonar repo y `git checkout develop`.
2. Copiar `backend/.env.example` → `backend/.env`. Pedirle a JDAS el `MONGO_URI` y `JWT_SECRET` por canal seguro (NUNCA por chat de IA ni commit).
3. Backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   Levanta en `localhost:8080`. Primera corrida crea admin + roles seed.
4. Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Levanta en `localhost:5173`. CORS backend solo acepta ese puerto, no cambiar.

### 6.3 Credenciales iniciales
`admin@sistemasintegrados.co` / `Admin1234!` → **cambiar inmediatamente al primer login**.

---

## 7. Puntos de integración con lo ya hecho

### 7.1 Ticket.clienteId
`backend/.../domain/Ticket.java:43` tiene `String clienteId`. Cuando crees la colección `clientes`, los tickets ya existentes tienen IDs huérfanos. Dos opciones:
- Opción A (limpia): borrar tickets de prueba, recrear con clientes reales.
- Opción B: script de seed que crea clientes "legacy" con los IDs ya referenciados.

### 7.2 Usuario.clienteId
Según `docs/colecciones-mongo.md` línea 58, el usuario puede tener `clienteId` (null si es interno). Agregar ese campo a `Usuario.java` cuando montes la colección clientes.

### 7.3 Empleado ↔ Usuario
`Empleado.usuarioId` apunta a `usuarios._id`. Pattern: un usuario con rol SOPORTE puede tener un empleado asociado. Validar en create: usuario existe + no tiene empleado ya.

### 7.4 Agregación `TicketsPorCliente`
`ReporteService.ticketsPorCliente()` ya hace `$group` por `clienteId`. Hoy devuelve los IDs crudos. Cuando exista la colección, cambiar el pipeline para hacer `$lookup` a `clientes` y traer `razonSocial`. Archivo: `backend/.../service/ReporteService.java`.

---

## 8. Estado de los módulos (todo cerrado)

### 8.1 Clientes (HU14–HU17) — ✅ Fases 16 + 18
- `domain/Cliente.java`, `EstadoCliente` (activo/inactivo)
- Índices: unique `nit`, compuesto `ciudad+estado`
- UI: `pages/clientes/ClientesListPage.jsx` + `ClienteFormModal.jsx`

### 8.2 Empleados — ✅ Fases 17 + 19
- `domain/Empleado.java` con FK `usuarioId` + `EmpleadoCounter` para auto `EMP-NNNN`
- Create valida: usuario existe + tiene rol SOPORTE + sin empleado previo
- Índices: unique `codigoEmpleado`, unique `usuarioId`, compuesto `especialidad+estado`
- UI: `pages/empleados/EmpleadosListPage.jsx` + `EmpleadoFormModal.jsx` (multi-chips especialidad)

### 8.3 Membresías (HU18–HU21) — ✅ Fases 20 + 21
- `domain/Membresia.java` con `modulosContratados: List<ModuloErp>`, `plan`, `fechaInicio/Vencimiento`, `precio`, `pagoAlDia`, `EstadoMembresia` (activa/suspendida/vencida/cancelada)
- Endpoint auxiliar `/cliente/{id}` para traer membresías de un cliente
- UI con alerta visual días restantes y badge de vencimiento ≤15d

### 8.4 Pagos (HU22–HU25) — ✅ Fases 22 + 23
- `domain/Pago.java`, `MedioPago` (efectivo/transferencia/tarjeta/pse/cheque/otro), `EstadoPago` (registrado/anulado)
- **HU25 transacción multi-doc:** `PagoService.registrarPago()` y `anular()` con `@Transactional` vía `MongoTransactionManager`. Al registrar actualiza `Membresia.pagoAlDia=true` + reactiva estado si venía suspendida/vencida. Al anular revierte `pagoAlDia=false`
- Edición rechazada en pagos anulados, delete rechazado en pagos registrados
- UI: `AnularPagoModal` dedicado con motivo obligatorio

### 8.5 Capacitaciones + Asistencias (HU40–HU44) — ✅ Fases 24 + 25
- `domain/Capacitacion.java` con `ModalidadCapacitacion` (masiva/personalizada), `clientesInvitados` array OBJECT_ID, instructor empleado, cupoMaximo
- `domain/Asistencia.java` como colección separada
- **HU44 unicidad:** unique index compuesto `(capacitacionId, participanteDocumento)`
- `AsistenciaService.registrar()` valida: capacitación activa, cliente invitado si personalizada, cupo disponible
- Rol `CLIENTE` tiene permiso `asistencias.registrar`
- UI: `CapacitacionDetailModal` con tabla de asistencias + modal anidado `AsistenciaFormModal`

---

## 9. Qué NO tocar

- Carpeta `security/` (JWT, filters, permissions). Si necesitás un permiso nuevo, agregarlo al rol en seeder, no modificar la cadena de filtros.
- `AuthController`, `AuthService`.
- `landing/` páginas públicas. Si querés agregar algo en la landing, hablarlo antes.
- Colores de la paleta (`tailwind.config.js`). Zinc + brand ya acordados.

---

## 10. Dudas / contacto

Cualquier duda de patrón, abrir un archivo similar en el repo y copiar. Si hay conflicto de merge, llamar antes de forzar nada. **No usar `--force` ni `--no-verify` nunca.**
