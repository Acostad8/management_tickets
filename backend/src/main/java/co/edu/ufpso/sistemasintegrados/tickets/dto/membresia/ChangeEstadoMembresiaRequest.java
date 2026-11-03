package co.edu.ufpso.sistemasintegrados.tickets.dto.membresia;

import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoMembresia;
import jakarta.validation.constraints.NotNull;

public record ChangeEstadoMembresiaRequest(
        @NotNull EstadoMembresia estado) {
}
