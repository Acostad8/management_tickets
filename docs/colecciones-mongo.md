# **Resumen de Colecciones** 

|**#**|**Colección**|**Propósito**|
|---|---|---|
|**1**|**clientes**|Empresas clientes del sistema|
|**2**|**usuarios**|Usuarios internos y externos con roles|
|**3**|**sesiones**|Sesiones activas con expiración automática (TTL)|
|**4**|**roles**|Catálogo de roles y permisos|
|**5**|**empleados**|Perfil técnico del personal de soporte|
|**6**|**tickets**|Incidentes y sugerencias (polimórfico)|
|**7**|**base_conocimiento**|Artículos de soporte con búsqueda full-text|



# **1. Coleccion Clientes** 

- **Estructura de Campos** 

|**Campo**|**Tipo**|**Descripción**|
|---|---|---|
|_id|ObjectId|Clave primaria generada por<br>MongoDB|
|nit|string|NIT único de la empresa|
|razonSocial|string|Nombre o razón social|
|nombreContacto|string|Persona de contacto principal|
|emailContacto|string|Correo electrónico de contacto|
|telefono|string|Número de teléfono|
|direccion|string|Dirección física|
|ciudad|string|Ciudad|
|pais|string|País|
|estado|string|activo / inactivo|
|fechaCreacion|date (ISODate) (new Date())|Fecha de registro|
|fechaActualizacion|date (ISODate) (new Date())|Última modificación|



- **JSON Schema (Validador de Colección)** 

db.createCollection("clientes", { validator: { $jsonSchema: { bsonType: "object", required: ["nit", "razonSocial", "emailContacto", "estado"], properties: { nit:              { bsonType: "string", description: "NIT único obligatorio" }, razonSocial:      { bsonType: "string" }, nombreContacto:   { bsonType: "string" }, emailContacto:    { bsonType: "string", pattern: "^.+@.+\\.+$" }, telefono:         { bsonType: "string" }, direccion:        { bsonType: "string" }, ciudad:           { bsonType: "string" }, pais:             { bsonType: "string" }, estado:           { enum: ["activo", "inactivo"] }, fechaCreacion:    { bsonType: "date" }, fechaActualizacion: { bsonType: "date" } } } } }) // Índice único para NIT db.clientes.createIndex({ nit: 1 }, { unique: true }) // Índice compuesto para búsquedas por ciudad + estado db.clientes.createIndex({ ciudad: 1, estado: 1 }) 

# - **Inserción de Ejemplo** 

{ 

"nit":            "900123456-7", "razonSocial":    "Distribuidora El Sol S.A.S.", "nombreContacto": "Laura Gómez", "emailContacto":  "contacto@elsol.com", "telefono":       "+57 300 1234567", "direccion":      "Calle 45 # 12-30", "ciudad":         "Bogotá", "pais":           "Colombia", "estado":         "activo", "fechaCreacion":  "2025-01-15T10:00:00Z", "fechaActualizacion": "2025-01-15T10:00:00Z" } 

# **2. Colección: usuarios** 

- **Estrutura de Campos** 

|**Campo**|**Tipo**|**Descripción**|
|---|---|---|
|_id|ObjectId|Clave primaria|
|email|string|Email único, usado como login|
|passwordHash|string|Hash bcrypt de la contraseña|
|nombre|string|Nombre del usuario|
|apellido|string|Apellido del usuario|
|telefono|string|Teléfono de contacto|
|clienteId|ObjectId|null (cliente1)|Ref. a clientes (null si es interno)|
|roles|array [“SOPORTE”]|Lista de códigos de roles asignados|
|estado|string|activo / inactivo / bloqueado|
|ultimoAcceso|date|null|Última vez que inició sesión|
|intentosFallidos|int (new Date())|Contador para bloqueo por intentos|
|fechaCreacion|date (ISODate) (new Date())|Fecha de registro|
|fechaActualizacion|date (ISODate) (new Date())|Última modificación|



- **JSON Schema (Validador de Colección)** 

db.createCollection("usuarios", { 

validator: { $jsonSchema: { bsonType: "object", required: ["email", "passwordHash", "nombre", "roles", "estado"], properties: { 

<mark>email:           { bsonType: "string", pattern: "^.+@.+\\.+$" },</mark> email: { bsonType: "string", pattern: "^.+@.+\\..+$" }, passwordHash:    { bsonType: "string" }, nombre:          { bsonType: "string" }, apellido:        { bsonType: "string" }, telefono:        { bsonType: "string" }, clienteId:       { bsonType: ["objectId", "null"] }, 

roles: { bsonType: "array", minItems: 1, items: { bsonType: "string" } }, estado:          { enum: ["activo", "inactivo", "bloqueado"] }, ultimoAcceso:    { bsonType: ["date", "null"] }, intentosFallidos:{ bsonType: "int", minimum: 0 }, fechaCreacion:   { bsonType: "date" }, fechaActualizacion: { bsonType: "date" } } } } }) db.usuarios.createIndex({ email: 1 }, { unique: true }) db.usuarios.createIndex({ clienteId: 1, estado: 1 }) db.usuarios.createIndex({ roles: 1 }) 

# **Inserción de Ejemplo** 

{ "email": "soporte@gmail.com", "passwordHash": "$2b$10$abc...", "nombre": "Carlos", "apellido": "Pérez", "telefono": "+57 300 5555555", "clienteId": null, "roles": ["SOPORTE"], "estado": "activo", "ultimoAcceso": { "$date": "2025-01-15T10:00:00Z" }, "intentosFallidos": 0, "fechaCreacion": { "$date": "2025-01-15T10:00:00Z" }, "fechaActualizacion": { "$date": "2025-01-15T10:00:00Z" } 

} 

# **3. Colección: sesiones** 

# **Estrutura de Campos** 

|**Campo**|**Tipo**|**Descripción**|
|---|---|---|
|_id|ObjectId|Clave primaria|
|usuarioId|ObjectId|Referencia al usuario|
|token|string|JWT de acceso (único)|
|refreshToken|string|Token de renovación|
|ip|string|IP del cliente|
|userAgent|string|Navegador / agente del cliente|
|activa|bool|true = sesión en uso|
|fechaInicio|date (new Date())|Momento de creación de la sesión|
|fechaExpiracion|date (new Date())|Expiración — TTL sobre este campo|
|fechaCierre|date|null|Cierre explícito de sesión|



- **JSON Schema (Validador de Colección)** 

db.createCollection("sesiones", { 

validator: { $jsonSchema: { bsonType: "object", required: ["usuarioId", "token", "activa", "fechaInicio", "fechaExpiracion"], properties: { 

usuarioId:        { bsonType: "objectId" }, token:            { bsonType: "string" }, refreshToken:     { bsonType: "string" }, ip:               { bsonType: "string" }, userAgent:        { bsonType: "string" }, activa:           { bsonType: "bool" }, fechaInicio:      { bsonType: "date" }, 

fechaExpiracion:  { bsonType: "date" }, fechaCierre:      { bsonType: ["date", "null"] } } } } }) 

db.sesiones.createIndex({ usuarioId: 1, activa: 1 }) db.sesiones.createIndex({ token: 1 }, { unique: true }) // TTL: MongoDB elimina el documento cuando fechaExpiracion <= now db.sesiones.createIndex({ fechaExpiracion: 1 }, { expireAfterSeconds: 0 }) 

- **Inserción de Ejemplo** 

# **4. Colección: roles** 

# **Estrutura de Campos** 

|**Campo**|**Tipo**|**Descripción**|
|---|---|---|
|_id|ObjectId|Clave primaria|
|código|string|Código único: ADMIN, SOPORTE, CLIENTE, etc.|
|nombre|string|Nombre descriptivo del rol|
|descripción|string|Descripción del alcance del rol|
|permisos|array|Lista de permisos en formato recurso.acción|
|activo|bool|Indica si el rol está habilitado|
|fechaCreacion|date|Fecha de creación|
|fechaActualizacion|date|Última modificación|



# **JSON Schema (Validador de Colección)** 

db.createCollection("roles", { validator: { $jsonSchema: { bsonType: "object", required: ["codigo", "nombre", "permisos", "activo"], properties: { codigo:      { bsonType: "string" }, nombre:      { bsonType: "string" }, descripcion: { bsonType: "string" }, permisos:    { bsonType: "array", items: { bsonType: "string" } }, activo:      { bsonType: "bool" }, fechaCreacion:    { bsonType: "date" }, fechaActualizacion: { bsonType: "date" } } } } }) 

db.roles.createIndex({ codigo: 1 }, { unique: true }) 

# **Inserción de Ejemplo** 

{ 

"codigo":      "SOPORTE", "nombre":      "Personal de Soporte", "descripcion": "Usuario encargado de atender tickets", "permisos": [ "tickets.leer", "tickets.actualizar_estado", "tickets.responder", "base_conocimiento.crear" ], "activo":          true, "fechaCreacion":   "2025-01-01T00:00:00Z", "fechaActualizacion": "2025-01-01T00:00:00Z" } 

# **5. Colección: empleados** 

# **Estrutura de Campos** 

|**Campo**|**Tipo**|**Descripción**|
|---|---|---|
|_id|ObjectId|Clave primaria|
|codigoEmpleado|string|Código único, ej: EMP-001|
|usuarioId|ObjectId|Referencia 1:1 al documento en usuarios|
|nombre|string|Nombre|
|apellido|string|Apellido|
|email|string|Correo corporativo|
|teléfono|string|Teléfono|
|área|string|soporte / desarrollo / operaciones|
|cargo|string|Cargo o título del puesto|
|especialidad|array|Módulos ERP que domina|
|nivel|string|junior / senior / lead|
|estado|string|activo / inactivo|
|fechaIngreso|date|Fecha de vinculación|
|fechaCreacion|date|Fecha de registro en el sistema|



# **JSON Schema (Validador de Colección)** 

db.createCollection("empleados", { validator: { $jsonSchema: { bsonType: "object", required: ["codigoEmpleado", "usuarioId", "nombre", "area", "estado"], properties: { codigoEmpleado: { bsonType: "string" }, usuarioId:      { bsonType: "objectId" }, nombre:         { bsonType: "string" }, apellido:       { bsonType: "string" }, email:          { bsonType: "string" }, telefono:       { bsonType: "string" }, area:  { enum: ["soporte", "desarrollo", "operaciones"] }, cargo:          { bsonType: "string" }, especialidad: { bsonType: "array", items: { enum: ["ventas_online", "inventarios", "compras", "produccion", "ventas_sitio"] } }, nivel:  { enum: ["junior", "senior", "lead"] }, estado: { enum: ["activo", "inactivo"] }, 

fechaIngreso:  { bsonType: "date" }, fechaCreacion: { bsonType: "date" } } } } }) 

db.empleados.createIndex({ codigoEmpleado: 1 }, { unique: true }) db.empleados.createIndex({ usuarioId: 1 }) db.empleados.createIndex({ especialidad: 1, estado: 1 }) 

**Inserción de Ejemplo** 

{ "codigoEmpleado": "EMP-001", "usuarioId": { "$oid": "..." }, "nombre": "Andrés", "apellido": "Ramírez", "email": "andres.ramirez@empresa.com", "telefono": "+57 300 1111111", "area": "soporte", "cargo": "Ingeniero de Soporte", "especialidad": [ "produccion", "inventarios" ], "nivel": "senior", "estado": "activo", "fechaIngreso": { "$date": "2023-06-01T00:00:00.000Z" }, "fechaCreacion": { "$date": "2023-06-01T00:00:00.000Z" } } 

# **6. Colección: ticket** 

**Estrutura de Campos** 

|**Campo**|**Tipo**|**Descripción**|
|---|---|---|
|_id|ObjectId|Clave primaria|
|código|string|Código único: TK-0001, TK-0002...|
|título|string|Resumen breve del problema|
|descripción|string|Descripción detallada|
|tipo|string|incidente / sugerencia|
|clienteId|ObjectId|Referencia al cliente|
|usuarioId|ObjectId|Usuario que abre el ticket|
|empleadoAsignadoId|ObjectId|null|Empleado asignado (null al inicio)|
|módulo|string|Módulo ERP afectado|
|prioridad|string|baja / media / alta / crítica|
|estado|string|nuevo / en_proceso / en_espera / resuelto /<br>cerrado|
|detallesEspecificos|object|Campos polimórficos según el módulo|
|respuestas|array|Hilo de respuestas embebido|
|solución|object|null|Descripción de la solución aplicada|
|historialEstados|array|Auditoría de cambios de estado|
|fechaCreacion|date|Creación del ticket|
|fechaActualizacion|date|Última modificación|
|fechaCierre|date|null|Cierre del ticket|



# **JSON Schema (Validador de Colección)** 

db.createCollection("tickets", { validator: { $jsonSchema: { bsonType: "object", required: ["codigo","titulo","descripcion","clienteId","usuarioId","modulo","estado"], properties: { codigo:      { bsonType: "string" }, titulo:      { bsonType: "string" }, descripcion: { bsonType: "string" }, tipo:        { enum: ["incidente", "sugerencia"] }, clienteId:   { bsonType: "objectId" }, usuarioId:   { bsonType: "objectId" }, empleadoAsignadoId: { bsonType: ["objectId", "null"] }, modulo: { enum: ["ventas_online","inventarios", "compras","produccion","ventas_sitio"] }, 

prioridad: { enum: ["baja","media","alta","critica"] }, estado: { enum: ["nuevo","en_proceso","en_espera", "resuelto","cerrado"] }, detallesEspecificos: { bsonType: "object" }, respuestas: { bsonType: "array", items: { bsonType: "object", required: ["usuarioId", "mensaje", "fecha"], properties: { usuarioId: { bsonType: "objectId" }, mensaje:   { bsonType: "string" }, fecha:     { bsonType: "date" }, esInterno: { bsonType: "bool" } } } }, solucion: { bsonType: ["object", "null"], properties: { descripcion:    { bsonType: "string" }, documentadoPor: { bsonType: "objectId" }, fecha:          { bsonType: "date" } } }, historialEstados: { bsonType: "array", items: { bsonType: "object", properties: { estadoAnterior: { bsonType: ["string", "null"] }, estadoNuevo:    { bsonType: "string" }, usuarioId:      { bsonType: "objectId" }, fecha:          { bsonType: "date" } } } }, fechaCreacion:    { bsonType: "date" }, fechaActualizacion: { bsonType: "date" }, fechaCierre:      { bsonType: ["date", "null"] } } } } }) 

db.tickets.createIndex({ codigo: 1 }, { unique: true }) db.tickets.createIndex({ clienteId: 1, estado: 1 }) 

// Índice compuesto clave: módulo + estado + fecha db.tickets.createIndex({ modulo: 1, estado: 1, fechaCreacion: -1 }) db.tickets.createIndex({ empleadoAsignadoId: 1, estado: 1 }) 

**Inserción de Ejemplo** 

{ 

"codigo": "TK-0001", "titulo": "Error en pasarela de pago", "descripcion": "El cliente no puede completar el pago con tarjeta", "tipo": "incidente", "clienteId": { "$oid": "6ab1e5ea504bdc7cdcfd667b" }, "usuarioId": { "$oid": "6ab1e890352fe6fa12baca81" }, "empleadoAsignadoId": null, "modulo": "ventas_online", "prioridad": "alta", "estado": "nuevo", "detallesEspecificos": { "idPasarela": "PAY-001", "urlError": "https://tienda.com/checkout/error", "navegador": "Chrome 120", "logApi": "ERROR 500..." }, "respuestas": [], "solucion": null, "historialEstados": [ { "estadoAnterior": null, "estadoNuevo": "nuevo", "usuarioId": { "$oid": "6ab1e890352fe6fa12baca81" }, "fecha": { "$date": "2025-01-15T10:00:00.000Z" } } ], "fechaCreacion": { "$date": "2025-01-15T10:00:00.000Z" }, "fechaActualizacion": { "$date": "2025-01-15T10:00:00.000Z" }, 

"fechaCierre": null 

} 

# **7. Colección: base_conocimiento** 

# **Estrutura de Campos** 

|**Campo**|**Tipo**|**Descripción**|
|---|---|---|
|_id|ObjectId|Clave primaria|
|titulo|string|Título del artículo|
|contenido|string|Cuerpo del artículo (texto largo)|
|modulo|string|Módulo ERP relacionado o "general"|
|etiquetas|array|Tags para filtrado y búsqueda|
|ticketOrigenId|ObjectId|null|Ticket del que surgió el artículo|
|autorId|ObjectId|Empleado que redactó el artículo|
|vistas|int|Contador de lecturas|
|utilidad|int|Votos de "fue útil"|
|estado|string|borrador / publicado / archivado|
|fechaCreacion|date|Fecha de creación|
|fechaActualizacion|date|Última edición|



# **JSON Schema (Validador de Colección)** 

db.createCollection("base_conocimiento", { validator: { $jsonSchema: { bsonType: "object", required: ["titulo", "contenido", "autorId", "estado"], properties: { titulo:     { bsonType: "string" }, contenido:  { bsonType: "string" }, modulo: { enum: ["ventas_online","inventarios","compras", "produccion","ventas_sitio","general"] }, etiquetas:  { bsonType: "array", items: { bsonType: "string" } }, ticketOrigenId: { bsonType: ["objectId", "null"] }, autorId:    { bsonType: "objectId" }, vistas:     { bsonType: "int", minimum: 0 }, utilidad:   { bsonType: "int", minimum: 0 }, estado: { enum: ["borrador", "publicado", "archivado"] }, fechaCreacion:    { bsonType: "date" }, fechaActualizacion: { bsonType: "date" } } } } }) 

// Índice de texto para búsqueda en lenguaje natural db.base_conocimiento.createIndex( { titulo: "text", contenido: "text", etiquetas: "text" }, { weights: { titulo: 10, etiquetas: 5, contenido: 1 }, name: "idx_busqueda_texto" } ) 

db.base_conocimiento.createIndex({ modulo: 1, estado: 1 }) 

**Inserción de Ejemplo** 

{ 

"titulo":   "Cómo solucionar error 500 en pasarela de pago", "contenido": "Pasos para diagnosticar y resolver el error 500...", "modulo":   "ventas_online", "etiquetas": ["pasarela", "pago", "error 500"], "ticketOrigenId": ObjectId("..."), "autorId":  ObjectId("..."), "vistas":   45, "utilidad": 12, "estado":   "publicado", "fechaCreacion":    "2025-01-20T10:00:00Z", "fechaActualizacion": "2025-01-20T10:00:00Z" } 

