package co.edu.ufpso.sistemasintegrados.tickets.service;

import co.edu.ufpso.sistemasintegrados.tickets.domain.EmpleadoCounter;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
public class EmpleadoCounterService {

    private static final String SCOPE = "global";

    private final MongoTemplate mongoTemplate;

    public EmpleadoCounterService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public String nextCodigo() {
        Query query = Query.query(Criteria.where("scope").is(SCOPE));
        Update update = new Update().inc("seq", 1L).setOnInsert("scope", SCOPE);
        FindAndModifyOptions options = FindAndModifyOptions.options().returnNew(true).upsert(true);

        EmpleadoCounter counter = mongoTemplate.findAndModify(query, update, options, EmpleadoCounter.class);
        long seq = counter != null ? counter.getSeq() : 1L;
        return "EMP-%04d".formatted(seq);
    }
}
