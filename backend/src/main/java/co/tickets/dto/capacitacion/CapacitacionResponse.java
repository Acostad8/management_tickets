package co.tickets.dto.capacitacion;

import co.tickets.domain.Capacitacion;
import co.tickets.domain.enums.EstadoCapacitacion;
import co.tickets.domain.enums.ModalidadCapacitacion;
import co.tickets.domain.enums.ModuloErp;

import java.time.Instant;
import java.util.List;

public record CapacitacionResponse(
        String id,
        String titulo,
        String descripcion,
        ModuloErp modulo,
        ModalidadCapacitacion modalidad,
        Instant fechaProgramada,
        Integer duracionMinutos,
        String instructorId,
        String instructorNombre,
        List<String> clientesInvitados,
        Integer cupoMaximo,
        Long asistenciasRegistradas,
        EstadoCapacitacion estado,
        Instant fechaCreacion,
        Instant fechaActualizacion) {

    public static CapacitacionResponse from(Capacitacion c) {
        return from(c, null, null);
    }

    public static CapacitacionResponse from(Capacitacion c, String instructorNombre, Long asistencias) {
        return new CapacitacionResponse(
                c.getId(), c.getTitulo(), c.getDescripcion(),
                c.getModulo(), c.getModalidad(),
                c.getFechaProgramada(), c.getDuracionMinutos(),
                c.getInstructorId(), instructorNombre,
                c.getClientesInvitados(), c.getCupoMaximo(),
                asistencias,
                c.getEstado(),
                c.getFechaCreacion(), c.getFechaActualizacion());
    }
}
