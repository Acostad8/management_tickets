package co.edu.ufpso.sistemasintegrados.tickets.dto.empleado;

import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoEmpleado;
import jakarta.validation.constraints.NotNull;

public record ChangeEstadoEmpleadoRequest(
        @NotNull EstadoEmpleado estado) {
}
