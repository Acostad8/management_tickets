package co.tickets.dto.kb;

import co.tickets.domain.enums.EstadoArticulo;
import jakarta.validation.constraints.NotNull;

public record CambiarEstadoArticuloRequest(
        @NotNull EstadoArticulo estado) {
}
