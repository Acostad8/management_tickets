package co.edu.ufpso.sistemasintegrados.tickets.bootstrap;

import co.edu.ufpso.sistemasintegrados.tickets.domain.Cliente;
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
}
