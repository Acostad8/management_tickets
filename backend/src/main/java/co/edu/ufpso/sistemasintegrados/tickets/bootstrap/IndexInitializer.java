package co.edu.ufpso.sistemasintegrados.tickets.bootstrap;

import co.edu.ufpso.sistemasintegrados.tickets.domain.Asistencia;
import co.edu.ufpso.sistemasintegrados.tickets.domain.Capacitacion;
import co.edu.ufpso.sistemasintegrados.tickets.domain.Cliente;
import co.edu.ufpso.sistemasintegrados.tickets.domain.Empleado;
import co.edu.ufpso.sistemasintegrados.tickets.domain.Membresia;
import co.edu.ufpso.sistemasintegrados.tickets.domain.Pago;
import co.edu.ufpso.sistemasintegrados.tickets.domain.PasswordResetToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.CompoundIndexDefinition;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexOperations;
import org.springframework.stereotype.Component;

import org.bson.Document;
import java.util.concurrent.TimeUnit;

@Component
public class IndexInitializer {

    private static final Logger log = LoggerFactory.getLogger(IndexInitializer.class);

    private final MongoTemplate mongoTemplate;

    public IndexInitializer(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void initIndexes() {
        ensurePasswordResetTokenIndexes();
        ensureClienteIndexes();
        ensureEmpleadoIndexes();
        ensureMembresiaIndexes();
        ensurePagoIndexes();
        ensureCapacitacionIndexes();
        ensureAsistenciaIndexes();
    }

    private void ensurePasswordResetTokenIndexes() {
        IndexOperations ops = mongoTemplate.indexOps(PasswordResetToken.class);
        try {
            ops.ensureIndex(new Index().on("token", Sort.Direction.ASC).unique());
            ops.ensureIndex(new Index().on("usuarioId", Sort.Direction.ASC));
            ops.ensureIndex(new Index()
                    .on("fechaExpiracion", Sort.Direction.ASC)
                    .expire(0, TimeUnit.SECONDS));
            log.info("Índices verificados en collection password_reset_tokens");
        } catch (Exception ex) {
            log.warn("No se pudieron crear/verificar índices en password_reset_tokens: {}", ex.getMessage());
        }
    }

    private void ensureClienteIndexes() {
        IndexOperations ops = mongoTemplate.indexOps(Cliente.class);
        try {
            ops.ensureIndex(new Index().on("nit", Sort.Direction.ASC).unique());
            Document keys = new Document().append("ciudad", 1).append("estado", 1);
            ops.ensureIndex(new CompoundIndexDefinition(keys).named("ciudad_1_estado_1"));
            log.info("Índices verificados en collection clientes");
        } catch (Exception ex) {
            log.warn("No se pudieron crear/verificar índices en clientes: {}", ex.getMessage());
        }
    }

    private void ensureEmpleadoIndexes() {
        IndexOperations ops = mongoTemplate.indexOps(Empleado.class);
        try {
            ops.ensureIndex(new Index().on("codigoEmpleado", Sort.Direction.ASC).unique());
            ops.ensureIndex(new Index().on("usuarioId", Sort.Direction.ASC).unique());
            Document keys = new Document().append("especialidad", 1).append("estado", 1);
            ops.ensureIndex(new CompoundIndexDefinition(keys).named("especialidad_1_estado_1"));
            log.info("Índices verificados en collection empleados");
        } catch (Exception ex) {
            log.warn("No se pudieron crear/verificar índices en empleados: {}", ex.getMessage());
        }
    }

    private void ensureMembresiaIndexes() {
        IndexOperations ops = mongoTemplate.indexOps(Membresia.class);
        try {
            Document clienteEstado = new Document().append("clienteId", 1).append("estado", 1);
            ops.ensureIndex(new CompoundIndexDefinition(clienteEstado).named("clienteId_1_estado_1"));
            Document estadoVenc = new Document().append("estado", 1).append("fechaVencimiento", 1);
            ops.ensureIndex(new CompoundIndexDefinition(estadoVenc).named("estado_1_fechaVencimiento_1"));
            log.info("Índices verificados en collection membresias");
        } catch (Exception ex) {
            log.warn("No se pudieron crear/verificar índices en membresias: {}", ex.getMessage());
        }
    }

    private void ensurePagoIndexes() {
        IndexOperations ops = mongoTemplate.indexOps(Pago.class);
        try {
            Document clienteFecha = new Document().append("clienteId", 1).append("fechaPago", -1);
            ops.ensureIndex(new CompoundIndexDefinition(clienteFecha).named("clienteId_1_fechaPago_-1"));
            ops.ensureIndex(new Index().on("membresiaId", Sort.Direction.ASC));
            ops.ensureIndex(new Index().on("fechaPago", Sort.Direction.DESC));
            ops.ensureIndex(new Index()
                    .on("referencia", Sort.Direction.ASC)
                    .unique()
                    .sparse()
                    .named("referencia_unique_sparse"));
            log.info("Índices verificados en collection pagos");
        } catch (Exception ex) {
            log.warn("No se pudieron crear/verificar índices en pagos: {}", ex.getMessage());
        }
    }

    private void ensureCapacitacionIndexes() {
        IndexOperations ops = mongoTemplate.indexOps(Capacitacion.class);
        try {
            Document estadoFecha = new Document().append("estado", 1).append("fechaProgramada", 1);
            ops.ensureIndex(new CompoundIndexDefinition(estadoFecha).named("estado_1_fechaProgramada_1"));
            ops.ensureIndex(new Index().on("modalidad", Sort.Direction.ASC));
            ops.ensureIndex(new Index().on("clientesInvitados", Sort.Direction.ASC));
            log.info("Índices verificados en collection capacitaciones");
        } catch (Exception ex) {
            log.warn("No se pudieron crear/verificar índices en capacitaciones: {}", ex.getMessage());
        }
    }

    private void ensureAsistenciaIndexes() {
        IndexOperations ops = mongoTemplate.indexOps(Asistencia.class);
        try {
            Document capacitacionDoc = new Document().append("capacitacionId", 1).append("participanteDocumento", 1);
            ops.ensureIndex(new CompoundIndexDefinition(capacitacionDoc).named("capacitacionId_1_participanteDocumento_1").unique());
            ops.ensureIndex(new Index().on("clienteId", Sort.Direction.ASC));
            ops.ensureIndex(new Index().on("capacitacionId", Sort.Direction.ASC));
            log.info("Índices verificados en collection asistencias");
        } catch (Exception ex) {
            log.warn("No se pudieron crear/verificar índices en asistencias: {}", ex.getMessage());
        }
    }
}
