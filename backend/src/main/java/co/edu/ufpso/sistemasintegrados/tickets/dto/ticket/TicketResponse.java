package co.edu.ufpso.sistemasintegrados.tickets.dto.ticket;

import co.edu.ufpso.sistemasintegrados.tickets.domain.Ticket;
import co.edu.ufpso.sistemasintegrados.tickets.domain.embedded.HistorialEstado;
import co.edu.ufpso.sistemasintegrados.tickets.domain.embedded.RespuestaTicket;
import co.edu.ufpso.sistemasintegrados.tickets.domain.embedded.SolucionTicket;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoTicket;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.ModuloErp;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.PrioridadTicket;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.TipoTicket;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public record TicketResponse(
        String id,
        String codigo,
        String titulo,
        String descripcion,
        TipoTicket tipo,
        String clienteId,
        String usuarioId,
        String empleadoAsignadoId,
        ModuloErp modulo,
        PrioridadTicket prioridad,
        EstadoTicket estado,
        Map<String, Object> detallesEspecificos,
        List<RespuestaTicket> respuestas,
        SolucionTicket solucion,
        List<HistorialEstado> historialEstados,
        Instant fechaCreacion,
        Instant fechaActualizacion,
        Instant fechaCierre) {

    public static TicketResponse from(Ticket t) {
        return new TicketResponse(
                t.getId(), t.getCodigo(), t.getTitulo(), t.getDescripcion(), t.getTipo(),
                t.getClienteId(), t.getUsuarioId(), t.getEmpleadoAsignadoId(),
                t.getModulo(), t.getPrioridad(), t.getEstado(),
                t.getDetallesEspecificos(), t.getRespuestas(), t.getSolucion(), t.getHistorialEstados(),
                t.getFechaCreacion(), t.getFechaActualizacion(), t.getFechaCierre());
    }

    public static TicketResponse summary(Ticket t) {
        return new TicketResponse(
                t.getId(), t.getCodigo(), t.getTitulo(), null, t.getTipo(),
                t.getClienteId(), t.getUsuarioId(), t.getEmpleadoAsignadoId(),
                t.getModulo(), t.getPrioridad(), t.getEstado(),
                null, null, null, null,
                t.getFechaCreacion(), t.getFechaActualizacion(), t.getFechaCierre());
    }
}
