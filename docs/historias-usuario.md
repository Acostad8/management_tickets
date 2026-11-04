** Juan David Acosta Sánchez - 0192263  María Angélica Álvarez Navarro - 0192296 Kevin Andrés Peñaranda Pardo - 0192212** 

**Historias de Usuario Proyecto de Aula** 

**Épica 1: Autenticación y Seguridad** 

**Historia de usuario ID:** HU01 **Nombre historia:** Iniciar sesión **Usuario:** Usuario del sistema **Como:** usuario del sistema **Quiero:** iniciar sesión utilizando mi correo electrónico y contraseña **Para:** acceder al sistema de acuerdo con los permisos que tengo asignados. **Validación (criterios de aceptación):** El sistema debe permitir ingresar un correo electrónico como identificador de acceso. El sistema debe permitir ingresar una contraseña. El sistema debe validar que el correo electrónico está registrado. El sistema debe validar que la contraseña corresponda al usuario. El sistema debe impedir el acceso cuando las credenciales sean incorrectas. El sistema debe mostrar un mensaje indicando que las credenciales no son válidas cuando corresponda. Al iniciar sesión correctamente, el sistema debe establecer la sesión autenticada del usuario. El sistema debe utilizar autenticación mediante JWT para las solicitudes posteriores al inicio de sesión. 

**Historia de usuario ID:** HU02 **Nombre historia:** Cambiar contraseña 

**Usuario:** Usuario del sistema 

**Como:** usuario del sistema **Quiero:** cambiar mi contraseña **Para:** mantener segura mi cuenta de acceso. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir al usuario autenticado solicitar el cambio de contraseña. 

El sistema debe solicitar la contraseña actual antes de realizar el cambio. 

La nueva contraseña debe tener como mínimo 8 caracteres. La nueva contraseña debe contener al menos una letra mayúscula. La nueva contraseña debe contener al menos una letra minúscula. La nueva contraseña debe contener al menos un número. La nueva contraseña debe contener al menos un carácter especial. 

El sistema debe solicitar la confirmación de la nueva contraseña. 

El sistema no debe permitir guardar la contraseña cuando la confirmación no coincida. El sistema debe almacenar la contraseña de forma segura, utilizando un mecanismo de cifrado/hash apropiado. 

# **Historia de usuario** 

**ID:** HU03 **Nombre historia:** Recuperar contraseña **Usuario:** Usuario del sistema **Como:** usuario del sistema **Quiero:** recuperar mi contraseña mediante mi correo electrónico **Para:** volver a acceder al sistema cuando la haya olvidado. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir solicitar la recuperación mediante el correo electrónico registrado. El sistema debe verificar que el correo electrónico corresponda a una cuenta existente. El sistema debe generar un mecanismo temporal de recuperación. 

El mecanismo de recuperación debe tener un tiempo de validez limitado. 

<u>El sistema debe permitir establecer una nueva contraseña mediante el mecanismo de</u> 

recuperación. La nueva contraseña debe cumplir las reglas de seguridad definidas. El mecanismo de recuperación no debe poder utilizarse nuevamente después de haber sido utilizado. 

**Épica 2: Usuarios, roles y permisos** 

**Historia de usuario ID:** HU04 **Nombre historia:** Crear usuario **Usuario:** Administrador **Como:** administrador **Quiero:** crear un usuario **Para:** permitirle acceder al sistema. **Validación (criterios de aceptación):** El sistema debe permitir al administrador registrar un nuevo usuario. El sistema debe solicitar los datos básicos definidos para el usuario. El correo electrónico debe ser obligatorio. El correo electrónico debe ser único dentro del sistema. El sistema debe permitir establecer una contraseña inicial. La contraseña debe cumplir las reglas de seguridad establecidas. El sistema debe permitir asociar el usuario con un cliente cuando corresponda. El sistema debe permitir asignar uno o varios roles al usuario. El sistema debe impedir la creación del usuario cuando falten datos obligatorios. 

**Historia de usuario ID:** HU05 **Nombre historia:** Consultar usuarios **Usuario:** Administrador **Como:** administrador **Quiero:** consultar los usuarios registrados **Para:** conocer las cuentas existentes en el sistema. **Validación (criterios de aceptación):** El sistema debe mostrar una lista de usuarios registrados. La lista debe mostrar como mínimo la información básica del usuario. El sistema debe mostrar los roles asociados a cada usuario. El sistema debe permitir identificar el estado de cada usuario. 

La información debe obtenerse de los datos almacenados en MongoDB. 

# **Historia de usuario** 

**ID:** HU06 **Nombre historia:** Actualizar usuario 

**Usuario:** Administrador 

**Como:** administrador 

**Quiero:** actualizar la información de un usuario 

**Para:** mantener sus datos correctamente registrados. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir seleccionar un usuario existente. 

El sistema debe permitir modificar los campos autorizados del usuario. 

El sistema debe validar los datos modificados. 

El sistema debe mantener la unicidad del correo electrónico. 

El sistema debe guardar los cambios realizados en MongoDB. 

El sistema debe informar cuando la actualización se haya realizado correctamente. 

**Historia de usuario ID:** HU07 **Nombre historia:** Eliminar usuario 

**Usuario:** Administrador 

**Como:** administrador 

**Quiero:** eliminar un usuario 

**Para:** retirar del sistema una cuenta que ya no deba existir. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir seleccionar un usuario existente. 

El sistema debe solicitar confirmación antes de eliminarlo. 

El sistema debe impedir la eliminación accidental de un usuario. 

El sistema debe eliminar el registro de acuerdo con las reglas de integridad definidas. 

El sistema debe informar cuando la eliminación se haya realizado correctamente. 

**Historia de usuario** **<u><mark>ID:</mark></u>** <u><mark>HU08</mark></u> **<u><mark>Nombre historia:</mark></u>** <u><mark>Crear rol</mark></u> 

**Usuario:** Administrador 

**Como:** administrador 

**Quiero:** crear un rol 

**Para:** establecer nuevos perfiles de acceso dentro del sistema. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir registrar un nuevo rol. El rol debe tener un nombre único. 

El sistema debe permitir agregar una descripción al rol. 

El rol debe almacenarse como información configurable en MongoDB. 

El sistema no debe requerir modificar el código fuente para crear un nuevo rol. 

El sistema debe impedir crear roles con nombres duplicados. 

|**Historia de usuario**||
|---|---|
|**ID:**HU09|**Nombre historia:**Consultar roles|
|**Usuario:**Administrador||



**Como:** administrador 

**Quiero:** consultar los roles existentes 

**Para:** conocer los perfiles disponibles en el sistema. 

# **Validación (criterios de aceptación):** 

El sistema debe mostrar los roles registrados. 

El sistema debe mostrar el nombre y descripción de cada rol. 

El sistema debe mostrar los permisos asociados a cada rol. 

La información debe obtenerse desde MongoDB. 

|**Historia de usuario**||
|---|---|
|**ID:**HU10|**Nombre historia:**Actualizar rol|
|**Usuario:**Administrador||
|**Como:**administrador||



**Quiero:** actualizar un rol 

**Para:** modificar la información de un perfil existente. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir seleccionar un rol existente. El sistema debe permitir modificar su información. El sistema debe validar que el nombre del rol no genere duplicados. El sistema debe conservar las relaciones existentes con los usuarios cuando corresponda. Los cambios deben almacenarse en MongoDB. 

**Historia de usuario ID:** HU12 **Nombre historia:** Asignar permisos a rol **Usuario:** Administrador **Como:** administrador **Quiero:** asignar permisos a un rol **Para:** definir las acciones que pueden realizar los usuarios que tengan dicho rol. 

# **Validación (criterios de aceptación):** 

El sistema debe mostrar los permisos disponibles. El sistema debe permitir seleccionar permisos para un rol. El sistema debe almacenar la relación entre roles y permisos. Un rol puede tener múltiples permisos. Los permisos deben determinar las operaciones que puede ejecutar un usuario. La autorización no debe depender de una lista fija de roles escrita directamente en el código. 

|**Historia de usuario**||
|---|---|
|**ID:**HU13|**Nombre historia:**Asignar roles a usuario|
|**Usuario:**Administrador||
|**Como:**administrador||
|**Quiero:**asignar uno o varios roles a un usuario||
|**Para: E**stablecer los permisos que tendrá dentro|del sistema.|



# **Validación (criterios de aceptación):** 

El sistema debe permitir seleccionar uno o varios roles existentes. 

Un usuario debe poder tener más de un rol simultáneamente. El sistema debe almacenar las relaciones entre el usuario y sus roles. El sistema debe impedir asignar roles que estén desactivados. Los permisos efectivos del usuario deben derivarse de los roles que tenga asignados. 

**Épica 3:  Clientes** 

**Historia de usuario ID:** HU14 **Nombre historia:** Crear cliente **Usuario:** Administrador **Como:** administrador **Quiero:** registrar un cliente **Para:** incorporarlo al sistema y relacionarlo con sus usuarios, membresías y pagos. **Validación (criterios de aceptación):** 

El sistema debe permitir registrar un cliente. 

El sistema debe solicitar como mínimo la razón social o nombre del cliente. El sistema debe solicitar el NIT o identificador empresarial correspondiente. El sistema debe solicitar un nombre de contacto. El sistema debe solicitar un correo electrónico de contacto. El sistema debe solicitar un número telefónico de contacto. El sistema debe solicitar la dirección del cliente. 

El sistema debe permitir registrar la ciudad o ubicación del cliente. 

- El sistema debe validar los campos obligatorios. 

- El cliente debe quedar almacenado en MongoDB. 

**Historia de usuario ID:** HU15 **Nombre historia:** Consultar clientes **Usuario:** Administrador **Como:** administrador **Quiero:** consultar los clientes registrados **Para:** conocer la información de las empresas que utilizan el servicio. 

# **Validación (criterios de aceptación):** 

El sistema debe mostrar los clientes registrados. 

El sistema debe mostrar la información básica de cada cliente. 

El sistema debe permitir consultar el detalle de un cliente. 

La información debe obtenerse desde MongoDB. 

**Historia de usuario ID:** HU16 **Nombre historia:** Actualizar cliente **Usuario:** Administrador **Como:** administrador 

**Quiero:** actualizar la información de un cliente **Para:** mantener sus datos correctamente registrados. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir seleccionar un cliente existente. 

El sistema debe permitir modificar los campos autorizados. El sistema debe validar la información modificada. 

El sistema debe guardar los cambios en MongoDB. 

El sistema debe conservar las relaciones existentes del cliente con usuarios, membresías y pagos. 

**Historia de usuario** 

**ID:** HU17 **Nombre historia:** Eliminar cliente 

**Usuario:** Administrador 

**Como:** administrador **Quiero:** eliminar un cliente 

**Para:** retirar del sistema un registro que ya no deba mantenerse. 

# **Validación (criterios de aceptación):** 

- El sistema debe permitir seleccionar un cliente. 

El sistema debe solicitar confirmación antes de eliminarlo. 

El sistema debe verificar las relaciones existentes del cliente antes de realizar la eliminación. El sistema debe aplicar las reglas de integridad definidas para los datos relacionados. 

El sistema debe informar el resultado de la operación. 

**Épica 4:  Membresías y pagos** 

**Historia de usuario ID:** HU18 **Nombre historia:** Crear membresía **Usuario:** Administrador **Como:** administrador **Quiero:** registrar una membresía para un cliente **Para:** establecer los servicios contratados por este. **Validación (criterios de aceptación):** El sistema debe permitir seleccionar un cliente. El sistema debe permitir registrar una membresía. El sistema debe permitir indicar los módulos del ERP/POS contratados. El sistema debe permitir registrar la información correspondiente a la membresía. La membresía debe quedar relacionada con el cliente. La información debe almacenarse en MongoDB. 

**Historia de usuario ID:** HU19 **Nombre historia:** Consultar membresías **Usuario:** Administrador **Como:** administrador **Quiero:** consultar las membresías registradas **Para:** conocer los servicios contratados por los clientes. **Validación (criterios de aceptación):** El sistema debe mostrar las membresías existentes. El sistema debe permitir identificar el cliente asociado. El sistema debe mostrar los módulos contratados. El sistema debe mostrar el estado de la membresía. El sistema debe permitir consultar el detalle de una membresía. 

**Historia de usuario ID:** HU20 **Nombre historia:** Actualizar membresía 

**Usuario:** Administrador 

**Como:** administrador 

**Quiero:** actualizar una membresía 

**Para:** modificar la información de los servicios contratados por un cliente. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir seleccionar una membresía existente. El sistema debe permitir modificar los datos autorizados. El sistema debe permitir modificar los módulos contratados. 

El sistema debe validar la información modificada. 

Los cambios deben almacenarse en MongoDB. 

**Historia de usuario ID:** HU21 **Nombre historia:** Cambiar estado de membresía 

**Usuario:** Administrador 

**Como:** administrador 

**Quiero:** cambiar el estado de una membresía **Para:** reflejar su situación actual. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir seleccionar una membresía. 

El sistema debe permitir cambiar su estado. 

El sistema debe almacenar el nuevo estado. 

El sistema debe mostrar el estado actualizado. 

Los estados permitidos deben estar definidos por el sistema. 

**Historia de usuario ID:** HU22 **Nombre historia:** Registrar pago **Usuario:** Administrador **Como:** administrador **Quiero:** registrar un pago realizado por un cliente **Para:** mantener actualizado su historial de pagos. **Validación (criterios de aceptación):** El sistema debe permitir seleccionar el cliente relacionado con el pago. El sistema debe permitir asociar el pago con una membresía cuando corresponda. El sistema debe permitir registrar el valor del pago. El sistema debe permitir registrar la fecha del pago. El sistema debe permitir registrar la información del medio de pago. El pago debe quedar almacenado en MongoDB. 

**Historia de usuario ID:** HU23 **Nombre historia:** Consultar pagos 

**Usuario:** Administrador 

**Como:** administrador 

**Quiero:** consultar los pagos registrados 

**Para:** revisar el historial de pagos de los clientes. 

# **Validación (criterios de aceptación):** 

El sistema debe mostrar los pagos registrados. 

El sistema debe permitir identificar el cliente asociado. 

El sistema debe mostrar el valor y fecha del pago. 

El sistema debe permitir consultar el detalle de un pago. 

La información debe obtenerse desde MongoDB. 

**Historia de usuario ID:** HU24 **Nombre historia:** Actualizar pago **Usuario:** Administrador **Como:** administrador **Quiero:** actualizar la información de un pago **Para:** corregir datos registrados incorrectamente. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir seleccionar un pago existente. 

El sistema debe permitir modificar los campos autorizados. 

El sistema debe validar los datos modificados. 

El sistema debe conservar la relación del pago con el cliente. 

Los cambios deben almacenarse en MongoDB. 

**Historia de usuario ID:** HU25 **Nombre historia:** Garantizar consistencia entre pago y membresía **Usuario:** Administrador **Como:** administrador **Quiero:** quiero que el registro de un pago y la actualización relacionada de una membresía se realicen de forma atómica **Para:** evitar información inconsistente. **Validación (criterios de aceptación):** El sistema debe utilizar una transacción de MongoDB cuando una operación afecte simultáneamente el pago y la membresía. Las operaciones relacionadas deben confirmarse únicamente cuando todas se ejecuten correctamente. Si una operación falla, la transacción debe revertirse. El sistema no debe dejar un pago registrado sin la actualización correspondiente cuando ambas operaciones formen parte de la misma transacción. La consistencia debe comprobarse mediante operaciones reales sobre MongoDB. 

**Épica 5: Gestión de tickets de soporte** 

**Historia de usuario ID:** HU26 **Nombre historia:** Crear ticket **Usuario:** Cliente **Como:** cliente **Quiero:** crear un ticket **Para:** reportar un problema, incidente o solicitud relacionada con el ERP/POS. **Validación (criterios de aceptación):** El sistema debe permitir crear tickets únicamente a usuarios autenticados. El usuario debe estar asociado a un cliente registrado. El sistema debe solicitar la información básica del ticket. El sistema debe permitir seleccionar el módulo del ERP/POS relacionado. El sistema debe permitir indicar el título y descripción del caso. El ticket debe quedar relacionado con el usuario y cliente que lo creó. El sistema debe asignar el estado inicial definido para los nuevos tickets. El ticket debe almacenarse en MongoDB. 

|**Historia de usuario**|
|---|
|**ID:**HU27<br>**Nombre historia:**Seleccionar módulo del<br>ticket|
|**Usuario:**Cliente|
|**Como:**cliente|
|**Quiero:**seleccionar el módulo del ERP/POS relacionado con mi ticket|
|**Para:**proporcionar el contexto necesario para su atención.|



# **Validación (criterios de aceptación):** 

El sistema debe mostrar los módulos disponibles del ERP/POS. 

El usuario debe seleccionar un módulo antes de registrar el ticket. 

El módulo seleccionado debe quedar almacenado en el ticket. 

El sistema debe utilizar el módulo seleccionado para determinar la información específica que debe solicitar. 

|**Historia de usuario**||
|---|---|
|**ID:**HU28|**Nombre historia:**Registrar detalles|
||específicos del módulo|
|**Usuario:**Cliente||



**Como:** cliente 

**Quiero:** registrar los detalles específicos del módulo seleccionado 

**Para:** proporcionar información técnica relevante para mi caso. 

# **Validación (criterios de aceptación):** 

El sistema debe mostrar campos diferentes según el módulo seleccionado. 

Los campos deben poder variar entre tipos de tickets. 

Los datos específicos deben almacenarse dentro de la estructura variable del ticket. El sistema debe permitir almacenar diferentes estructuras de detalles dentro de una misma colección de tickets. 

La estructura debe permitir representar información como identificadores, códigos, URLs, registros técnicos, lotes, maquinaria o temperaturas cuando corresponda al módulo. 

|**Historia de usuario**||
|---|---|
|**ID:**HU29|**Nombre historia:**Consultar mis tickets|
|**Usuario:**Cliente||
|**Como:**cliente||



**Quiero:** consultar los tickets que he creado 

**Para:** conocer el estado de los casos reportados. 

# **Validación (criterios de aceptación):** 

El sistema debe mostrar los tickets asociados al cliente del usuario autenticado. 

El cliente no debe poder consultar tickets pertenecientes a otros clientes. 

La lista debe mostrar como mínimo el identificador, título, módulo, estado y fecha del ticket. El sistema debe obtener la información desde MongoDB. 

**<u><mark>Historia de usuario</mark></u>** 

**ID:** HU30 **Nombre historia:** Consultar detalle de ticket 

**Usuario:** Cliente 

**Como:** cliente **Quiero:** consultar el detalle de un ticket 

**Para:** conocer toda la información registrada sobre el caso. 

# **Validación (criterios de aceptación):** 

El sistema debe mostrar la información general del ticket. 

El sistema debe mostrar el módulo asociado. 

El sistema debe mostrar los detalles específicos del módulo. 

El sistema debe mostrar el estado actual. 

El sistema debe mostrar las respuestas o soluciones registradas. 

El sistema debe respetar los permisos del usuario al mostrar la información. 

|**Historia de usuario**||
|---|---|
|**ID:**HU31|**Nombre historia:**Consultar todos los tickets|
|**Usuario:**Administrador||



**Como:** Administrador 

**Quiero:** consultar todos los tickets registrados **Para:** supervisar los casos de soporte de todos los clientes. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir al administrador consultar todos los tickets. 

La consulta debe incluir tickets de diferentes clientes. El sistema debe mostrar información básica de cada ticket. 

El administrador debe poder acceder al detalle de un ticket. 

La información debe obtenerse desde MongoDB. 

|**Historia de usuario**||
|---|---|
|**ID:**HU32|**Nombre historia:**Consultar tickets de soporte|
|**Usuario:**Usuario de soporte||



**Como:** usuario de soporte **Quiero:** consultar los tickets disponibles para atención **Para:** identificar los casos que requieren soporte. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir al usuario con permisos de soporte consultar tickets. El sistema debe mostrar información básica de los casos disponibles. El sistema debe respetar los permisos asignados al usuario. La información debe obtenerse desde MongoDB. 

**Historia de usuario ID:** HU33 **Nombre historia:** Filtrar tickets **Usuario:** Usuario de soporte **Como:** usuario de soporte **Quiero:** filtrar los tickets 

**Para:** localizar rápidamente los casos que necesito consultar. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir filtrar tickets por los criterios definidos. 

Los criterios pueden incluir módulo, estado, prioridad o fecha cuando estos campos estén disponibles. 

El sistema debe mostrar únicamente los tickets que cumplan los filtros seleccionados. Los filtros deben poder utilizarse sobre la información almacenada en MongoDB. 

**Historia de usuario ID:** HU34 **Nombre historia:** Actualizar estado del ticket **Usuario:** Usuario de soporte 

**Como:** usuario de soporte **Quiero:** actualizar el estado de un ticket **Para:** reflejar el avance de su atención. 

**Validación (criterios de aceptación):** 

<u>El sistema debe permitir actualizar el estado de un ticket a usuarios con el permiso</u> 

correspondiente. 

El sistema debe mostrar los estados permitidos. 

El sistema debe validar que el nuevo estado sea válido. 

El sistema debe almacenar el nuevo estado en MongoDB. 

El sistema debe mostrar el estado actualizado al consultar el ticket. 

|**Historia de usuario**||
|---|---|
|**ID:**HU35|**Nombre historia:**Responder ticket|



**Usuario:** Usuario de soporte 

**Como:** usuario de soporte **Quiero:** registrar una respuesta en un ticket **Para:** comunicar al cliente información relacionada con su caso. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir registrar una respuesta en un ticket. 

La respuesta debe quedar relacionada con el ticket. 

El sistema debe registrar el usuario que realizó la respuesta. 

El sistema debe registrar la fecha y hora de la respuesta. 

El cliente debe poder consultar las respuestas asociadas a sus tickets. 

|**Historia de usuario**||
|---|---|
|**ID:**HU36|**Nombre historia:**Registrar solución de ticket|
|**Usuario:**Usuario de soporte||



**Como:** usuario de soporte 

**Quiero:** registrar la solución aplicada a un ticket 

**Para:** dejar constancia de cómo fue atendido el caso. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir registrar una solución para un ticket. La solución debe quedar asociada al ticket correspondiente. 

El sistema debe registrar el usuario que documentó la solución. 

El sistema debe registrar la fecha de la solución. 

La información debe almacenarse en MongoDB. La solución debe poder utilizarse posteriormente como referencia para la base de conocimiento cuando corresponda. 

# **Épica 6 — Base de conocimiento** 

**Historia de usuario ID:** HU37 **Nombre historia:** Crear artículo de conocimiento **Usuario:** Usuario de soporte **Como:** usuario de soporte **Quiero:** crear un artículo de conocimiento **Para:** almacenar soluciones y procedimientos que puedan reutilizarse. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir registrar un artículo. El artículo debe contener un título. El artículo debe contener contenido descriptivo. El sistema debe permitir registrar información relacionada con el módulo correspondiente cuando aplique.Consultar tickets agrupados por módulo El artículo debe almacenarse en MongoDB. El sistema debe conservar la fecha y usuario responsable de su creación. 

**Historia de usuario ID:** HU38 **Nombre historia:** Consultar artículos de conocimiento **Usuario:** Usuario **Como:** usuario **Quiero:** consultar los artículos de conocimiento **Para:** obtener información relacionada con problemas o procedimientos del sistema. 

# **Validación (criterios de aceptación):** 

El sistema debe mostrar los artículos disponibles. 

El usuario debe poder abrir un artículo para consultar su contenido. 

El sistema debe mostrar la información almacenada en el artículo. 

El acceso debe respetar los permisos definidos. 

# **Historia de usuario** 

**ID:** HU39 **Nombre historia:** Buscar conocimiento por texto **Usuario:** Usuario **Como:** usuario **Quiero:** buscar artículos mediante texto libre **Para:** encontrar rápidamente información relacionada con mi consulta. **Validación (criterios de aceptación):** El sistema debe permitir introducir términos de búsqueda. El sistema debe buscar los términos dentro del contenido definido para la base de conocimiento. La búsqueda debe utilizar un índice de texto de MongoDB. El sistema debe mostrar los artículos relacionados con los términos ingresados. La búsqueda debe funcionar sin necesidad de conocer el título exacto del artículo. 

# **Épica 7: Capacitaciones** 

|**Historia de usuario**||
|---|---|
|**ID:**HU40|**Nombre historia:**Crear capacitación|
|**Usuario:**Administrador||
|**Como:**administrador||
|**Quiero:**crear una capacitación||



**Para:** registrar una nueva actividad de formación para los clientes. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir registrar una capacitación. La capacitación debe tener un nombre o título. La capacitación debe contener una descripción. El sistema debe permitir registrar la información necesaria para identificar la capacitación. La capacitación debe almacenarse en MongoDB. 

|**Historia de usuario**||
|---|---|
|**ID:**HU41|**Nombre historia:**Programar capacitación|
|**Usuario:**Administrador||
|**Como:**administrador||
|**Quiero:**programar una capacitación||
|**Para:**establecer la fecha y horario en que s|erá realizada.|



# **Validación (criterios de aceptación):** 

El sistema debe permitir seleccionar una capacitación existente. 

El sistema debe permitir establecer una fecha. 

El sistema debe permitir establecer una hora. 

El sistema debe validar que la fecha y hora sean válidas. 

La programación debe almacenarse en MongoDB. 

**Historia de usuario ID:** HU42 **Nombre historia:** Definir modalidad de capacitación 

**Usuario:** Administrador 

**Como:** administrador 

**Quiero:** definir la modalidad de una capacitación 

**Para:** establecer el tipo de participantes al que está dirigida. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir seleccionar la modalidad de la capacitación. 

Debe existir una modalidad para capacitaciones masivas. 

Debe existir una modalidad para capacitaciones personalizadas. 

La modalidad seleccionada debe quedar almacenada en la capacitación. 

|**Historia de usuario**||
|---|---|
|**ID:**HU43|**Nombre historia:**Consultar capacitaciones|
|**Usuario:**Cliente||



**Como:** cliente 

**Quiero:** consultar las capacitaciones disponibles 

**Para:** conocer las actividades de formación programadas. 

# **Validación (criterios de aceptación):** 

El sistema debe mostrar las capacitaciones disponibles para el cliente. 

La información debe incluir el nombre de la capacitación. 

La información debe incluir la fecha y horario cuando hayan sido programados. 

El sistema debe mostrar la modalidad de la capacitación. 

El cliente debe poder consultar el detalle de una capacitación. 

**Historia de usuario ID:** HU44 **Nombre historia:** Registrar asistencia **Usuario:** Cliente **Como:** cliente 

**Quiero:** registrar la asistencia de un participante a una capacitación **Para:** mantener el control de las personas que participaron. **Validación (criterios de aceptación):** 

El sistema debe permitir seleccionar una capacitación. El sistema debe permitir seleccionar un participante. El sistema debe registrar la asistencia del participante. La asistencia debe quedar relacionada con la capacitación y el participante. El sistema debe evitar registros duplicados de asistencia para la misma capacitación y participante. 

**Épica 8 — Reportes y Analytics** 

|**Historia de usuario**||
|---|---|
|**ID:**HU45|**Nombre historia:**Consultar estadísticas de|
||tickets|
|**Usuario:**Administrador||



**Como:** Administrador **Quiero:** consultar estadísticas de los tickets **Para:** analizar el comportamiento de los problemas reportados por los clientes. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir consultar estadísticas de tickets. Las estadísticas deben obtenerse de la información almacenada en MongoDB. Deben poder representarse cantidades de tickets. Las estadísticas deben generarse mediante operaciones de agregación cuando corresponda. 

|**Historia de usuario**||
|---|---|
|**ID:**HU46|**Nombre historia:**Consultar tickets agrupados|
||por módulo|
|**Usuario:**Administrador||



**Como:** Administrador **Quiero:** consultar los tickets agrupados por módulo **Para:** analizar la distribución de solicitudes entre los componentes del ERP/POS. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir obtener la cantidad de tickets por módulo. El resultado debe identificar cada módulo del ERP/POS. La información debe provenir de la colección de tickets. La consulta debe utilizar el Aggregation Framework de MongoDB cuando corresponda. El resultado debe poder representarse de forma comprensible en la interfaz. 

**Historia de usuario ID:** HU47 **Nombre historia:** Consultar información relacionada entre colecciones 

**Usuario:** Cliente 

**Como:** cliente 

**Quiero:** consultar información relacionada entre diferentes colecciones 

**Para:** obtener reportes que integren datos del sistema. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir relacionar información almacenada en diferentes colecciones. Las relaciones deben realizarse mediante operaciones de agregación. 

El sistema debe utilizar $lookup cuando sea necesario relacionar documentos entre 

colecciones. 

El sistema debe utilizar $match para establecer condiciones de consulta cuando corresponda. El sistema debe utilizar $group para realizar agrupaciones cuando corresponda. 

Los resultados deben poder utilizarse para generar información analítica. 

**Historia de usuario** 

**ID:** HU48 **Nombre historia:** Generar reportes relacionados entre colecciones 

**Usuario:** Administrador 

**Como:** administrador 

**Quiero:** generar reportes que relacionen información de diferentes colecciones **Para:** obtener análisis más completos sobre clientes, tickets y capacitaciones. 

# **Validación (criterios de aceptación):** 

El sistema debe permitir generar reportes utilizando información de diferentes colecciones. Las consultas deben utilizar el Framework de Agregación. 

Debe utilizarse $lookup cuando sea necesario relacionar documentos. 

Debe poder cambinarse $lookup con $match y $group. 

Los resultados deben presentar información útil para el análisis. 

