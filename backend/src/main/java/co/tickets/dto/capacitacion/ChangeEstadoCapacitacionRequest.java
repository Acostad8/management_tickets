package co.tickets.dto.capacitacion;

import co.tickets.domain.enums.EstadoCapacitacion;
import jakarta.validation.constraints.NotNull;

public record ChangeEstadoCapacitacionRequest(
        @NotNull EstadoCapacitacion estado) {
}
