DESCRIPCIÓN DEL PROBLEMA:
Sistema Inteligente de Soporte y Éxito del Cliente (Helpdesk & Customer
Success) para Ecosistemas ERP/POS
ANTECEDENTES Y CONTEXTO
La empresa ficticia "Sistemas Integrados S.A." comercializa un sistema de
información modular de tipo ERP (Planificación de Recursos Empresariales) y
POS (Punto de Venta) en la nube. Este ecosistema de software es utilizado por
cientos de empresas clientes y cuenta con los siguientes módulos activos:
1. Ventas Online (E-commerce): Pasarelas de pago, carritos de compra y
sincronización web.
2. Manejo de Inventarios: Control de existencias, bodegas, alertas de stock
y códigos de barra.
3. Compras: Gestión de proveedores, órdenes de compra y cuentas por
pagar.
4. Producción (Manufactura): Gestión de lotes, recetas de materia prima y
costos de fabricación.
5. Ventas en Sitio (Caja/POS): Facturación rápida, manejo de efectivo y
turnos de cajeros.
DEFINICIÓN DE LA PROBLEMÁTICA
A medida que la empresa ha crecido, el departamento de atención al usuario se
ha vuelto inmanejable debido a la heterogeneidad y variabilidad de los datos. Los
clientes reportan incidentes técnicos (problemáticas) y sugieren mejoras
(aciertos), pero la información de soporte es radicalmente distinta según el
módulo afectado.
Por ejemplo:
Un ticket de soporte del módulo de Ventas Online requiere almacenar campos
como: ID de pasarela de pago, URL del error, navegador web utilizado y log de
la API.
Un ticket del módulo de Producción requiere almacenar campos como: ID de
maquinaria, código de lote, fase del proceso (mezclado, empaque) y temperatura
del sensor.
Intentar estructurar esto en una base de datos relacional (SQL) tradicional ha
generado tablas llenas de valores nulos (NULL), un rendimiento lento debido a

múltiples uniones (JOINs) complejas y rigidez extrema cada vez que el ERP
añade una nueva funcionalidad.
A esto se suma la necesidad de gestionar membresías de pago dinámicas (con
diferentes niveles de acceso, estados de cuenta y módulos contratados por
cliente) y la planificación de cronogramas de capacitación masivas o
personalizadas para reducir la tasa de errores de los usuarios.
3. El Reto de Ingeniería (Objetivo del Proyecto)
Los estudiantes de Ingeniería de Sistemas deberán diseñar, programar e
implementar una solución integral (Frontend + Backend + Base de Datos) para
la Mesa de Ayuda y Gestión del Cliente, utilizando MongoDB como motor
principal para demostrar las ventajas del paradigma NoSQL.
El sistema debe resolver de forma eficiente:
1. Polimorfismo de Datos: Almacenar tickets de soporte con estructuras
completamente diferentes en una misma colección, sin desperdiciar
almacenamiento ni comprometer la integridad.
2. Búsquedas Semánticas y Recuperación Exponencial: Permitir a los
ingenieros de soporte buscar soluciones en una base de conocimientos
mediante lenguaje natural (texto libre).
3. Monitoreo en Tiempo Real (Analytics): Procesar grandes volúmenes de
tickets y asistencias a capacitaciones para generar analíticas avanzadas
(ej. descubrir cuál módulo del ERP es el que más falla) de forma nativa en
la base de datos.
4. Consistencia Operacional: Controlar las membresías de los clientes,
asegurando que si un pago falla, el acceso a los módulos de soporte se
bloquee atómicamente y sin discrepancias en los datos.