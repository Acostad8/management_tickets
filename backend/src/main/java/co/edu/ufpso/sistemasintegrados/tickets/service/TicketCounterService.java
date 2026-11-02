package co.edu.ufpso.sistemasintegrados.tickets.service;

import co.edu.ufpso.sistemasintegrados.tickets.domain.TicketCounter;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;

@Service
public class TicketCounterService {

    private final MongoTemplate mongoTemplate;

    public TicketCounterService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public String nextCodigo(String clienteId) {
        int anio = LocalDate.now(ZoneId.systemDefault()).getYear();
        Query query = Query.query(Criteria.where("clienteId").is(clienteId).and("anio").is(anio));
        Update update = new Update().inc("seq", 1L).setOnInsert("clienteId", clienteId).setOnInsert("anio", anio);
        FindAndModifyOptions options = FindAndModifyOptions.options().returnNew(true).upsert(true);

        TicketCounter counter = mongoTemplate.findAndModify(query, update, options, TicketCounter.class);
        long seq = counter != null ? counter.getSeq() : 1L;
        return "TK-%d-%04d".formatted(anio, seq);
    }
}
