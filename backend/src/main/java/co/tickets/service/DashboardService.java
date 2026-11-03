package co.tickets.service;

import co.tickets.domain.BaseConocimiento;
import co.tickets.domain.Ticket;
import co.tickets.domain.Usuario;
import co.tickets.dto.reportes.CountByKey;
import co.tickets.dto.reportes.DashboardSummary;
import co.tickets.dto.reportes.TicketPorDia;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.DateOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardService {

    private final MongoTemplate mongoTemplate;

    public DashboardService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public DashboardSummary resumen() {
        List<CountByKey> porEstado = ticketsPorEstado(null, null);
        long nuevos    = pickCount(porEstado, "nuevo");
        long enProceso = pickCount(porEstado, "en_proceso");
        long enEspera  = pickCount(porEstado, "en_espera");
        long resueltos = pickCount(porEstado, "resuelto");
        long cerrados  = pickCount(porEstado, "cerrado");
        long total     = porEstado.stream().mapToLong(CountByKey::count).sum();
        long abiertos  = nuevos + enProceso + enEspera;

        long articulos = mongoTemplate.count(new org.springframework.data.mongodb.core.query.Query(), BaseConocimiento.class);
        long usuarios  = mongoTemplate.count(new org.springframework.data.mongodb.core.query.Query(), Usuario.class);
        long clientes  = mongoTemplate.getCollection("clientes").countDocuments();

        return new DashboardSummary(
                total, abiertos, resueltos, cerrados, nuevos, enProceso, enEspera,
                articulos, usuarios, clientes,
                ticketsPorPrioridad(),
                ticketsPorModulo(null, null));
    }

    public List<CountByKey> ticketsPorEstado(Instant desde, Instant hasta) {
        return groupedCount("estado", desde, hasta, null);
    }

    public List<CountByKey> ticketsPorModulo(Instant desde, Instant hasta) {
        return groupedCount("modulo", desde, hasta, null);
    }

    public List<CountByKey> ticketsPorPrioridad() {
        return groupedCount("prioridad", null, null, null);
    }

    public List<CountByKey> ticketsPorTipo() {
        return groupedCount("tipo", null, null, null);
    }

    public List<TicketPorDia> ticketsPorDia(Instant desde, Instant hasta) {
        var ops = new java.util.ArrayList<org.springframework.data.mongodb.core.aggregation.AggregationOperation>();

        Criteria filter = new Criteria();
        boolean hasFilter = false;
        if (desde != null) { filter = filter.and("fechaCreacion").gte(desde); hasFilter = true; }
        if (hasta != null) { filter = (hasFilter ? filter : Criteria.where("fechaCreacion")).lte(hasta); hasFilter = true; }
        if (hasFilter) ops.add(Aggregation.match(filter));

        ops.add(Aggregation.project()
                .and(DateOperators.DateToString.dateOf("fechaCreacion").toString("%Y-%m-%d")).as("fecha"));
        ops.add(Aggregation.group("fecha").count().as("count"));
        ops.add(Aggregation.project("count").and("_id").as("fecha").andExclude("_id"));
        ops.add(Aggregation.sort(org.springframework.data.domain.Sort.by("fecha")));

        AggregationResults<Document> results = mongoTemplate.aggregate(
                Aggregation.newAggregation(ops), Ticket.class, Document.class);

        List<TicketPorDia> out = new ArrayList<>();
        for (Document d : results.getMappedResults()) {
            out.add(new TicketPorDia(d.getString("fecha"), ((Number) d.get("count")).longValue()));
        }
        return out;
    }

    private List<CountByKey> groupedCount(String field, Instant desde, Instant hasta, String extraValueFilter) {
        var ops = new java.util.ArrayList<org.springframework.data.mongodb.core.aggregation.AggregationOperation>();

        Criteria base = null;
        if (desde != null) base = Criteria.where("fechaCreacion").gte(desde);
        if (hasta != null) base = (base == null ? Criteria.where("fechaCreacion") : base).lte(hasta);
        if (base != null) ops.add(Aggregation.match(base));

        ops.add(Aggregation.group(field).count().as("count"));
        ops.add(Aggregation.project("count").and("_id").as("key").andExclude("_id"));
        ops.add(Aggregation.sort(org.springframework.data.domain.Sort.by(
                org.springframework.data.domain.Sort.Direction.DESC, "count")));

        AggregationResults<Document> results = mongoTemplate.aggregate(
                Aggregation.newAggregation(ops), Ticket.class, Document.class);

        List<CountByKey> out = new ArrayList<>();
        for (Document d : results.getMappedResults()) {
            String key = d.get("key") == null ? "null" : d.get("key").toString();
            out.add(new CountByKey(key, ((Number) d.get("count")).longValue()));
        }
        return out;
    }

    private long pickCount(List<CountByKey> list, String key) {
        return list.stream().filter(x -> key.equals(x.key())).mapToLong(CountByKey::count).sum();
    }
}
