package co.tickets.service;

import co.tickets.domain.Ticket;
import co.tickets.dto.reportes.TicketsPorCliente;
import co.tickets.dto.reportes.TicketsPorEmpleado;
import co.tickets.dto.reportes.TiempoResolucionModulo;
import org.bson.Document;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationExpression;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.ArithmeticOperators;
import org.springframework.data.mongodb.core.aggregation.ConditionalOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReporteService {

    private final MongoTemplate mongoTemplate;

    public ReporteService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public List<TicketsPorCliente> ticketsPorCliente(int limit) {
        List<AggregationOperation> ops = new ArrayList<>();

        ops.add(Aggregation.group("clienteId")
                .count().as("totalTickets")
                .sum(ConditionalOperators.when(
                        new Criteria().orOperator(
                                Criteria.where("estado").is("nuevo"),
                                Criteria.where("estado").is("en_proceso"),
                                Criteria.where("estado").is("en_espera")))
                        .then(1).otherwise(0)).as("ticketsAbiertos")
                .sum(ConditionalOperators.when(Criteria.where("estado").is("resuelto"))
                        .then(1).otherwise(0)).as("ticketsResueltos"));

        ops.add(Aggregation.sort(Sort.by(Sort.Direction.DESC, "totalTickets")));
        ops.add(Aggregation.limit(limit));

        ops.add(Aggregation.lookup("clientes", "_id", "_id", "cliente"));
        ops.add(Aggregation.unwind("cliente", true));

        ops.add(Aggregation.project()
                .and("_id").as("clienteId")
                .and("cliente.nit").as("nit")
                .and("cliente.razonSocial").as("razonSocial")
                .and("totalTickets").as("totalTickets")
                .and("ticketsAbiertos").as("ticketsAbiertos")
                .and("ticketsResueltos").as("ticketsResueltos")
                .andExclude("_id"));

        AggregationResults<Document> res = mongoTemplate.aggregate(
                Aggregation.newAggregation(ops), Ticket.class, Document.class);

        List<TicketsPorCliente> out = new ArrayList<>();
        for (Document d : res.getMappedResults()) {
            out.add(new TicketsPorCliente(
                    objStr(d.get("clienteId")),
                    d.getString("nit"),
                    d.getString("razonSocial"),
                    numLong(d.get("totalTickets")),
                    numLong(d.get("ticketsAbiertos")),
                    numLong(d.get("ticketsResueltos"))));
        }
        return out;
    }

    public List<TicketsPorEmpleado> ticketsPorEmpleado(int limit) {
        List<AggregationOperation> ops = new ArrayList<>();

        ops.add(Aggregation.match(Criteria.where("empleadoAsignadoId").ne(null)));

        ops.add(Aggregation.group("empleadoAsignadoId")
                .count().as("totalAsignados")
                .sum(ConditionalOperators.when(Criteria.where("estado").is("resuelto"))
                        .then(1).otherwise(0)).as("resueltos")
                .sum(ConditionalOperators.when(Criteria.where("estado").is("en_proceso"))
                        .then(1).otherwise(0)).as("enProceso"));

        ops.add(Aggregation.sort(Sort.by(Sort.Direction.DESC, "totalAsignados")));
        ops.add(Aggregation.limit(limit));

        ops.add(Aggregation.lookup("empleados", "_id", "_id", "empleado"));
        ops.add(Aggregation.unwind("empleado", true));

        ops.add(Aggregation.project()
                .and("_id").as("empleadoId")
                .and("empleado.codigoEmpleado").as("codigoEmpleado")
                .and("empleado.nombre").as("nombre")
                .and("empleado.apellido").as("apellido")
                .and("empleado.area").as("area")
                .and("totalAsignados").as("totalAsignados")
                .and("resueltos").as("resueltos")
                .and("enProceso").as("enProceso")
                .andExclude("_id"));

        AggregationResults<Document> res = mongoTemplate.aggregate(
                Aggregation.newAggregation(ops), Ticket.class, Document.class);

        List<TicketsPorEmpleado> out = new ArrayList<>();
        for (Document d : res.getMappedResults()) {
            out.add(new TicketsPorEmpleado(
                    objStr(d.get("empleadoId")),
                    d.getString("codigoEmpleado"),
                    d.getString("nombre"),
                    d.getString("apellido"),
                    d.getString("area"),
                    numLong(d.get("totalAsignados")),
                    numLong(d.get("resueltos")),
                    numLong(d.get("enProceso"))));
        }
        return out;
    }

    public List<TiempoResolucionModulo> tiempoResolucionPorModulo() {
        List<AggregationOperation> ops = new ArrayList<>();

        ops.add(Aggregation.match(
                Criteria.where("estado").is("resuelto").and("fechaCierre").ne(null)));

        AggregationExpression horasResolucion = ArithmeticOperators.Divide.valueOf(
                ArithmeticOperators.Subtract.valueOf("fechaCierre").subtract("fechaCreacion"))
                .divideBy(1000L * 60 * 60);

        ops.add(Aggregation.project("modulo").and(horasResolucion).as("horas"));

        ops.add(Aggregation.group("modulo")
                .count().as("ticketsResueltos")
                .avg("horas").as("promedioHoras"));

        ops.add(Aggregation.project("ticketsResueltos", "promedioHoras")
                .and("_id").as("modulo").andExclude("_id"));

        ops.add(Aggregation.sort(Sort.by(Sort.Direction.ASC, "promedioHoras")));

        AggregationResults<Document> res = mongoTemplate.aggregate(
                Aggregation.newAggregation(ops), Ticket.class, Document.class);

        List<TiempoResolucionModulo> out = new ArrayList<>();
        for (Document d : res.getMappedResults()) {
            Object avg = d.get("promedioHoras");
            Double promedio = avg instanceof Number n ? n.doubleValue() : null;
            out.add(new TiempoResolucionModulo(
                    d.getString("modulo"),
                    numLong(d.get("ticketsResueltos")),
                    promedio));
        }
        return out;
    }

    private String objStr(Object o) {
        return o == null ? null : o.toString();
    }

    private long numLong(Object o) {
        if (o instanceof Number n) return n.longValue();
        return 0L;
    }
}
