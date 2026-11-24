package co.tickets.dto.empleado;

import co.tickets.domain.enums.EstadoEmpleado;
import jakarta.validation.constraints.NotNull;

public record ChangeEstadoEmpleadoRequest(
        @NotNull EstadoEmpleado estado) {
}
