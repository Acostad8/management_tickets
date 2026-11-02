package co.edu.ufpso.sistemasintegrados.tickets.bootstrap;

import co.edu.ufpso.sistemasintegrados.tickets.domain.PasswordResetToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexOperations;
import org.springframework.stereotype.Component;

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
    }

    private void ensurePasswordResetTokenIndexes() {
        IndexOperations ops = mongoTemplate.indexOps(PasswordResetToken.class);
        try {
            ops.ensureIndex(new Index().on("token", org.springframework.data.domain.Sort.Direction.ASC).unique());
            ops.ensureIndex(new Index().on("usuarioId", org.springframework.data.domain.Sort.Direction.ASC));
            ops.ensureIndex(new Index()
                    .on("fechaExpiracion", org.springframework.data.domain.Sort.Direction.ASC)
                    .expire(0, TimeUnit.SECONDS));
            log.info("Índices verificados en collection password_reset_tokens");
        } catch (Exception ex) {
            log.warn("No se pudieron crear/verificar índices en password_reset_tokens: {}", ex.getMessage());
        }
    }
}
