package co.tickets.dto.empleado;

import co.tickets.domain.Empleado;
import co.tickets.domain.enums.AreaEmpleado;
import co.tickets.domain.enums.EstadoEmpleado;
import co.tickets.domain.enums.ModuloErp;
import co.tickets.domain.enums.NivelEmpleado;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record EmpleadoResponse(
        String id,
        String codigoEmpleado,
        String usuarioId,
        String nombre,
        String apellido,
        String email,
        String telefono,
        AreaEmpleado area,
        String cargo,
        List<ModuloErp> especialidad,
        NivelEmpleado nivel,
        EstadoEmpleado estado,
        LocalDate fechaIngreso,
        Instant fechaCreacion,
        Instant fechaActualizacion) {

    public static EmpleadoResponse from(Empleado e) {
        return new EmpleadoResponse(
                e.getId(), e.getCodigoEmpleado(), e.getUsuarioId(),
                e.getNombre(), e.getApellido(), e.getEmail(), e.getTelefono(),
                e.getArea(), e.getCargo(), e.getEspecialidad(), e.getNivel(),
                e.getEstado(), e.getFechaIngreso(),
                e.getFechaCreacion(), e.getFechaActualizacion());
    }
}
