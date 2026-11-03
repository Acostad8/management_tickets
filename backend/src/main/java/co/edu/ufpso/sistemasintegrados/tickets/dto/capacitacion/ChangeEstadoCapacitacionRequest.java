package co.edu.ufpso.sistemasintegrados.tickets.dto.capacitacion;

import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoCapacitacion;
import jakarta.validation.constraints.NotNull;

public record ChangeEstadoCapacitacionRequest(
        @NotNull EstadoCapacitacion estado) {
}
