# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dos audiencias principales:

- **Equipo interno de Sistemas Integrados S.A.** — ingenieros de soporte, administradores, personal de ventas y operaciones. Atienden tickets, actualizan membresías, documentan soluciones, imparten capacitaciones. Trabajan desde escritorio en jornadas largas con alta rotación de tickets abiertos simultáneos.
- **Clientes empresariales** — administradores TI o jefes operativos de empresas (pymes y medianas) que compraron el ERP/POS. Entran al portal para reportar incidentes técnicos, hacer sugerencias, consultar base de conocimiento y gestionar su membresía. Usan web desktop principalmente, acceso ocasional desde móvil cuando algo urgente falla en caja.

## Product Purpose

Plataforma centralizada de helpdesk y customer-success para el ecosistema ERP/POS de "Sistemas Integrados S.A.", que gestiona tickets polimórficos por módulo (ventas online, inventarios, compras, producción, caja/POS), base de conocimiento con búsqueda semántica, membresías/pagos de clientes y capacitaciones. El éxito es: tickets resueltos rápido con contexto técnico completo del módulo afectado, menor fricción de soporte conforme el ERP crece, y auto-servicio efectivo vía base de conocimiento.

## Positioning

El soporte está construido sobre MongoDB para absorber la heterogeneidad real de los módulos ERP sin tablas vacías ni joins forzados: cada ticket almacena el contexto técnico específico del módulo afectado (ID de pasarela y log de API en Ventas Online, código de lote y temperatura de sensor en Producción, etc.) en el mismo documento. El Aggregation Framework entrega analíticas transversales (por módulo, cliente, empleado) sin ETL ni warehouse. Herramientas tradicionales obligan a elegir entre rigidez relacional o pérdida de analítica; aquí ambas conviven.

## Stack

- Backend: Spring Boot 3.3 + Java 21 + Spring Data MongoDB + Spring Security + JJWT + JavaMailSender
- Frontend: React 18 + Vite + TailwindCSS 3 + Axios + Zustand + React Router 6
- Base de datos: MongoDB Atlas (replica set, soporta transacciones multi-doc)
- Deploy: local dev únicamente (proyecto académico UFPSO)

## Capabilities

- Autenticación JWT (access + refresh), bcrypt, bloqueo tras 5 intentos fallidos, recuperación por correo
- CRUD usuarios y roles con permisos dinámicos (no hardcodeados): catálogo de 36 permisos recurso.acción
- Tickets polimórficos: título/descripción comunes + `detallesEspecificos` variable según módulo ERP
- Código ticket autogenerado `TK-YYYY-NNNN` por cliente, contador atómico
- Ciclo de vida de ticket con máquina de estados: nuevo → en_proceso → en_espera → resuelto → cerrado
- Respuestas públicas e internas, historial de estados, asignación a empleados
- Base de conocimiento: artículos con estados (borrador/publicado/archivado), búsqueda full-text con índice `$text`, contador de vistas
- Dashboard y reportes vía Aggregation Framework ($match, $group, $sort, $project, $lookup)
- Clientes con rol `CLIENTE` ven solo sus propios tickets

## Terminology

- **Módulo ERP** — una de las 5 áreas funcionales del software: `ventas_online`, `inventarios`, `compras`, `produccion`, `ventas_sitio`
- **Ticket polimórfico** — ticket con campos variables en `detallesEspecificos` según el módulo que afecta
- **Membresía** — contrato activo de un cliente con módulos ERP contratados
- **Base de conocimiento** — repositorio de artículos de soporte buscables por texto libre

## Brand Commitments

Nombre fijo: **Sistemas Integrados S.A.** Público colombiano / LatAm (español como lengua primaria, formato de moneda y fechas locales cuando aplique). Es un proyecto académico; evitar inventar testimonios, logos de clientes reales, benchmarks o pricing. La landing es demo técnica, no comercial agresiva.

## Accessibility

Soporte modo claro/oscuro ya implementado en app. Preservar contraste WCAG AA en ambos modos para landing.

## Evidence

- Documento de contexto académico: `docs/contexto.md`
- Requerimientos funcionales (161 RF) y no funcionales (15 RNF): `docs/requerimientos.md`
- 48 historias de usuario distribuidas en 8 épicas: `docs/historias-usuario.md`
- Esquema de 7 colecciones MongoDB con validators: `docs/colecciones-mongo.md`
- Equipo de 5 estudiantes de Ingeniería de Sistemas, Universidad Francisco de Paula Santander Ocaña (UFPSO)

## Open decisions

- Visual direction de la landing (brief estético) — pendiente de responder al usuario antes de `new-work`
