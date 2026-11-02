# Handoff — Módulos pendientes del compañero

> Documento para el segundo integrante del Proyecto de Aula.
> JDAS = Juan David Acosta Sánchez (ya completó su scope).
> Branch de arranque: **`develop`** (siempre partir desde ahí).

---

## 1. División del trabajo

| Scope JDAS (hecho) | Scope compañero (pendiente) |
|---|---|
| Autenticación JWT (HU1–HU6) | **Épica 3 — Clientes** (HU14–HU17) |
| Usuarios + Roles + Permisos (HU7–HU13) | **Épica 4 — Empleados** (HU18–HU20) |
| Tickets polimórficos (HU28–HU37) | **Épica 5 — Membresías** (HU21–HU24) |
| Base de Conocimiento (HU38–HU41) | **Épica 6 — Pagos** (HU25–HU27, incluye transacción multi-doc) |
| Dashboard + Reportes (HU45–HU47) | **Épica 7 — Capacitaciones** (HU42–HU44) |
| Landing + UI framework | Páginas CRUD de los módulos arriba |

HU completa en `docs/historias-usuario.md`. Esquema Mongo oficial en `docs/colecciones-mongo.md`.

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

## 8. Checklist por módulo

### 8.1 Clientes (HU14–HU17)
- [ ] `domain/Cliente.java` con: `razonSocial`, `nit` (unique), `contactoNombre`, `contactoEmail`, `contactoTelefono`, `direccion`, `ciudad`, `estado`, timestamps
- [ ] Índice unique en `nit` → agregar a `IndexInitializer`
- [ ] `ClienteRepository`, `ClienteService`, `ClienteController`
- [ ] DTOs: `CreateClienteRequest`, `UpdateClienteRequest`, `ClienteResponse`
- [ ] Permisos en `DataSeeder`
- [ ] UI: `pages/clientes/ClientesListPage.jsx` + detalle + crear
- [ ] Ruta en `router/index.jsx` + entry en `Sidebar.jsx`

### 8.2 Empleados (HU18–HU20)
- [ ] `domain/Empleado.java` con FK `usuarioId` (`@Field(targetType=OBJECT_ID)`)
- [ ] Validar en create: `usuarioId` existe + aún sin empleado + rol SOPORTE
- [ ] Resto: igual que clientes

### 8.3 Membresías + Pagos (Épicas 5 y 6)
- [ ] `domain/Membresia.java` + `domain/Pago.java`
- [ ] HU25: `PagoService.registrarPago()` con `@Transactional` (ver 3.4)
- [ ] UI combinada: list membresías con botón "Registrar pago"

### 8.4 Capacitaciones (HU42–HU44)
- [ ] `domain/Capacitacion.java` + enum modalidad masiva/personalizada
- [ ] `domain/Asistencia.java` para HU44 (cliente marca asistencia)
- [ ] UI: list + detalle con botón "Confirmar asistencia" (visible solo a rol CLIENTE)

---

## 9. Qué NO tocar

- Carpeta `security/` (JWT, filters, permissions). Si necesitás un permiso nuevo, agregarlo al rol en seeder, no modificar la cadena de filtros.
- `AuthController`, `AuthService`.
- `landing/` páginas públicas. Si querés agregar algo en la landing, hablarlo antes.
- Colores de la paleta (`tailwind.config.js`). Zinc + brand ya acordados.

---

## 10. Dudas / contacto

Cualquier duda de patrón, abrir un archivo similar en el repo y copiar. Si hay conflicto de merge, llamar antes de forzar nada. **No usar `--force` ni `--no-verify` nunca.**
