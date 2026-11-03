package co.edu.ufpso.sistemasintegrados.tickets.service;

import co.edu.ufpso.sistemasintegrados.tickets.domain.BaseConocimiento;
import co.edu.ufpso.sistemasintegrados.tickets.domain.Capacitacion;
import co.edu.ufpso.sistemasintegrados.tickets.domain.Membresia;
import co.edu.ufpso.sistemasintegrados.tickets.domain.Ticket;
import co.edu.ufpso.sistemasintegrados.tickets.domain.Usuario;
import co.edu.ufpso.sistemasintegrados.tickets.dto.reportes.CountByKey;
import co.edu.ufpso.sistemasintegrados.tickets.dto.reportes.DashboardSummary;
import co.edu.ufpso.sistemasintegrados.tickets.dto.reportes.TicketPorDia;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationExpression;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.ArithmeticOperators;
import org.springframework.data.mongodb.core.aggregation.DateOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardService {

    private final MongoTemplate mongoTemplate;

    public DashboardService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public DashboardSummary resumen(Instant desde, Instant hasta) {
        List<CountByKey> porEstado = ticketsPorEstado(desde, hasta);
        long nuevos    = pickCount(porEstado, "nuevo");
        long enProceso = pickCount(porEstado, "en_proceso");
        long enEspera  = pickCount(porEstado, "en_espera");
        long resueltos = pickCount(porEstado, "resuelto");
        long cerrados  = pickCount(porEstado, "cerrado");
        long total     = porEstado.stream().mapToLong(CountByKey::count).sum();
        long abiertos  = nuevos + enProceso + enEspera;

        long articulos = mongoTemplate.count(new Query(), BaseConocimiento.class);
        long usuarios  = mongoTemplate.count(new Query(), Usuario.class);
        long clientes  = mongoTemplate.getCollection("clientes").countDocuments();

        Double promedioHoras = promedioHorasResolucion(desde, hasta);

        LocalDate hoy = LocalDate.now();
        LocalDate en30 = hoy.plusDays(30);
        java.util.Date hoyDate = java.util.Date.from(hoy.atStartOfDay(ZoneOffset.UTC).toInstant());
        java.util.Date en30Date = java.util.Date.from(en30.atStartOfDay(ZoneOffset.UTC).toInstant());

        long membresiasActivas = mongoTemplate.count(
                new Query(Criteria.where("estado").is("activa")), Membresia.class);
        long membresiasPorVencer = mongoTemplate.count(
                new Query(Criteria.where("estado").is("activa")
                        .and("fechaVencimiento").gte(hoyDate).lte(en30Date)), Membresia.class);
        long capacitacionesProximas = mongoTemplate.count(
                new Query(Criteria.where("estado").is("programada")
                        .and("fechaProgramada").gte(Instant.now())
                        .lte(en30.atStartOfDay().toInstant(ZoneOffset.UTC))),
                Capacitacion.class);

        return new DashboardSummary(
                total, abiertos, resueltos, cerrados, nuevos, enProceso, enEspera,
                articulos, usuarios, clientes,
                promedioHoras, membresiasActivas, membresiasPorVencer, capacitacionesProximas,
                ticketsPorPrioridad(desde, hasta),
                ticketsPorModulo(desde, hasta));
    }

    public List<CountByKey> ticketsPorEstado(Instant desde, Instant hasta) {
        return groupedCount("estado", desde, hasta);
    }

    public List<CountByKey> ticketsPorModulo(Instant desde, Instant hasta) {
        return groupedCount("modulo", desde, hasta);
    }

    public List<CountByKey> ticketsPorPrioridad() {
        return groupedCount("prioridad", null, null);
    }

    public List<CountByKey> ticketsPorPrioridad(Instant desde, Instant hasta) {
        return groupedCount("prioridad", desde, hasta);
    }

    public List<CountByKey> ticketsPorTipo() {
        return groupedCount("tipo", null, null);
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

    private Double promedioHorasResolucion(Instant desde, Instant hasta) {
        var ops = new java.util.ArrayList<org.springframework.data.mongodb.core.aggregation.AggregationOperation>();

        Criteria base = Criteria.where("estado").is("resuelto").and("fechaCierre").ne(null);
        if (desde != null || hasta != null) {
            Criteria rango = Criteria.where("fechaCreacion");
            if (desde != null) rango = rango.gte(desde);
            if (hasta != null) rango = rango.lte(hasta);
            base = new Criteria().andOperator(base, rango);
        }
        ops.add(Aggregation.match(base));

        AggregationExpression horas = ArithmeticOperators.Divide.valueOf(
                ArithmeticOperators.Subtract.valueOf("fechaCierre").subtract("fechaCreacion"))
                .divideBy(1000L * 60 * 60);
        ops.add(Aggregation.project().and(horas).as("horas"));
        ops.add(Aggregation.group().avg("horas").as("promedio"));

        AggregationResults<Document> res = mongoTemplate.aggregate(
                Aggregation.newAggregation(ops), Ticket.class, Document.class);
        Document d = res.getUniqueMappedResult();
        if (d == null) return null;
        Object avg = d.get("promedio");
        return avg instanceof Number n ? n.doubleValue() : null;
    }

    private List<CountByKey> groupedCount(String field, Instant desde, Instant hasta) {
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
