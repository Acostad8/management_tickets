package co.tickets.dto.membresia;

import co.tickets.domain.enums.EstadoMembresia;
import jakarta.validation.constraints.NotNull;

public record ChangeEstadoMembresiaRequest(
        @NotNull EstadoMembresia estado) {
}
