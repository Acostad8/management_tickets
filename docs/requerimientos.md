# **Requerimientos Funcionales (RF)** 

# **Módulo de Autenticación** 

|**ID**|**Requerimiento**|**HU**|
|---|---|---|
|RF01|El sistema debe permitir el inicio de sesión mediante correo<br>electrónico y contraseña.|HU01|
|RF02|El sistema debe permitir al usuario recuperar su contraseña por<br>medio del correo electrónico|HU03|
|RF03|El sistema debe validar que las credenciales ingresadas sean<br>correctas.|HU01|
|RF04|El sistema debe mostrar un mensaje de error cuando las credenciales<br>sean incorrectas.|HU01|
|RF05|El sistema debe permitir el acceso a las funcionalidades autorizadas<br>tras una autenticación exitosa.|HU01|
|RF06|El sistema debe asignar un rol a cada usuario.|HU02|
|RF07|El sistema debe identificar el rol del usuario autenticado.|HU02|
|RF08|El sistema debe restringir las funcionalidades según el rol del<br>usuario.|HU02|
|RF09|El sistema debe impedir que un usuario no autorizado acceda a<br>funcionalidades restringidas.|HU02|



|RF10|El sistema debe generar un token JWT después de una autenticación<br>exitosa.|HU03|
|---|---|---|
|RF11|El sistema debe validar las solicitudes protegidas mediante el token<br>JWT.|HU03|
|RF12|El sistema debe rechazar solicitudes sin un token válido.|HU03|
|RF13|El sistema debe identificar al usuario y su rol a partir de la<br>información del JWT.|HU03|



# **Módulo de Tickets** 

|**ID**|**Requerimiento**|**HU**|
|---|---|---|
|RF14|El sistema debe permitir crear un nuevo ticket de soporte.|HU04|
|RF15|El sistema debe permitir ingresar la información general del<br>problema.|HU04|
|RF16|El ticket debe quedar asociado al cliente que lo registra.|HU04|
|RF17|El ticket debe registrar el módulo relacionado.|HU04|



|RF18|El sistema debe validar la información antes de guardar el ticket.|HU04|
|---|---|---|
|RF19|El ticket debe almacenarse en MongoDB una vez creado<br>correctamente.|HU04|
|RF20|El formulario de creación debe permitir seleccionar un módulo del<br>ERP/POS.|HU05|
|RF21|El sistema debe disponer de los módulos definidos para el<br>ERP/POS.|HU05|
|RF22|La selección del módulo debe ser obligatoria.|HU05|
|RF23|El módulo seleccionado debe almacenarse en el ticket.|HU05|
|RF24|La selección del módulo debe determinar los campos específicos<br>del formulario.|HU05 /<br>HU06|
|RF25|El formulario debe mostrar campos generales del ticket.|HU06|
|RF26|Los campos específicos deben cambiar según el módulo<br>seleccionado.|HU06|
|RF27|El sistema debe permitir solicitar datos específicos para el módulo<br>de Ventas Online.|HU06|
|RF28|El sistema debe permitir solicitar datos específicos para el módulo|HU06|



||de Producción.||
|---|---|---|
|RF29|Los campos específicos deben almacenarse dentro de la<br>información variable del ticket.|HU06|
|RF30|El sistema debe permitir almacenar diferentes estructuras de<br>información en la misma colección de tickets.|HU06|
|RF31|Los tickets deben almacenarse en una misma colección.|HU07|
|RF32|Los documentos de tickets deben compartir información común.|HU07|
|RF33|Los documentos de tickets deben contener información específica<br>según el módulo.|HU07|
|RF34|Un ticket de Ventas Online debe poder tener campos diferentes a<br>uno de Producción.|HU07|
|RF35|La estructura variable debe conservarse dentro del documento del<br>ticket.|HU07|
|RF36|MongoDB debe validar la estructura de acuerdo con las reglas<br>definidas.|HU07|
|RF37|El cliente debe poder acceder a una lista de sus tickets.|HU08|



|RF38|Sólo deben mostrarse los tickets correspondientes al cliente<br>autenticado.|HU08|
|---|---|---|
|RF39|La lista debe mostrar información básica de cada ticket.|HU08|
|RF40|Debe poder identificarse el estado de cada ticket.|HU08|
|RF41|Debe poder seleccionar un ticket para consultar su información<br>detallada.|HU08|
|RF42|El sistema debe mostrar la información general del ticket.|HU09|
|RF43|El sistema debe mostrar el módulo asociado al ticket.|HU09|
|RF44|El sistema debe mostrar la información específica del módulo.|HU09|
|RF45|El sistema debe mostrar el estado y prioridad cuando estén<br>definidos.|HU09|
|RF46|El personal de soporte debe poder consultar la información<br>necesaria para atender el problema.|HU09|



|RF47|El personal de soporte debe tener acceso a una lista de tickets<br>disponibles.|HU10|
|---|---|---|
|RF48|La lista debe mostrar información relevante de cada ticket.|HU10|
|RF49|Debe poder identificarse el cliente asociado al ticket.|HU10|
|RF50|Debe poder identificarse el módulo relacionado.|HU10|
|RF51|Debe poder identificarse el estado del ticket.|HU10|
|RF52|Debe poder filtrar los tickets por módulo.|HU11|
|RF53|Debe poder filtrar los tickets por estado.|HU11|
|RF54|Debe poder filtrarse los tickets por prioridad.|HU11|
|RF55|Debe poder filtrarse los tickets por fecha cuando corresponda.|HU11|
|RF56|Los resultados deben actualizarse según los filtros seleccionados.|HU11|
|RF57|El técnico debe poder seleccionar un ticket para atenderlo.|HU12|



|RF58|El técnico debe poder visualizar toda la información necesaria del<br>ticket.|HU12|
|---|---|---|
|RF59|El técnico debe poder consultar el contexto específico del módulo.|HU12|
|RF60|El técnico debe poder actualizar la información relacionada con la<br>atención.|HU12|
|RF61|La atención debe quedar asociada al ticket correspondiente.|HU12|
|RF62|El técnico debe poder modificar el estado de un ticket.|HU13|
|RF63|El sistema debe permitir únicamente estados válidos.|HU13|
|RF64|El nuevo estado debe quedar almacenado en el ticket.|HU13|
|RF65|El estado actualizado debe poder visualizarse posteriormente.|HU13|
|RF66|Los estados definitivos deben corresponder a los definidos para el<br>flujo del sistema.|HU13|



|RF67|El técnico debe poder escribir una respuesta en un ticket.|HU14|
|---|---|---|
|RF68|La respuesta debe quedar asociada al ticket.|HU14|
|RF69|Debe registrarse quién realizó la respuesta.|HU14|
|RF70|Debe registrarse la fecha de la respuesta.|HU14|
|RF71|El cliente debe poder consultar la respuesta desde el ticket<br>correspondiente.|HU14|



# **Módulo de Base de Conocimientos** 

|**ID**|**Requerimiento**|**HU**|
|---|---|---|
|RF72|El personal autorizado debe poder crear un artículo de<br>conocimiento.|HU15|
|RF73|El artículo debe permitir registrar un título.|HU15|
|RF74|El artículo debe permitir registrar el contenido de la solución.|HU15|
|RF75|El artículo debe poder asociarse con un módulo cuando<br>corresponda.|HU15|



|RF76|El artículo debe quedar almacenado en la base de conocimientos.|HU15|
|---|---|---|
|RF77|Debe existir un campo de búsqueda de soluciones.|HU16|
|RF78|El usuario debe poder introducir palabras o frases relacionadas con<br>el problema.|HU16|
|RF79|La búsqueda debe utilizar el índice de texto de MongoDB.|HU16|
|RF80|El sistema debe devolver artículos relacionados con los términos<br>de búsqueda.|HU16|
|RF81|Los resultados deben mostrar información suficiente para<br>identificar la solución encontrada.|HU16|
|RF82|Los resultados deben mostrarse después de realizar una búsqueda.|HU17|
|RF83|Cada resultado debe permitir identificar el artículo.|HU17|
|RF84|Debe poder consultarse el contenido del artículo.|HU17|
|RF85|Los resultados deben corresponder a los términos de búsqueda|HU17|



||utilizados.||
|---|---|---|
|RF86|La información debe estar disponible sin necesidad de consultas|HU17|
||manuales en MongoDB.||



# **Módulo de Clientes** 

|**ID**|**Requerimiento**|**HU**|
|---|---|---|
|RF87|El administrador debe disponer de una opción para registrar clientes.|HU18|
|RF88|El sistema debe solicitar la información definida como obligatoria.|HU18|
|RF89|El sistema debe validar los datos antes de guardar el cliente.|HU18|
|RF90|Cada cliente debe tener un identificador único.|HU18|
|RF91|El cliente debe quedar almacenado en MongoDB.|HU18|
|RF92|El administrador debe poder visualizar una lista de clientes.|HU19|



|RF93|La lista debe mostrar la información principal de cada cliente.|HU19|
|---|---|---|
|RF94|Debe poder seleccionar un cliente para consultar su información.|HU19|
|RF95|Debe poder identificarse la membresía y demás información<br>relacionada cuando corresponda.|HU19|
|RF96|El administrador debe poder seleccionar un cliente para actualizarlo.|HU20|
|RF97|Debe poder modificar los campos permitidos.|HU20|
|RF98|El sistema debe validar la información actualizada.|HU20|
|RF99|Los cambios deben quedar almacenados correctamente.|HU20|
|RF10<br>0|La información actualizada debe visualizarse posteriormente.|HU20|



|**Módulo**|**de Membresías y Pagos**||
|---|---|---|
|**ID**|**Requerimiento**|**HU**|



|RF101|El administrador debe poder asociar una membresía a un cliente.|HU21|
|---|---|---|
|RF102|La membresía debe registrar el plan correspondiente.|HU21|
|RF103|Debe registrarse el estado de la membresía.|HU21|
|RF104|Deben poder registrarse los módulos contratados.|HU21|
|RF105|La membresía debe quedar asociada al cliente correspondiente.|HU21|
|RF106|El administrador debe poder seleccionar los módulos contratados.|HU22|
|RF107|Los módulos deben almacenarse asociados a la membresía.|HU22|
|RF108|Solo deben poder seleccionarse módulos válidos del ERP/POS.|HU22|
|RF109|La información debe poder consultarse posteriormente.|HU22|
|RF110|Los módulos contratados deben corresponder con la membresía<br>del cliente.|HU22|



|RF111|El administrador debe poder consultar el estado de una<br>membresía.|HU23|
|---|---|---|
|RF112|Debe poder actualizar el estado cuando corresponda.|HU23|
|RF113|El sistema debe manejar únicamente estados válidos.|HU23|
|RF114|El estado actualizado debe almacenarse correctamente.|HU23|
|RF115|El estado debe poder utilizarse para determinar la situación de la<br>membresía.|HU23|
|RF116|El administrador debe poder registrar un pago asociado a una<br>membresía.|HU24|
|RF117|El pago debe estar asociado al cliente correspondiente.|HU24|
|RF118|Debe registrarse el estado del pago.|HU24|
|RF119|La información del pago debe quedar almacenada.|HU24|
|RF120|El sistema debe permitir identificar pagos exitosos y fallidos.|HU24|



|RF121|Las operaciones que involucren varios documentos deben<br>ejecutarse dentro de una transacción cuando corresponda.|HU25|
|---|---|---|
|RF122|Si una operación falla, los cambios dentro de la transacción deben<br>revertirse.|HU25|
|RF123|No debe quedar una membresía actualizada parcialmente.|HU25|
|RF124|El sistema debe evitar estados inconsistentes entre pago,<br>membresía y acceso.|HU25|
|RF125|Debe poder demostrarse el uso de transacciones multi-documento<br>durante la sustentación.|HU25|



# **7ódulo de Capacitaciones** 

|**ID**|**Requerimiento**|**HU**|
|---|---|---|
|RF126|El administrador debe poder registrar una capacitación.|HU26|
|RF127|Debe poder ingresar la información básica de la capacitación.|HU26|
|RF128|La capacitación debe poder asociarse con un módulo cuando|HU26|



||corresponda.||
|---|---|---|
|RF129|La capacitación debe quedar almacenada correctamente.|HU26|
|RF130|La información registrada debe poder consultarse posteriormente.|HU26|
|RF131|El administrador debe poder establecer una fecha para la<br>capacitación.|HU27|
|RF132|Debe poder registrarse la modalidad de la capacitación.|HU27|
|RF133|Debe poder definirse el tipo de capacitación.|HU27|
|RF134|La capacitación programada debe quedar disponible para consulta.|HU27|
|RF135|El sistema debe permitir diferenciar capacitaciones masivas y<br>personalizadas.|HU27|
|RF136|El sistema debe permitir definir una capacitación como masiva o<br>personalizada.|HU28|
|RF137|Una capacitación masiva debe poder dirigirse a varios clientes.|HU28|
|RF138|Una capacitación personalizada debe poder asociarse a un cliente|HU28|



||específico.||
|---|---|---|
|RF139|El tipo de capacitación debe almacenarse correctamente.|HU28|
|RF140|La información debe poder consultarse posteriormente.|HU28|
|RF141|El administrador debe poder seleccionar una capacitación.|HU29|
|RF142|Debe poder registrar los participantes que asistieron.|HU29|
|RF143|La asistencia debe quedar asociada a la capacitación<br>correspondiente.|HU29|
|RF144|Debe poder identificarse el cliente o participante asociado.|HU29|
|RF145|La información de asistencia debe quedar almacenada para futuras<br>consultas y reportes.|HU29|



# **Módulo de Reportes y Analytics** 

|ID<br>RF146|Requerimiento<br>El sistema debe permitir consultar estadísticas relacionadas con|HU<br>HU30|
|---|---|---|



||los tickets.||
|---|---|---|
|RF147|Las estadísticas deben obtenerse a partir de la información<br>almacenada en MongoDB.|HU30|
|RF148|Los resultados deben poder representar cantidades de tickets.|HU30|
|RF149|La información debe poder utilizarse para analizar el<br>comportamiento de los problemas.|HU30|
|RF150|Las estadísticas deben generarse mediante operaciones de<br>agregación cuando corresponda.|HU30|
|RF151|El sistema debe permitir agrupar los tickets por módulo.|HU31|
|RF152|Debe mostrar la cantidad de tickets correspondiente a cada<br>módulo.|HU31|
|RF153|El resultado debe permitir comparar los diferentes módulos.|HU31|
|RF154|La consulta debe utilizar el Framework de Agregación de<br>MongoDB.|HU31|
|RF155|Debe utilizarse $group para realizar la agrupación.|HU31|



|RF156|Cuando corresponda, debe utilizarse $match para filtrar los datos<br>antes de la agrupación.|HU31|
|---|---|---|
|RF157|El sistema debe permitir generar reportes utilizando información<br>de diferentes colecciones.|HU32|
|RF158|Las consultas deben utilizar el Framework de Agregación de<br>MongoDB.|HU32|
|RF159|Debe utilizarse $lookup cuando sea necesario relacionar<br>documentos de diferentes colecciones.|HU32|
|RF160|Debe poder combinarse<br>look up conoperaciones como<br>match y $group.|HU32|
|RF161|Los resultados deben mostrar información útil para el análisis<br>del negocio.|HU32|



# **Requerimientos no Funcionales** 

|**ID**|**Requerimiento**|**Categoría**|**HU Relacionada**|
|---|---|---|---|
|RNF01|El sistema debe garantizar una<br>autenticación segura mediante<br>JWT.|Seguridad|HU01, HU02, HU03|
|RNF02|El sistema debe gestionar roles y<br>permisos de forma segura.|Seguridad|HU02|
|RNF03|Las solicitudes sin token válido<br>deben ser rechazadas.|Seguridad|HU03|
|RNF04|La base de datos debe ser<br>MongoDB.|Persistencia|HU04, HU07, HU18,<br>HU30|
|RNF05|El sistema debe permitir<br>almacenar diferentes estructuras<br>de información en una misma<br>colección (polimorfismo).|Persistencia|HU06, HU07|
|RNF06|MongoDB debe validar la<br>estructura de los documentos<br>según las reglas definidas.|Persistencia|HU07|
|RNF07|El sistema debe utilizar el índice|Rendimient|HU16|



||de texto de MongoDB para<br>búsquedas.|o||
|---|---|---|---|
|RNF08|Las operaciones que involucren<br>varios documentos deben ser<br>transaccionales.|Consistenci<br>a|HU25|
|RNF09|El sistema debe evitar estados<br>inconsistentes entre pago,<br>membresía y acceso.|Consistenci<br>a|HU25|
|RNF10|El sistema debe utilizar el<br>Framework de Agregación de<br>MongoDB para reportes.|Analítica|HU30, HU31, HU32|
|RNF11|Debe utilizarse<br>group,<br>_group_,match y $lookup según<br>corresponda en las agregaciones.|Analítica|HU31, HU32|
|RNF12|La información debe estar<br>disponible sin necesidad de<br>consultas manuales directamente<br>en MongoDB.|Usabilidad|HU17|
|RNF13|El sistema debe permitir la<br>escalabilidad en la gestión de<br>tickets, clientes y capacitaciones.|Escalabilida<br>d|HU04, HU18, HU26|



|RNF14|El sistema debe garantizar la<br>integridad de los datos en todo<br>momento.|Integridad|HU25, HU18, HU20|
|---|---|---|---|
|RNF15|El sistema debe ser capaz de<br>demostrar el uso de transacciones<br>multi-documento durante la<br>sustentación.|Demostrabi<br>lidad|HU25|



