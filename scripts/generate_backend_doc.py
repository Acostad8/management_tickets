"""
Genera docs/backend-funcionamiento.docx con la explicación técnica del
backend del sistema de tickets.
"""
from pathlib import Path
from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement


BRAND = RGBColor(0x1F, 0x6F, 0xEB)
DARK = RGBColor(0x18, 0x18, 0x1B)
MUTED = RGBColor(0x55, 0x55, 0x5A)
CODE_BG = "F4F4F5"


def add_heading(doc, text, level=1):
    h = doc.add_heading(text, level=level)
    for run in h.runs:
        run.font.color.rgb = BRAND if level == 1 else DARK
    return h


def add_paragraph(doc, text, bold=False, italic=False, size=11, color=DARK):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color
    return p


def add_bullet(doc, text):
    p = doc.add_paragraph(style="List Bullet")
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(11)
    return p


def shade_cell(cell, hex_color):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), hex_color)
    tc_pr.append(shd)


def add_code_block(doc, code, lang=""):
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.2)
    run = p.add_run(code)
    run.font.name = "Consolas"
    run.font.size = Pt(9.5)
    run.font.color.rgb = DARK
    pPr = p._p.get_or_add_pPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), CODE_BG)
    pPr.append(shd)
    return p


def add_table(doc, headers, rows):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = "Light Grid Accent 1"
    hdr = table.rows[0].cells
    for i, h in enumerate(headers):
        hdr[i].text = h
        for p in hdr[i].paragraphs:
            for r in p.runs:
                r.font.bold = True
                r.font.size = Pt(10)
        shade_cell(hdr[i], "1F6FEB")
        for p in hdr[i].paragraphs:
            for r in p.runs:
                r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
    for r_idx, row in enumerate(rows, start=1):
        for c_idx, val in enumerate(row):
            cell = table.rows[r_idx].cells[c_idx]
            cell.text = str(val)
            for p in cell.paragraphs:
                for run in p.runs:
                    run.font.size = Pt(9.5)
    return table


def main():
    doc = Document()

    # Portada
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = title.add_run("Sistema de Gestión de Tickets\nSistemas Integrados S.A.")
    run.font.name = "Calibri"
    run.font.size = Pt(24)
    run.font.bold = True
    run.font.color.rgb = BRAND

    sub = doc.add_paragraph()
    sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r2 = sub.add_run("Documento técnico del backend")
    r2.font.name = "Calibri"
    r2.font.size = Pt(14)
    r2.font.color.rgb = MUTED

    meta = doc.add_paragraph()
    meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r3 = meta.add_run("Versión 1.0.0  ·  2026-11-03")
    r3.font.size = Pt(11)
    r3.font.color.rgb = MUTED

    doc.add_paragraph()
    team = doc.add_paragraph()
    team.alignment = WD_ALIGN_PARAGRAPH.CENTER
    rt = team.add_run(
        "Juan David Acosta Sánchez · 0192263\n"
        "María Angélica Álvarez Navarro · 0192296\n"
        "Kevin Andrés Peñaranda Pardo · 0192212"
    )
    rt.font.size = Pt(11)
    rt.font.color.rgb = DARK

    doc.add_page_break()

    # 1. Introducción
    add_heading(doc, "1. Introducción", 1)
    add_paragraph(doc,
        "El sistema es una plataforma de helpdesk y customer-success para una empresa que vende un "
        "ERP/POS a terceros. Centraliza la atención de tickets de soporte, la base de conocimiento, "
        "la gestión comercial (clientes, membresías, pagos) y las capacitaciones impartidas, con "
        "analítica agregada sobre MongoDB. El backend se construyó con Spring Boot 3.3 sobre Java 21, "
        "se expone como API REST y utiliza MongoDB como única fuente de verdad."
    )

    add_heading(doc, "1.1 Stack tecnológico", 2)
    add_table(doc,
        ["Capa", "Tecnología"],
        [
            ["Lenguaje", "Java 21"],
            ["Framework", "Spring Boot 3.3 (Web, Security, Validation, Data MongoDB)"],
            ["Base de datos", "MongoDB (replica set — requerido para transacciones multi-doc)"],
            ["Seguridad", "Spring Security + JJWT 0.12 (access + refresh)"],
            ["Correo", "JavaMailSender (recuperación de contraseña, notificaciones)"],
            ["API Docs", "SpringDoc OpenAPI (Swagger UI)"],
            ["Build", "Maven 3.9"],
        ]
    )

    # 2. Arquitectura
    add_heading(doc, "2. Arquitectura por capas", 1)
    add_paragraph(doc,
        "El backend sigue el patrón clásico de 4 capas: Controller → Service → Repository → Domain, "
        "con capas transversales de seguridad, validación y manejo de excepciones. Cada módulo "
        "funcional (clientes, empleados, usuarios, roles, tickets, base de conocimiento, "
        "membresías, pagos, capacitaciones) sigue la misma estructura."
    )

    add_table(doc,
        ["Carpeta", "Responsabilidad"],
        [
            ["domain/", "Entidades @Document (POJO + Lombok)"],
            ["domain/enums/", "Enumeraciones de estados, modalidades, medios de pago"],
            ["domain/embedded/", "Documentos embebidos (respuesta ticket, solución, historial)"],
            ["repository/", "Interfaces MongoRepository<T, String>"],
            ["dto/<modulo>/", "Records Create/Update/Response/ChangeEstado por módulo"],
            ["service/", "Lógica de negocio, validaciones, orquestación de repos"],
            ["controller/", "Endpoints REST @RestController con @PreAuthorize"],
            ["security/", "JWT filter, UserDetails, PermissionChecker (@perms)"],
            ["config/", "MongoConfig, SecurityConfig, WebConfig, PropertiesConfig"],
            ["bootstrap/", "DataSeeder (roles + admin), IndexInitializer (índices)"],
            ["exception/", "Jerarquía ApiException + GlobalExceptionHandler"],
            ["common/validation/", "@ValidPassword y validator personalizado"],
        ]
    )

    add_heading(doc, "2.1 Flujo de una petición HTTP", 2)
    add_paragraph(doc,
        "1) El cliente envía JWT en el header Authorization. "
        "2) JwtAuthenticationFilter decodifica el token y popula el SecurityContext con un "
        "CustomUserDetails que incluye roles y permisos. "
        "3) El @PreAuthorize del controller consulta a PermissionChecker (bean @perms) para "
        "aceptar o rechazar la operación. "
        "4) El Service ejecuta la lógica de negocio, consulta repositorios y aplica validaciones. "
        "5) En operaciones multi-documento críticas (pagos ↔ membresías) se abre una transacción "
        "Mongo a través de @Transactional + MongoTransactionManager. "
        "6) El Controller devuelve ResponseEntity con el DTO Response. "
        "7) Cualquier excepción es traducida por GlobalExceptionHandler a un cuerpo JSON uniforme."
    )

    # 3. Conexión a MongoDB
    add_heading(doc, "3. Conexión a MongoDB", 1)
    add_paragraph(doc,
        "La conexión se configura mediante la propiedad spring.data.mongodb.uri cargada desde el "
        "archivo backend/.env (que no se versiona). El cluster usado durante el desarrollo es un "
        "replica set en Mongo Atlas llamado \"Parcial-I\". El replica set es obligatorio porque "
        "las transacciones multi-documento (HU25) requieren un oplog y un primary elegible."
    )

    add_heading(doc, "3.1 MongoConfig", 2)
    add_paragraph(doc,
        "La clase config/MongoConfig.java expone dos @Bean críticos:"
    )
    add_bullet(doc,
        "mongoClient() — Construye un MongoClient con la connection string tomada de spring.data.mongodb.uri."
    )
    add_bullet(doc,
        "mongoTransactionManager(MongoTemplate) — Registra el gestor transaccional "
        "sobre el MongoDatabaseFactory del MongoTemplate. Esto habilita @Transactional sobre la base."
    )
    add_code_block(doc,
"""@Bean
public MongoClient mongoClient() {
    ConnectionString cs = new ConnectionString(mongoUri);
    MongoClientSettings s = MongoClientSettings.builder()
            .applyConnectionString(cs).build();
    return MongoClients.create(s);
}

@Bean
public MongoTransactionManager mongoTransactionManager(MongoTemplate template) {
    return new MongoTransactionManager(template.getMongoDatabaseFactory());
}"""
    )

    add_heading(doc, "3.2 Mapeo de entidades a documentos", 2)
    add_paragraph(doc,
        "Cada entidad del dominio se marca con @Document(\"<nombre_coleccion>\") y usa anotaciones "
        "de Spring Data Mongo para mapear tipos y FKs:"
    )
    add_bullet(doc, "@Id — Campo _id de Mongo, mapeado como String (ObjectId se serializa transparente).")
    add_bullet(doc, "@Field(targetType = FieldType.OBJECT_ID) — Para FKs: guarda el campo como ObjectId real, no como string. Evita problemas con validadores schema.")
    add_bullet(doc, "@Indexed(unique = true) — Para unicidad simple (ej. nit en clientes, email en usuarios).")
    add_bullet(doc, "@CreatedDate / @LastModifiedDate — Timestamps auditados por Spring.")

    add_heading(doc, "3.3 Inicialización de índices", 2)
    add_paragraph(doc,
        "La clase bootstrap/IndexInitializer.java corre en el evento ApplicationReadyEvent y "
        "asegura (idempotente, con ensureIndex) los siguientes índices por colección:"
    )
    add_table(doc,
        ["Colección", "Índices"],
        [
            ["clientes", "nit unique · (ciudad, estado) compuesto"],
            ["empleados", "codigoEmpleado unique · usuarioId unique · (especialidad, estado) compuesto"],
            ["membresias", "(clienteId, estado) compuesto · (estado, fechaVencimiento) compuesto"],
            ["pagos", "(clienteId, fechaPago desc) · membresiaId · fechaPago desc · referencia unique sparse"],
            ["capacitaciones", "(estado, fechaProgramada) · modalidad · clientesInvitados multikey"],
            ["asistencias", "(capacitacionId, participanteDocumento) UNIQUE · clienteId · capacitacionId"],
            ["password_reset_tokens", "token unique · usuarioId · fechaExpiracion TTL"],
        ]
    )

    add_heading(doc, "3.4 Colecciones del sistema", 2)
    add_paragraph(doc,
        "En total hay 11 colecciones físicas documentadas en docs/colecciones-mongo.md con "
        "su validador $jsonSchema. Resumen:"
    )
    add_table(doc,
        ["#", "Colección", "Propósito"],
        [
            ["1", "clientes", "Empresas que contratan el ERP/POS"],
            ["2", "usuarios", "Cuentas con acceso (admin, soporte, cliente, ventas)"],
            ["3", "sesiones", "Sesiones JWT activas (TTL sobre fechaExpiracion)"],
            ["4", "roles", "Catálogo de roles y permisos"],
            ["5", "empleados", "Perfil técnico del personal de soporte (ligado a usuario)"],
            ["6", "tickets", "Casos de soporte polimórficos por módulo ERP"],
            ["7", "base_conocimiento", "Artículos con búsqueda full-text"],
            ["8", "membresias", "Planes contratados por cliente con módulos ERP"],
            ["9", "pagos", "Historial de pagos (atómico con membresía — HU25)"],
            ["10", "capacitaciones", "Sesiones de formación masivas o personalizadas"],
            ["11", "asistencias", "Participantes físicos a cada capacitación"],
        ]
    )

    # 4. Seguridad
    add_heading(doc, "4. Seguridad y autenticación", 1)
    add_paragraph(doc,
        "El sistema utiliza JWT como mecanismo de autenticación y un modelo de autorización "
        "basado en permisos granulares (ej. clientes.crear, pagos.leer) asignados a roles. "
        "El rol ADMIN tiene todos los permisos; roles como SOPORTE, VENTAS y CLIENTE "
        "tienen subconjuntos."
    )

    add_heading(doc, "4.1 Flujo JWT", 2)
    add_bullet(doc, "POST /api/v1/auth/login — valida credenciales, incrementa intentos fallidos, devuelve access + refresh tokens.")
    add_bullet(doc, "Access token (15 min por defecto) incluye email, roles y lista de permisos como claims.")
    add_bullet(doc, "Refresh token (7 días) permite renovar el access sin volver a tipear la contraseña.")
    add_bullet(doc, "5 intentos fallidos → estado=bloqueado permanente hasta que ADMIN use /unlock.")

    add_heading(doc, "4.2 Autorización fina", 2)
    add_paragraph(doc,
        "En cada endpoint del controller aparece @PreAuthorize(\"@perms.has('<modulo>.<accion>')\"). "
        "El bean perms (clase PermissionChecker) consulta el CustomUserDetails en el "
        "SecurityContext y valida que el permiso exacto esté presente en su lista."
    )
    add_code_block(doc,
"""@PostMapping
@PreAuthorize("@perms.has('clientes.crear')")
public ResponseEntity<ClienteResponse> create(
        @Valid @RequestBody CreateClienteRequest req) {
    return ResponseEntity.status(CREATED).body(service.create(req));
}"""
    )

    # 5. Validación
    add_heading(doc, "5. Validación de entrada", 1)
    add_bullet(doc, "Bean Validation Jakarta (@Valid + @NotBlank, @Email, @Size, @Pattern, @Positive) en todos los DTOs Request.")
    add_bullet(doc, "Anotación personalizada @ValidPassword (common/validation) exige 8+ chars, mayúscula, minúscula, dígito y símbolo.")
    add_bullet(doc, "GlobalExceptionHandler captura MethodArgumentNotValidException y responde con un mapa field→mensaje.")
    add_bullet(doc, "Validaciones de negocio en el Service levantan BusinessException, ConflictException o NotFoundException según el caso.")

    # 6. Módulos funcionales
    add_heading(doc, "6. Módulos funcionales", 1)
    add_paragraph(doc,
        "A continuación se resumen los módulos del backend y las reglas de negocio relevantes."
    )

    add_heading(doc, "6.1 Autenticación y usuarios", 2)
    add_bullet(doc, "AuthService: login/refresh/logout, cambio de contraseña, forgot/reset con token temporal.")
    add_bullet(doc, "UsuarioService: CRUD, assignRoles (reasignación de permisos), changeEstado, unlock.")
    add_bullet(doc, "Política no-delete (v1.0): se removió DELETE /usuarios/{id}; para dar de baja se usa estado=inactivo o bloqueado.")

    add_heading(doc, "6.2 Tickets de soporte", 2)
    add_bullet(doc, "TicketService: creación con auto-código TK-YYYY-NNNN por cliente (TicketCounterService).")
    add_bullet(doc, "Modelo polimórfico: campo detallesEspecificos tipo object varía según el módulo ERP del ticket.")
    add_bullet(doc, "Flujo de estados: nuevo → en_proceso → en_espera → resuelto → cerrado, con historial embebido.")
    add_bullet(doc, "Respuestas embebidas en el documento (array respuestas) con flag esInterno para notas de soporte.")

    add_heading(doc, "6.3 Base de conocimiento", 2)
    add_bullet(doc, "Índice de texto Mongo nativo sobre titulo, contenido, etiquetas (weights 10/1/5).")
    add_bullet(doc, "Contador de vistas incrementable + flag utilidad.")

    add_heading(doc, "6.4 Clientes y empleados", 2)
    add_bullet(doc, "Cliente: NIT único, estado activo/inactivo, filtros por ciudad.")
    add_bullet(doc, "Empleado: auto-código EMP-NNNN (EmpleadoCounterService), validación de que el usuario asociado tenga rol SOPORTE y aún no esté vinculado a otro empleado.")

    add_heading(doc, "6.5 Membresías", 2)
    add_bullet(doc, "Asociación 1 cliente → N membresías con plan, módulos contratados (array ModuloErp) y vigencia (fechaInicio, fechaVencimiento).")
    add_bullet(doc, "Estados: activa, suspendida, vencida, cancelada.")
    add_bullet(doc, "Campo pagoAlDia se actualiza automáticamente al registrar/anular pagos (ver 6.6).")
    add_bullet(doc, "Política no-delete: para dar de baja se usa estado=cancelada; el documento permanece para trazabilidad.")

    add_heading(doc, "6.6 Pagos y transacción multi-documento (HU25)", 2)
    add_paragraph(doc,
        "El método PagoService.registrarPago() está marcado con @Transactional. En una sola "
        "transacción Mongo se realizan dos operaciones:"
    )
    add_bullet(doc, "INSERT en colección pagos con estado=registrado.")
    add_bullet(doc, "UPDATE en membresía: pagoAlDia=true y, si estaba suspendida/vencida, reactiva a activa.")
    add_paragraph(doc,
        "Si cualquiera de las dos escrituras falla, el MongoTransactionManager hace rollback de "
        "ambas, cumpliendo con RF123, RF124 y RNF09. El mismo mecanismo se aplica en anular()."
    )

    add_heading(doc, "6.6.1 Reglas de validación de pagos", 3)
    add_bullet(doc, "El valor de un pago no puede exceder el precio de la membresía asociada.")
    add_bullet(doc, "La suma de pagos registrados previos + nuevo valor no puede exceder el precio total (permite pagos parciales acumulados).")
    add_bullet(doc, "Si el cliente tiene membresías vivas, el pago está obligado a asociarse a alguna (no acepta pagos sueltos cuando hay membresía).")
    add_bullet(doc, "La referencia debe ser única entre pagos registrados (índice unique sparse); exento efectivo.")
    add_bullet(doc, "Un pago registrado no se puede editar si está anulado, ni eliminar si está registrado — primero se anula.")

    add_heading(doc, "6.7 Capacitaciones y asistencias", 2)
    add_bullet(doc, "Capacitación: modalidad masiva o personalizada; cupoMaximo opcional; invitados como array ObjectId.")
    add_bullet(doc, "Asistencia: colección separada; unique compuesto (capacitacionId, participanteDocumento) para RF139 (no duplicados).")
    add_bullet(doc, "AsistenciaService.registrar valida: capacitación activa, cliente invitado (si personalizada), cupo disponible, documento único.")

    # 7. Agregaciones MongoDB
    add_heading(doc, "7. Agregaciones MongoDB en el sistema", 1)
    add_paragraph(doc,
        "El Aggregation Framework de MongoDB es el motor de todos los reportes y métricas del "
        "dashboard. El sistema implementa 5 pipelines distribuidos en 2 servicios: "
        "ReporteService y DashboardService. A continuación se explica cada operador y luego "
        "se mapea con los pipelines donde aparece."
    )

    add_heading(doc, "7.1 $match — filtrar documentos", 2)
    add_paragraph(doc,
        "Permite filtrar los documentos de la colección que cumplen ciertas condiciones. Es "
        "equivalente a un WHERE de SQL. Siempre debe aparecer lo más temprano posible en el "
        "pipeline para aprovechar índices y reducir la cantidad de datos que fluyen a las etapas "
        "siguientes."
    )
    add_paragraph(doc, "Uso en el sistema:", bold=True)
    add_bullet(doc, "ReporteService.ticketsPorEmpleado — filtra tickets con empleadoAsignadoId != null antes de agrupar.")
    add_bullet(doc, "ReporteService.tiempoResolucionPorModulo — filtra únicamente tickets con estado=resuelto y fechaCierre presente.")
    add_bullet(doc, "DashboardService.ticketsPorDia y ticketsPorField — filtros opcionales por rango de fecha (desde/hasta).")
    add_code_block(doc,
"""// ReporteService.java línea 79
ops.add(Aggregation.match(
    Criteria.where("empleadoAsignadoId").ne(null)));"""
    )

    add_heading(doc, "7.2 $group — agrupar y agregar", 2)
    add_paragraph(doc,
        "Agrupa los documentos según un criterio específico (clave de agrupación) y calcula "
        "agregaciones sobre los grupos resultantes: suma, promedio, conteo, máximo, mínimo. "
        "Es la etapa que convierte un listado detallado en un conjunto reducido de métricas."
    )
    add_paragraph(doc, "Uso en el sistema:", bold=True)
    add_bullet(doc, "ReporteService.ticketsPorCliente — agrupa por clienteId; cuenta totales, abiertos y resueltos usando $cond.")
    add_bullet(doc, "ReporteService.ticketsPorEmpleado — agrupa por empleadoAsignadoId; cuenta asignados, resueltos y enProceso.")
    add_bullet(doc, "ReporteService.tiempoResolucionPorModulo — agrupa por módulo y promedia las horas de resolución.")
    add_bullet(doc, "DashboardService.ticketsPorDia — agrupa por fecha (año-mes-día) y cuenta.")
    add_bullet(doc, "DashboardService.ticketsPorField — agrupa por un campo dinámico (estado/módulo/prioridad/tipo) y cuenta.")
    add_code_block(doc,
"""// ReporteService.java línea 34
ops.add(Aggregation.group("clienteId")
    .count().as("totalTickets")
    .sum(ConditionalOperators
        .when(Criteria.where("estado").in("nuevo","en_proceso","en_espera"))
        .then(1).otherwise(0)).as("ticketsAbiertos")
    .sum(ConditionalOperators
        .when(Criteria.where("estado").in("resuelto","cerrado"))
        .then(1).otherwise(0)).as("ticketsResueltos")
);"""
    )

    add_heading(doc, "7.3 $sort — ordenar", 2)
    add_paragraph(doc,
        "Ordena los documentos en función de uno o más campos, ascendente o descendente. "
        "Suele aparecer después de $group para presentar los resultados en orden descendente "
        "por una métrica, o antes de $limit para elegir los top-N."
    )
    add_paragraph(doc, "Uso en el sistema:", bold=True)
    add_bullet(doc, "ReporteService.ticketsPorCliente — ordena por totalTickets descendente para dar el ranking.")
    add_bullet(doc, "ReporteService.ticketsPorEmpleado — ordena por totalAsignados descendente.")
    add_bullet(doc, "ReporteService.tiempoResolucionPorModulo — ordena por promedioHoras ascendente (los módulos más rápidos primero).")
    add_bullet(doc, "DashboardService.ticketsPorDia — ordena cronológicamente para el gráfico de serie temporal.")
    add_bullet(doc, "DashboardService.ticketsPorField — ordena por count descendente para gráficos de barras.")
    add_code_block(doc,
"""// ReporteService.java línea 45
ops.add(Aggregation.sort(
    Sort.by(Sort.Direction.DESC, "totalTickets")));"""
    )

    add_heading(doc, "7.4 $project — reshape de salida", 2)
    add_paragraph(doc,
        "Permite seleccionar campos específicos de los documentos y remodelar la estructura de "
        "salida. Puede renombrar, excluir, calcular campos derivados o aplanar documentos anidados. "
        "Se usa típicamente al principio del pipeline para quedarse solo con los campos necesarios "
        "y al final para dar al resultado la forma esperada por el DTO del frontend."
    )
    add_paragraph(doc, "Uso en el sistema:", bold=True)
    add_bullet(doc, "ReporteService.ticketsPorCliente — después del $lookup, re-forma la salida con nit, razonSocial, totalTickets, abiertos, resueltos.")
    add_bullet(doc, "ReporteService.ticketsPorEmpleado — reshape con codigoEmpleado, nombre, área y conteos.")
    add_bullet(doc, "ReporteService.tiempoResolucionPorModulo — primero proyecta un campo calculado horas = (fechaCierre - fechaCreacion)/3600000; luego reshape final.")
    add_bullet(doc, "DashboardService.ticketsPorDia / ticketsPorField — reshape de _id → key/fecha legible.")
    add_code_block(doc,
"""// ReporteService.java líneas 48-57 (tickets-por-cliente)
ops.add(Aggregation.lookup("clientes", "_id", "_id", "cliente"));
ops.add(Aggregation.unwind("cliente", true));
ops.add(Aggregation.project()
    .and("cliente.nit").as("nit")
    .and("cliente.razonSocial").as("razonSocial")
    .and("totalTickets").as("totalTickets")
    .and("ticketsAbiertos").as("ticketsAbiertos")
    .and("ticketsResueltos").as("ticketsResueltos")
    .andExclude("_id"));"""
    )

    add_heading(doc, "7.5 $lookup — unión entre colecciones", 2)
    add_paragraph(doc,
        "Ejecuta una operación de unión entre colecciones para combinar datos relacionados. "
        "Es el equivalente a un LEFT OUTER JOIN de SQL. En MongoDB se usa cuando una colección "
        "guarda solo una referencia (ObjectId) a otra y el reporte necesita los datos descriptivos "
        "del documento referenciado (razón social, nombre, etc.)."
    )
    add_paragraph(doc, "Uso en el sistema:", bold=True)
    add_bullet(doc, "ReporteService.ticketsPorCliente — tras agrupar por clienteId, hace $lookup contra la colección clientes para traer NIT y razón social.")
    add_bullet(doc, "ReporteService.ticketsPorEmpleado — tras agrupar por empleadoAsignadoId, hace $lookup contra empleados para traer código, nombre y área.")
    add_code_block(doc,
"""// ReporteService.java línea 48 (join tickets ↔ clientes)
ops.add(Aggregation.lookup("clientes", "_id", "_id", "cliente"));
ops.add(Aggregation.unwind("cliente", true));

// ReporteService.java línea 91 (join tickets ↔ empleados)
ops.add(Aggregation.lookup("empleados", "_id", "_id", "empleado"));
ops.add(Aggregation.unwind("empleado", true));"""
    )

    add_heading(doc, "7.6 Mapa resumen de pipelines", 2)
    add_table(doc,
        ["Pipeline", "Endpoint", "Operadores"],
        [
            ["ticketsPorCliente", "GET /api/v1/reportes/tickets-por-cliente", "$group, $sort, $lookup, $project"],
            ["ticketsPorEmpleado", "GET /api/v1/reportes/tickets-por-empleado", "$match, $group, $sort, $lookup, $project"],
            ["tiempoResolucionPorModulo", "GET /api/v1/reportes/tiempo-resolucion-modulo", "$match, $project, $group, $project, $sort"],
            ["ticketsPorDia", "GET /api/v1/dashboard/tickets-por-dia", "$match, $project, $group, $project, $sort"],
            ["ticketsPorField", "GET /api/v1/dashboard/tickets-por-{estado|modulo|prioridad|tipo}", "$match, $group, $project, $sort"],
        ]
    )

    # 8. Puesta en marcha
    add_heading(doc, "8. Puesta en marcha", 1)
    add_bullet(doc, "Pre-requisitos: Java 21, Maven 3.9, MongoDB 6+ como replica set.")
    add_bullet(doc, "Copiar backend/.env.example a backend/.env y configurar MONGO_URI y JWT_SECRET.")
    add_bullet(doc, "Ejecutar cd backend && mvn spring-boot:run — levanta en localhost:8080.")
    add_bullet(doc, "En el primer arranque, DataSeeder crea los roles base (ADMIN, SOPORTE, CLIENTE, VENTAS) y un usuario administrador por defecto admin@sistemasintegrados.co / Admin1234! (cambiar en producción).")
    add_bullet(doc, "IndexInitializer asegura los índices documentados en §3.3.")
    add_bullet(doc, "Swagger UI disponible en http://localhost:8080/swagger-ui/index.html.")

    # 9. Cierre
    add_heading(doc, "9. Resumen", 1)
    add_paragraph(doc,
        "El backend expone un API REST completa (CRUD + operaciones específicas por módulo), "
        "aplica autorización fina basada en permisos, delega la consistencia de operaciones "
        "críticas a las transacciones multi-documento de MongoDB y aprovecha el Aggregation "
        "Framework para generar los reportes y dashboards. Las 11 colecciones del dominio "
        "están documentadas con validadores \\$jsonSchema y el sistema sigue una política "
        "estricta de soft-delete (vía estados terminales) para preservar la trazabilidad "
        "contable y auditoría de las entidades maestras."
    )

    # Guardar
    out_path = Path(__file__).resolve().parent.parent / "docs" / "backend-funcionamiento.docx"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(out_path)
    print(f"OK -> {out_path}")


if __name__ == "__main__":
    main()
